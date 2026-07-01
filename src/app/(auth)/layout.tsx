import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import Logo from '@/components/Logo';

export const metadata: Metadata = {
  robots: 'noindex',
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 40%, #ffe0f0 70%, #fff0f5 100%)' }}>
      <header className="px-6 py-5 flex items-center">
        <Logo size="small" />
      </header>
      <main className="flex-1 flex items-center justify-center px-4 pb-16 pt-4">
        {children}
      </main>
    </div>
  );
}
