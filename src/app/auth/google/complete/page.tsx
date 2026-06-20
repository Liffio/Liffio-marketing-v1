'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authStore } from '@/lib/auth/store';
import { getAuthMe, appHandoffUrl } from '@/lib/auth/api';
import { Spinner } from '@/lib/auth/ui';

function GoogleAuthCompleteInner() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get('token');
    const redirectPath = params.get('redirect') ?? '/dashboard';

    if (!token) {
      router.replace('/login?error=google_failed');
      return;
    }

    const finish = async () => {
      authStore.setSession({ accessToken: token });
      const authMe = await getAuthMe({ token });
      authStore.setAuthMe(authMe);
      const { emailVerified, isOnboarded } = authStore.getState();

      if (!emailVerified) {
        router.replace(`/confirm-email?redirect=${encodeURIComponent(redirectPath)}`);
        return;
      }
      if (!isOnboarded) {
        router.replace('/onboarding');
        return;
      }
      window.location.href = appHandoffUrl(token, redirectPath);
    };

    finish().catch(() => router.replace('/login?error=google_failed'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 p-6" style={{ background: 'linear-gradient(135deg, #f3f0ff 0%, #ede8fe 40%, #fce8ff 70%, #fff0f8 100%)' }}>
      <Spinner size={32} />
      <p className="text-sm text-gray-500">Completing sign in with Google…</p>
    </div>
  );
}

export default function GoogleAuthComplete() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Spinner size={32} /></div>}>
      <GoogleAuthCompleteInner />
    </Suspense>
  );
}
