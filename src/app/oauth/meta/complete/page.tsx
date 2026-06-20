'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { META_OAUTH_BC_CHANNEL, META_OAUTH_MESSAGE_TYPE, META_OAUTH_CLOSE_MESSAGE_TYPE, type MetaOAuthResult } from '@/lib/auth/meta-oauth-popup';
import { isWorkspaceInstagramConnected } from '@/lib/auth/api';
import { InstagramIcon, Spinner } from '@/lib/auth/ui';

function MetaOAuthCompleteInner() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const meta = params.get('meta');
    const reason = params.get('reason') ?? undefined;
    const stepRaw = Number(params.get('step'));
    const step = Number.isFinite(stepRaw) && stepRaw > 0 ? Math.min(Math.max(stepRaw, 1), 3) : 3;
    const workspaceId = params.get('workspaceId') ?? undefined;
    const igHandle = params.get('igHandle') ?? null;
    const returnTo = params.get('returnTo') === 'settings' ? 'settings' : 'onboarding';

    const result: MetaOAuthResult =
      meta === 'connected'
        ? { meta: 'connected', step, workspaceId, igHandle }
        : { meta: 'error', reason: reason ?? 'token_exchange_failed' };

    const run = async () => {
      // Try window.opener first
      if (window.opener && !window.opener.closed) {
        try {
          window.opener.postMessage({ type: META_OAUTH_MESSAGE_TYPE, payload: result }, window.location.origin);
          window.opener.postMessage({ type: META_OAUTH_CLOSE_MESSAGE_TYPE }, window.location.origin);
          window.close();
          return;
        } catch { /* opener may be cross-origin */ }
      }

      // BroadcastChannel fallback (COOP severs opener)
      try {
        if (typeof BroadcastChannel !== 'undefined') {
          const bc = new BroadcastChannel(META_OAUTH_BC_CHANNEL);
          bc.postMessage({ type: META_OAUTH_MESSAGE_TYPE, payload: result });
          bc.postMessage({ type: META_OAUTH_CLOSE_MESSAGE_TYPE });
          bc.close();
        }
      } catch { /* ignore */ }

      // Direct navigation fallback (no opener, no BC)
      if (result.meta === 'connected') {
        if (workspaceId) {
          const persisted = await isWorkspaceInstagramConnected(workspaceId);
          if (!persisted) {
            router.replace(`/${returnTo === 'settings' ? 'settings' : 'onboarding'}?meta=error&reason=connection_not_persisted`);
            return;
          }
        }
        if (returnTo === 'settings') {
          window.close();
          return;
        }
        router.replace(`/onboarding?meta=connected&step=${step}`);
        return;
      }

      router.replace(`/onboarding?meta=error&reason=${encodeURIComponent(reason ?? 'token_exchange_failed')}`);
    };

    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 p-6" style={{ background: 'linear-gradient(135deg, #f3f0ff 0%, #ede8fe 40%, #fce8ff 70%, #fff0f8 100%)' }}>
      <div className="text-brand-500 animate-pulse">
        <InstagramIcon size={32} />
      </div>
      <p className="text-sm text-gray-500">Completing Instagram connection…</p>
    </div>
  );
}

export default function MetaOAuthComplete() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Spinner size={32} /></div>}>
      <MetaOAuthCompleteInner />
    </Suspense>
  );
}
