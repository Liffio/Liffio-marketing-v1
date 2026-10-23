'use client';

import { useSyncExternalStore } from 'react';

const noopSubscribe = () => () => {};

/**
 * "Are we past hydration?" without a setState-in-effect. Mirrors the
 * `useHydrated` pattern in `(auth)/onboarding/onboarding-flow.tsx`: the
 * server snapshot is `false`, the client snapshot is `true`, and React
 * handles the transition itself instead of a `useState(false)` +
 * `useEffect(() => setMounted(true))` cascading render.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}
