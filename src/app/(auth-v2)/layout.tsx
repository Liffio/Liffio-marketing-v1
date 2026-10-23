import type { ReactNode } from 'react';
import { authPageMetadata } from '@/lib/auth/metadata';
import './auth-v2.css';

// Shared with the old (auth) layout's metadata, so register, login and
// confirm-email keep the exact same noindex title/description as the group
// they moved out of. See src/app/(auth)/layout.tsx for why these two fields
// are the only ones set here.
export const metadata = authPageMetadata;

export default function AuthV2Layout({ children }: { children: ReactNode }) {
  return <div className="a2-root">{children}</div>;
}
