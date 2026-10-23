import type { ReactNode } from 'react';
import Logo from '@/components/Logo';
import { authPageMetadata } from '@/lib/auth/metadata';

// `robots` used to be the only field set here. None of the routes in this
// group (onboarding, forgot-password, complete-signup) exports metadata of
// its own (all are client components), so Next.js's shallow per-field merge
// hands every unset field down from the ROOT layout, which spreads `rootSeo`
// (src/config/seo.config.ts). Noindexed auth screens therefore served the
// homepage's title, description, `alternates.canonical` (resolving to "/"),
// openGraph block (homepage title/description, url = SITE_URL, homepage OG
// card) and twitter card.
//
// `authPageMetadata` (shared with the (auth-v2) layout, which covers
// register, login and confirm-email) replaces the two fields that describe
// the page itself; one pair covers the whole group. Canonical and the
// openGraph/twitter block are still inherited from root and still describe
// the homepage, deliberately left alone here, since `robots: 'noindex'`
// already keeps these URLs out of the index and changing them is a separate
// call.
export const metadata = authPageMetadata;

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen flex flex-col bg-background">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-soft-gradient opacity-80" />
      <header className="relative z-10 px-6 py-5 flex items-center">
        <Logo size="small" />
      </header>
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 pb-16 pt-4">
        {children}
      </main>
    </div>
  );
}
