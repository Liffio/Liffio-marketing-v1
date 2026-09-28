'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { authStore } from '@/lib/auth/store';
import { getAuthMe } from '@/lib/auth/api';
import { nextSignupStep } from '@/lib/auth/signup-steps';
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
      // Terms + Privacy acceptance first, for every account that has not agreed yet (new Google
      // signups always land there). Google already verified the email, so onboarding is next.
      const next = nextSignupStep(authStore.getState(), token, redirectPath);
      if (next.kind === 'site') router.replace(next.path);
      else window.location.href = next.url;
    };

    finish().catch(() => router.replace('/login?error=google_failed'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 p-6" style={{ background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 40%, #ffe0f0 70%, #fff0f5 100%)' }}>
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
