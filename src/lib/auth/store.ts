'use client';

import { useSyncExternalStore } from 'react';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  country?: string | null;
};

export type AuthorizationModule = {
  key: string;
  name: string;
  actions: string[];
};

export type AuthMePayload = {
  user: AuthUser;
  workspaceId: string;
  role: string;
  modules: AuthorizationModule[];
  permissions: string[];
  isPlatformSuperAdmin: boolean;
  isOnboarded: boolean;
  emailVerified: boolean;
  mfaEnabled: boolean;
  mfaEmailOtpEnabled: boolean;
  mfaSmsOtpEnabled: boolean;
  mfaOnboardingConsentAt: string | null;
};

export type AuthState = {
  accessToken: string | null;
  user: AuthUser | null;
  workspaceId: string | null;
  isOnboarded: boolean;
  emailVerified: boolean;
  role: string | null;
  permissions: string[];
};

const TOKEN_KEY = 'liffio_access_token';
const isBrowser = typeof window !== 'undefined';

const initialState: AuthState = {
  accessToken: isBrowser ? localStorage.getItem(TOKEN_KEY) : null,
  user: null,
  workspaceId: null,
  isOnboarded: false,
  emailVerified: false,
  role: null,
  permissions: [],
};

let state: AuthState = initialState;
const listeners = new Set<() => void>();

function setState(next: AuthState) {
  state = next;
  listeners.forEach((l) => l());
}

export const authStore = {
  getState: (): AuthState => state,

  subscribe(listener: () => void): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  setSession({ accessToken }: { accessToken: string }) {
    if (isBrowser) localStorage.setItem(TOKEN_KEY, accessToken);
    setState({ ...state, accessToken });
  },

  setAuthMe(payload: AuthMePayload) {
    setState({
      ...state,
      user: payload.user,
      workspaceId: payload.workspaceId,
      isOnboarded: payload.isOnboarded,
      emailVerified: payload.emailVerified,
      role: payload.role,
      permissions: payload.permissions,
    });
  },

  clear() {
    if (isBrowser) localStorage.removeItem(TOKEN_KEY);
    setState({ ...initialState, accessToken: null });
  },
};

const serverSnapshot: AuthState = {
  accessToken: null,
  user: null,
  workspaceId: null,
  isOnboarded: false,
  emailVerified: false,
  role: null,
  permissions: [],
};

export function useAuthState(): AuthState;
export function useAuthState<T>(selector: (s: AuthState) => T): T;
export function useAuthState<T>(selector?: (s: AuthState) => T): AuthState | T {
  return useSyncExternalStore<AuthState | T>(
    authStore.subscribe,
    selector ? () => selector(authStore.getState()) : authStore.getState,
    selector ? () => selector(serverSnapshot) : () => serverSnapshot,
  );
}
