import { authStore, type AuthMePayload } from './store';

export const API_BASE: string =
  (process.env.NEXT_PUBLIC_API_URL as string | undefined) ?? 'https://api.liffio.com';

export const APP_BASE: string =
  (process.env.NEXT_PUBLIC_APP_URL as string | undefined) ?? 'https://app.liffio.com';

const V1 = '/api/v1';

function formatApiError(payload: unknown): string {
  if (!payload || typeof payload !== 'object') return 'Request failed';
  const raw = (payload as { error?: unknown }).error;
  if (typeof raw === 'string') return raw;
  if (raw && typeof raw === 'object') {
    const flat = raw as { formErrors?: string[]; fieldErrors?: Record<string, string[] | string> };
    const parts: string[] = [];
    for (const msg of flat.formErrors ?? []) if (typeof msg === 'string') parts.push(msg);
    for (const [k, v] of Object.entries(flat.fieldErrors ?? {})) {
      parts.push(Array.isArray(v) ? `${k}: ${v.join(', ')}` : `${k}: ${v}`);
    }
    if (parts.length) return parts.join('; ');
  }
  return 'Request failed';
}

type RequestConfig = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  token?: string | null;
  workspaceId?: string;
};

export async function apiRequest<T>(path: string, config: RequestConfig = {}): Promise<T> {
  const token =
    config.token === null ? null : (config.token ?? authStore.getState().accessToken);
  const method = config.method ?? 'GET';
  const hasBody = config.body !== undefined && config.body !== null;
  const usesJson = hasBody || method !== 'GET';
  const jsonBody = hasBody ? config.body : usesJson ? {} : undefined;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    cache: 'no-store',
    credentials: 'include',
    headers: {
      ...(usesJson ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(config.workspaceId ? { 'x-workspace-id': config.workspaceId } : {}),
    },
    ...(jsonBody !== undefined ? { body: JSON.stringify(jsonBody) } : {}),
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new Error(formatApiError(payload));
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

// ── Types ──────────────────────────────────────────────────────────────────

export type LoginSuccess = {
  accessToken: string;
  user: { id: string; email: string; name: string };
  authorization: {
    workspaceId: string;
    role: string;
    permissions: string[];
    isOnboarded: boolean;
    emailVerified: boolean;
  };
};

export type MfaChallenge = {
  mfaRequired: true;
  preAuthToken: string;
  methods: Array<'authenticator' | 'email'>;
};

export type RegisterInput = {
  email: string;
  name: string;
  password: string;
  country?: string;
  referralCode?: string;
  clientRef?: string;
  sessionRef?: string;
  localRef?: string;
};

export type WorkspaceApi = {
  id: string;
  instagramConnected: boolean;
  displayName?: string | null;
  igHandle?: string | null;
  onboarding?: Record<string, unknown> | null;
  onboardingState?: Record<string, unknown> | null;
  metadata?: Record<string, unknown> | null;
};

export type AutomationWizardData = {
  tokenValid: boolean;
  workspace: { id: string; plan: string; igHandle: string | null };
  profile: { id: string; username: string | null; profilePictureUrl: string | null };
  media: Array<{
    id: string;
    caption: string;
    mediaType: string;
    thumbnailUrl: string | null;
  }>;
};

export type CreateAutomationInput = {
  name: string;
  keywords?: string[];
  excludedKeywords?: string[];
  anyComment?: boolean;
  postScope?: 'specific' | 'any' | 'next';
  postId?: string | null;
  dmMessage: string;
  autoReply?: boolean;
  replyMessages?: string[];
  dmButtonLabel?: string;
  dmButtonUrl?: string;
};

// ── Auth ──────────────────────────────────────────────────────────────────

export function login(input: { email: string; password: string }) {
  return apiRequest<LoginSuccess | MfaChallenge>(`${V1}/auth/login`, {
    method: 'POST',
    body: input,
    token: null,
  });
}

export function register(input: RegisterInput) {
  return apiRequest<LoginSuccess>(`${V1}/auth/register`, {
    method: 'POST',
    body: input,
    token: null,
  });
}

export function logout() {
  return apiRequest<void>(`${V1}/auth/logout`, { method: 'POST' });
}

export function getAuthMe(options: { token?: string; workspaceId?: string } = {}) {
  return apiRequest<AuthMePayload>(`${V1}/auth/me`, options);
}

export function googleAuthUrl(redirectTo: string, frontendOrigin: string): string {
  return `${API_BASE}${V1}/auth/google?redirect=${encodeURIComponent(redirectTo)}&fe=${encodeURIComponent(frontendOrigin)}`;
}

export function verifyEmailCode(code: string) {
  return apiRequest<{ ok?: boolean }>(`${V1}/auth/email-verification/verify-code`, {
    method: 'POST',
    body: { code },
  });
}

export function resendEmailVerification() {
  return apiRequest<{ ok?: boolean; retryAfterSec?: number; expiresInSec?: number }>(
    `${V1}/auth/email-verification/resend`,
    { method: 'POST' },
  );
}

export function forgotPassword(email: string) {
  return apiRequest<{ ok?: boolean; retryAfterSec?: number }>(
    `${V1}/auth/password/forgot`,
    { method: 'POST', body: { email }, token: null },
  );
}

export function resetPassword(input: { email: string; code: string; newPassword: string }) {
  return apiRequest<void>(`${V1}/auth/password/reset`, {
    method: 'POST',
    body: input,
    token: null,
  });
}

export function mfaLoginEmailSend(preAuthToken: string) {
  return apiRequest<{ retryAfterSec?: number; expiresInSec?: number }>(
    `${V1}/auth/mfa/login-email/send`,
    { method: 'POST', body: { preAuthToken }, token: null },
  );
}

export function mfaLoginVerify(input: { preAuthToken: string; code: string; method?: string }) {
  return apiRequest<LoginSuccess>(`${V1}/auth/mfa/login-verify`, {
    method: 'POST',
    body: input,
    token: null,
  });
}

// ── Workspaces ────────────────────────────────────────────────────────────

export function listWorkspaces() {
  return apiRequest<WorkspaceApi[]>(`${V1}/workspaces`);
}

export function updateWorkspace(
  workspaceId: string,
  body: { displayName?: string; isOnboarded?: boolean; onboarding?: Record<string, unknown> },
) {
  return apiRequest<WorkspaceApi>(`${V1}/workspaces/${workspaceId}`, {
    method: 'PATCH',
    workspaceId,
    body,
  });
}

export async function isWorkspaceInstagramConnected(workspaceId: string): Promise<boolean> {
  try {
    const workspaces = await listWorkspaces();
    const ws = workspaces.find((w) => w.id === workspaceId);
    if (!ws) return false;
    if (typeof ws.instagramConnected === 'boolean') return ws.instagramConnected;
    const ob = ws.onboarding ?? ws.onboardingState;
    return (ob as { ig?: { connected?: boolean } } | null | undefined)?.ig?.connected === true;
  } catch {
    return false;
  }
}

// ── Integrations ──────────────────────────────────────────────────────────

export function getMetaOAuthStartUrl(workspaceId: string) {
  const clientOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const params = new URLSearchParams({ returnTo: 'onboarding', clientOrigin });
  return apiRequest<{ url: string }>(
    `${V1}/integrations/meta/oauth/start?${params.toString()}`,
    { workspaceId },
  );
}

// ── Automations ───────────────────────────────────────────────────────────

export function getAutomationWizardData(workspaceId: string) {
  return apiRequest<AutomationWizardData>(`${V1}/automations/wizard-data`, { workspaceId });
}

export function createAutomation(workspaceId: string, body: CreateAutomationInput) {
  return apiRequest<{ id: string }>(`${V1}/automations`, {
    method: 'POST',
    workspaceId,
    body,
  });
}

// ── Affiliate ─────────────────────────────────────────────────────────────

export function validateAffiliateCode(code: string) {
  return apiRequest<{ valid: boolean }>(
    `${V1}/affiliate/validate-code/${encodeURIComponent(code)}`,
    { token: null },
  );
}

// ── Cross-domain handoff ──────────────────────────────────────────────────

export function appHandoffUrl(token: string, redirectPath = '/dashboard'): string {
  const base = APP_BASE.replace(/\/$/, '');
  return `${base}/auth/handoff?token=${encodeURIComponent(token)}&redirect=${encodeURIComponent(redirectPath)}`;
}
