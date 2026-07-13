import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import Logo from '@/components/Logo';

export const metadata: Metadata = {
  robots: 'noindex',
};

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
