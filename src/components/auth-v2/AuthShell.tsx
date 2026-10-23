import type { ReactNode } from 'react';
import Link from 'next/link';
import { AuthStoryPanel } from './AuthStoryPanel';

/**
 * The two-column shell shared by register, confirm-email and login
 * (`auth-design-reference.html`). Onboarding, forgot-password and
 * complete-signup keep the old `(auth)/layout.tsx` card shell untouched.
 */
export function AuthShell({
  topRight,
  storyHeadline,
  glow,
  children,
}: {
  topRight: ReactNode;
  storyHeadline: string;
  glow?: 'err' | 'ok';
  children: ReactNode;
}) {
  const glowClass = glow === 'err' ? ' a2-glow-err' : glow === 'ok' ? ' a2-glow-ok' : '';

  return (
    <div className="a2-stage">
      <div className="a2-shell">
        <div className={`a2-side${glowClass}`}>
          <div className="a2-top">
            <Link href="/" className="a2-brand" aria-label="Liffio home">
              {/* eslint-disable-next-line @next/next/no-img-element -- fixed local asset, no next/image intrinsic size needed */}
              <img src="/logo/favicon-red.png" alt="Liffio" style={{ height: 28, width: 'auto', display: 'block' }} />
            </Link>
            <div>{topRight}</div>
          </div>

          <div className="a2-mid">
            <div className="a2-form">{children}</div>
          </div>

          <div className="a2-legal">
            <Link href="/terms-of-service">Terms</Link>
            <Link href="/privacy-policy">Privacy</Link>
            <Link href="/help">Help</Link>
          </div>
        </div>

        <AuthStoryPanel headline={storyHeadline} />
      </div>
    </div>
  );
}
