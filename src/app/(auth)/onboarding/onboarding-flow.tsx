'use client';

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ApiError,
  appHandoffUrl,
  getAuthMe,
  getBrandingConfig,
  getMetaOAuthStartUrl,
  isWorkspaceInstagramConnected,
  setMyCountry,
  updateWorkspace,
  type BrandingConfig,
} from '@/lib/auth/api';
import { authStore } from '@/lib/auth/store';
import {
  META_OAUTH_BC_CHANNEL,
  META_OAUTH_MESSAGE_TYPE,
  openMetaOAuthPopup,
  type MetaOAuthResult,
} from '@/lib/auth/meta-oauth-popup';
import { AlertCircleIcon, Button, CheckIcon, ErrorMsg, InstagramIcon, Spinner } from '@/lib/auth/ui';
import { CountrySelect, isKnownCountryCode } from '@/lib/auth/countries';
import { trackSignupStep } from '@/lib/analytics/analytics';
import { commentMatchesKeywords } from '@/lib/onboarding/keyword-match';
import {
  goalOptionsForRole,
  templateForGoal,
  type OnboardingGoal,
  type OnboardingRole,
  type OnboardingTemplate,
} from '@/lib/onboarding/templates';

/**
 * Liffio onboarding — who it's for, what to send, a demo, then connect.
 *
 * Spec: `Website/v2/docs/onboarding/liffio-onboarding-stage2.md`, structured after
 * `liffio-onboarding-preview.html`, themed with this site's own tokens rather than the preview's
 * raw hex.
 *
 * ## The three rules that shaped this rewrite
 *
 * 1. **Onboarding creates nothing.** The previous flow ended in a four-substep wizard that called
 *    `POST /automations`. Nothing here does: `assertWorkflowLimit` counts every non-deleted
 *    automation regardless of status, so even a draft made during onboarding would silently
 *    consume one of the three slots a Free workspace is sold — before the user had decided
 *    anything. A real automation exists only when they hit Go live in the app's own create flow,
 *    and setting one up is always skippable.
 * 2. **Nothing hidden in DMs.** The demo shows the Free branding line *inside* the DM and the
 *    branded follow-up that lands minutes later, fetched from the server so it cannot drift from
 *    what is actually sent. We append to the customer's message and then send a second,
 *    unsolicited message advertising ourselves — from their account, to their follower. If the
 *    preview omits that, the first they hear of it is when a follower asks.
 * 3. **The answers are ids, never copy.** Only `role`, `goal` and `suggestedTemplate: { id,
 *    version }` are persisted; every string lives in the client registry. That is what lets the
 *    server's onboarding schema be a short list of enums with nothing free-text in it.
 *
 * ## Auth
 *
 * The access token set at registration (`authStore`, persisted in `localStorage`) is attached as a
 * Bearer header by `apiRequest`, together with `x-workspace-id`. Nothing here touches tokens
 * directly except the final cross-domain handoff, which is the one place a token legitimately
 * travels in a URL.
 */

// ── Local icons ────────────────────────────────────────────────────────────
// Defined here rather than added to the shared auth UI kit: they are used by these screens and
// nothing else, and this rewrite is deliberately scoped to onboarding.

type IconProps = { size?: number };

const iconBase = (size: number) =>
  ({
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }) as const;

function UserIcon({ size = 18 }: IconProps) {
  return (
    <svg {...iconBase(size)}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1" />
    </svg>
  );
}
function BriefcaseIcon({ size = 18 }: IconProps) {
  return (
    <svg {...iconBase(size)}>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
    </svg>
  );
}
function UsersIcon({ size = 18 }: IconProps) {
  return (
    <svg {...iconBase(size)}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2 20v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1" />
      <path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14h1a4 4 0 0 1 4 4v2" />
    </svg>
  );
}
function LinkIcon({ size = 18 }: IconProps) {
  return (
    <svg {...iconBase(size)}>
      <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
      <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
    </svg>
  );
}
function GiftIcon({ size = 18 }: IconProps) {
  return (
    <svg {...iconBase(size)}>
      <rect x="3" y="9" width="18" height="12" rx="2" />
      <path d="M3 13h18M12 9v12M12 9S9.5 9 8.5 8 8 5 9.5 5 12 9 12 9ZM12 9s2.5 0 3.5-1 .5-3-1-3S12 9 12 9Z" />
    </svg>
  );
}
function TagIcon({ size = 18 }: IconProps) {
  return (
    <svg {...iconBase(size)}>
      <path d="M3 11V4a1 1 0 0 1 1-1h7l9 9-8 8-9-9Z" />
      <circle cx="7.5" cy="7.5" r="1.2" />
    </svg>
  );
}
function CoinIcon({ size = 18 }: IconProps) {
  return (
    <svg {...iconBase(size)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M14.5 9.5a3 3 0 0 0-5 2.5c0 3 5 1.5 5 4a3 3 0 0 1-5 1M12 6.5v11" />
    </svg>
  );
}
function HelpIcon({ size = 18 }: IconProps) {
  return (
    <svg {...iconBase(size)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.2 2.4c-.6.2-1 .8-1 1.4v.4" />
      <path d="M12 17h.01" />
    </svg>
  );
}
function ArrowLeftIcon({ size = 18 }: IconProps) {
  return (
    <svg {...iconBase(size)}>
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </svg>
  );
}
function ReplayIcon({ size = 14 }: IconProps) {
  return (
    <svg {...iconBase(size)}>
      <path d="M20 11a8 8 0 0 0-15.5-2M4 5v4h4" />
      <path d="M4 13a8 8 0 0 0 15.5 2M20 19v-4h-4" />
    </svg>
  );
}
function ShieldIcon({ size = 14 }: IconProps) {
  return (
    <svg {...iconBase(size)}>
      <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
function SendIcon({ size = 14 }: IconProps) {
  return (
    <svg {...iconBase(size)}>
      <path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z" />
    </svg>
  );
}

// ── Connect error copy ─────────────────────────────────────────────────────

const IG_ERRORS: Record<string, { title: string; summary: string; steps: string[] }> = {
  no_instagram_business_account: {
    title: 'Instagram account not found',
    summary: 'No Professional Instagram account was found for that login.',
    steps: [
      'Open Instagram → Settings → Account type and tools → Switch to professional account',
      'Pick Creator or Business and finish the steps',
      'Come back here and connect again',
    ],
  },
  instagram_already_linked: {
    title: 'Could not move Instagram connection',
    summary: 'This Instagram account was linked on another workspace. Try disconnecting it first.',
    steps: [
      'Open Settings → General on the workspace that should keep Instagram',
      'Disconnect from the other workspace first, then retry here',
    ],
  },
  invalid_platform_app: {
    title: 'Meta app configuration error',
    summary:
      'Instagram rejected the connection — the Meta developer app may not be configured correctly.',
    steps: [
      'In Meta for Developers → Instagram → Business login settings: add your callback URL to OAuth Redirect URIs',
      'Confirm META_INSTAGRAM_BUSINESS_LOGIN_APP_ID / APP_SECRET match the Instagram App ID / Secret',
    ],
  },
  redirect_uri_mismatch: {
    title: 'Redirect URI mismatch',
    summary: "The OAuth callback URL in your server config doesn't match what's registered in Meta.",
    steps: [
      'Copy the exact value of META_OAUTH_REDIRECT_URI from your server .env file',
      'Add it verbatim to Meta → Instagram → Business login settings → OAuth Redirect URIs',
    ],
  },
  invalid_state: {
    title: 'That connect link expired',
    summary: 'The login took longer than the window we allow. Nothing is wrong with your account.',
    steps: ['Tap Connect Instagram again — it should go straight through'],
  },
  connection_not_persisted: {
    title: 'Almost there',
    summary: "Instagram connected, but we couldn't save it against your workspace.",
    steps: [
      'Try connecting once more',
      'If it keeps happening, contact support and we will link it for you',
    ],
  },
  token_exchange_failed: {
    title: 'Token exchange failed',
    summary: 'Instagram returned an error when exchanging the login code for an access token.',
    steps: [
      'Confirm META_APP_ID, META_APP_SECRET, and META_OAUTH_REDIRECT_URI are set correctly in server .env',
      'Check server logs for the full error message, then reconnect',
    ],
  },
};

// ── Shared pieces ──────────────────────────────────────────────────────────

const TOTAL_STEPS = 4;

/**
 * The country screen, past the end of the numbered flow.
 *
 * Deliberately not a fifth step: it is asked of a minority of accounts (see `countryNeeded`), and
 * a progress bar that reads "of 5" for some people and "of 4" for others is a worse bar than one
 * that stays honest about the four screens everybody sees.
 */
const COUNTRY_STEP = 5;

/** How long a chosen card stays visibly selected before the screen advances. */
const ADVANCE_DELAY_MS = 250;

const REPLY_DELAY_MS = 800;
const DM_DELAY_MS = 1200;

/**
 * "Are we past hydration?" without a setState-in-effect.
 *
 * The flow reads `localStorage` (via `authStore`) and `window.matchMedia`, so it cannot render its
 * real output on the server. The usual `useState(false)` + `useEffect(() => setMounted(true))`
 * does that job but trips `react-hooks/set-state-in-effect` — the rule is right that it causes a
 * cascading render. `useSyncExternalStore` answers the same question by definition: the server
 * snapshot is `false`, the client snapshot is `true`, and React handles the transition itself.
 *
 * The store never changes, so `subscribe` returns a no-op unsubscribe and is hoisted to module
 * scope — a new function identity each render would make React re-subscribe on every pass.
 */
const noopSubscribe = () => () => {};
const useHydrated = () => useSyncExternalStore(noopSubscribe, () => true, () => false);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Touch devices get a full-page redirect instead of a popup.
 *
 * Detected from coarse pointer + no hover rather than a user-agent string: it is the input model
 * that predicts whether a popup survives, and it keeps working on devices nobody has added to a
 * UA list yet. On a phone the popup usually becomes a new tab or is handed to the Instagram app,
 * so the callback lands with no opener to postMessage and the user is stranded on a dark
 * "close this window" page — on the platform carrying most of the traffic.
 */
function preferredOAuthMode(): 'popup' | 'redirect' {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return 'popup';
  try {
    return window.matchMedia('(pointer: coarse)').matches &&
      window.matchMedia('(hover: none)').matches
      ? 'redirect'
      : 'popup';
  } catch {
    return 'popup';
  }
}

/**
 * Four segments, one per screen, plus the back and skip affordances.
 *
 * The dashboard has no progress bar — reaching it is the end of onboarding, not a fifth step, and
 * a bar that still showed would tell the user they had more to do at the exact moment we want them
 * to start using the app.
 */
function StepProgress({
  step,
  onBack,
  onSkip,
  skipLabel,
}: {
  step: number;
  onBack?: () => void;
  onSkip?: () => void;
  skipLabel?: string;
}) {
  return (
    <div className="mb-4 w-full">
      <div
        className="flex gap-1.5"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={TOTAL_STEPS}
        aria-valuenow={step}
        aria-label={`Step ${step} of ${TOTAL_STEPS}`}
      >
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${i < step ? 'bg-primary' : 'bg-border'}`}
          />
        ))}
      </div>
      <div className="mt-2 flex h-8 items-center justify-between">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            aria-label="Go back"
            className="-ml-1.5 inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <ArrowLeftIcon />
          </button>
        ) : (
          <span />
        )}
        {onSkip ? (
          <button
            type="button"
            onClick={onSkip}
            className="rounded-lg px-2 py-1 text-sm text-muted-foreground transition hover:text-foreground"
          >
            {skipLabel ?? 'Skip'}
          </button>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}

function OptionCard({
  icon,
  title,
  subtitle,
  selected,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex w-full items-center gap-3.5 rounded-xl border p-4 text-left transition ${
        selected
          ? 'border-primary bg-primary/5 ring-1 ring-primary'
          : 'border-input hover:border-primary/40 hover:bg-muted'
      }`}
    >
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-muted text-foreground">
        {icon}
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-foreground">{title}</span>
        <span className="block text-sm text-muted-foreground">{subtitle}</span>
      </span>
    </button>
  );
}

/**
 * The DM exactly as a Free workspace will send it — branding line and all.
 *
 * The strings come from the server; while that request is in flight they are simply not drawn,
 * never replaced with a hardcoded stand-in, which would be the exact drift the endpoint exists to
 * prevent.
 */
function DmBubbles({
  template,
  branding,
}: {
  template: OnboardingTemplate;
  branding: BrandingConfig | null;
}) {
  return (
    <div className="space-y-2">
      <div className="rounded-2xl rounded-bl-md bg-muted px-3.5 py-2.5 text-sm leading-relaxed text-foreground">
        <p className="whitespace-pre-wrap">{template.dmMessage}</p>
        {branding?.brandingLine ? (
          <p className="mt-2 whitespace-pre-wrap text-muted-foreground">
            {branding.brandingLine.trim()}
          </p>
        ) : null}
        <div className="mt-2.5 rounded-lg border border-input bg-background px-3 py-1.5 text-center text-xs font-semibold text-foreground">
          {template.dmButtonLabel}
        </div>
      </div>

      {branding ? (
        <>
          <div className="flex items-center gap-2 py-1">
            <span className="h-px flex-1 bg-border" />
            <span className="text-[11px] uppercase tracking-wide text-muted-foreground">
              {branding.followUpDelayMinutes} minutes later
            </span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <div className="rounded-2xl rounded-bl-md bg-muted px-3.5 py-2.5 text-sm leading-relaxed text-foreground">
            <p className="whitespace-pre-wrap">{branding.followUpMessage}</p>
            <div className="mt-2.5 rounded-lg border border-input bg-background px-3 py-1.5 text-center text-xs font-semibold text-foreground">
              {branding.followUpButtonLabel}
            </div>
          </div>
          <p className="pt-1 text-xs text-muted-foreground">
            The last line and the second message get added on Free. Remove branding on paid plans.
          </p>
        </>
      ) : null}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function OnboardingClient({ defaultCountry }: { defaultCountry: string }) {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <Spinner />
        </div>
      }
    >
      <OnboardingFlow defaultCountry={defaultCountry} />
    </Suspense>
  );
}

type DemoPhase = 'idle' | 'replied' | 'dm';

function OnboardingFlow({ defaultCountry }: { defaultCountry: string }) {
  const router = useRouter();
  const params = useSearchParams();

  const mounted = useHydrated();

  /**
   * The OAuth return is read during render, not in an effect.
   *
   * The callback sends the user back to `/onboarding?meta=…`, and those params are available on
   * the very first render — so deriving the initial screen from them with lazy initialisers gives
   * the right output immediately, instead of painting screen 1 and then correcting it. It also
   * keeps `setState` out of the effect below, which now only does what effects are for: talking to
   * an external system (the router, analytics).
   */
  const metaParam = params.get('meta');
  const [step, setStep] = useState(() => (metaParam ? 4 : 1));
  const [role, setRole] = useState<OnboardingRole | null>(null);
  const [goal, setGoal] = useState<OnboardingGoal | null>(null);
  const [picked, setPicked] = useState<string | null>(null);
  const [branding, setBranding] = useState<BrandingConfig | null>(null);

  const [igError, setIgError] = useState<string | null>(() => {
    if (metaParam !== 'error') return null;
    // `params.get` already percent-decodes; decoding a second time would mangle any value
    // containing a literal %.
    const reason = params.get('reason') ?? '';
    return reason && reason !== 'user_canceled' ? reason : null;
  });
  /**
   * Whether this account still owes us a country. `null` until `auth/me` answers.
   *
   * Email signup collects it on the form, so for most accounts this resolves to `false` and the
   * screen below never renders. Google signup *cannot* collect it — that callback is a redirect
   * with no form — so those accounts arrive with `country: null`, as does every account created
   * before the field was made required.
   *
   * A ref, not state, because the only reader is `finish()` and it must see the current answer
   * rather than the one captured when the callback was last rebuilt: `submitCountry` sets this and
   * calls `finish()` on the next line, and a `useState` value would still be `true` there.
   */
  const countryNeeded = useRef<boolean | null>(null);
  const [country, setCountry] = useState(isKnownCountryCode(defaultCountry) ? defaultCountry : '');
  const [countrySaving, setCountrySaving] = useState(false);
  const [countryError, setCountryError] = useState<string | null>(null);

  const [connecting, setConnecting] = useState(false);
  const [connectedHandle, setConnectedHandle] = useState<string | null>(() =>
    metaParam === 'connected' ? (params.get('igHandle') ?? 'Your account') : null,
  );

  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finishing = useRef(false);
  const igTracked = useRef(false);

  const template = useMemo(() => templateForGoal(goal), [goal]);

  // The advance timer outlives the component if the user navigates away mid-beat; without this it
  // fires setStep on an unmounted screen.
  useEffect(
    () => () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    },
    [],
  );

  const markInstagramConnected = useCallback(() => {
    if (igTracked.current) return;
    igTracked.current = true;
    trackSignupStep('instagram_connected');
  }, []);

  // Free branding strings for the demo. Non-blocking: if it never lands, the demo still plays and
  // simply does not draw the branding rather than inventing it.
  useEffect(() => {
    let cancelled = false;
    getBrandingConfig()
      .then((cfg) => {
        if (!cancelled) setBranding(cfg);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  const resolveWorkspaceId = useCallback(async (): Promise<string> => {
    const { workspaceId, accessToken } = authStore.getState();
    if (workspaceId) return workspaceId;
    if (!accessToken) throw new Error('Not authenticated');
    const authMe = await getAuthMe({ token: accessToken });
    authStore.setAuthMe(authMe);
    if (!authMe.workspaceId) throw new Error('No workspace found. Please sign in again.');
    return authMe.workspaceId;
  }, []);

  /**
   * Persist an answer. **Never blocks, never surfaces a failure.**
   *
   * The spec is explicit: *"answers save after each screen. If a save fails, keep going and retry
   * quietly. Never block the user on it."* Nothing stored here is load-bearing — `role` and `goal`
   * reorder some options and pick a suggestion on the dashboard. A spinner between two taps costs
   * more than the thing it would be reporting, and `finish()` re-sends everything anyway.
   */
  const save = useCallback(
    (onboarding: Record<string, unknown>) => {
      void (async () => {
        try {
          const workspaceId = await resolveWorkspaceId();
          await updateWorkspace(workspaceId, { onboarding });
        } catch {
          /* deliberately silent — see the note above */
        }
      })();
    },
    [resolveWorkspaceId],
  );

  /**
   * One `auth/me` on arrival: adopt a handoff token if there is one, and find out whether the
   * account is missing its country.
   *
   * A token in the URL means the app's own guard bounced an un-onboarded user back here; without
   * one we read whatever the store already holds. Either way the same call answers both questions,
   * which is why this is one effect and one request rather than two.
   *
   * ⚠️ A failure resolves to `false`, not `true`. Not knowing whether a country is missing is not a
   * reason to stand a screen in front of someone — the checkout ask is the backstop, and blocking
   * the end of onboarding on a request that just failed would strand them for nothing.
   */
  useEffect(() => {
    const urlToken = params.get('token');
    if (urlToken) {
      authStore.setSession({ accessToken: urlToken });
      router.replace('/onboarding');
    }
    const token = urlToken ?? authStore.getState().accessToken;
    if (!token) return;
    getAuthMe({ token })
      .then((me) => {
        authStore.setAuthMe(me);
        countryNeeded.current = !me.user.country;
      })
      .catch(() => {
        countryNeeded.current = false;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // OAuth full-page redirect back to onboarding (the mobile path, and the popup's own fallback).
  // The screen and error state were already derived during render above; this only does the two
  // external things — fire the analytics event, and strip the params so a refresh cannot replay
  // a connect that already happened.
  useEffect(() => {
    if (!metaParam) return;
    if (metaParam === 'connected') markInstagramConnected();
    router.replace('/onboarding');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Same-origin popup reporting back over BroadcastChannel (Instagram severs window.opener).
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;
    const bc = new BroadcastChannel(META_OAUTH_BC_CHANNEL);
    bc.onmessage = async (e: MessageEvent) => {
      if (!e.data || e.data.type !== META_OAUTH_MESSAGE_TYPE) return;
      const result: MetaOAuthResult = e.data.payload;
      if (result.meta === 'connected') {
        if (result.workspaceId) {
          const ok = await isWorkspaceInstagramConnected(result.workspaceId);
          if (!ok) {
            setIgError('connection_not_persisted');
            return;
          }
        }
        setIgError(null);
        setConnectedHandle(result.igHandle ?? 'Your account');
        markInstagramConnected();
      } else if (result.meta === 'error' && result.reason !== 'user_canceled') {
        setIgError(result.reason ?? 'token_exchange_failed');
      }
    };
    return () => bc.close();
  }, [markInstagramConnected]);

  // Already finished? Straight to the app.
  useEffect(() => {
    if (!mounted) return;
    const { isOnboarded, accessToken } = authStore.getState();
    if (!accessToken) {
      router.replace('/login');
      return;
    }
    if (isOnboarded) window.location.href = appHandoffUrl(accessToken, '/dashboard');
  }, [mounted, router]);

  /**
   * End of onboarding: hand the session to the app.
   *
   * 🚩 The terminal save carries the **answers** as well as `isOnboarded`, not just the flag. Every
   * per-screen save is fire-and-forget and may quietly fail; re-sending everything here makes the
   * last write complete, so one flaky request mid-flow cannot cost the user the suggestion waiting
   * for them on the dashboard.
   *
   * The handoff runs even if that write fails — stranding someone on a finished flow is worse than
   * a missing suggestion, and the app re-reads `auth/me` on arrival.
   */
  const finish = useCallback(async () => {
    if (finishing.current) return;
    finishing.current = true;

    /**
     * The country gate. (G63)
     *
     * It sits here rather than earlier in the flow for two reasons. It is the last thing standing
     * between the customer and the app, so nobody who finishes onboarding can reach checkout
     * without a country — and putting it here means it never flashes in front of the 90%+ of
     * accounts that already have one, because by now `auth/me` has long since answered.
     *
     * `null` means that answer has not landed yet — possible only on the OAuth-return path, which
     * jumps straight to the connect screen and finishes a second later. Ask again rather than
     * guess; one extra request in a rare race is cheaper than a skipped ask or a false one.
     */
    if (countryNeeded.current === null) {
      const token = authStore.getState().accessToken;
      countryNeeded.current = false;
      if (token) {
        try {
          const me = await getAuthMe({ token });
          authStore.setAuthMe(me);
          countryNeeded.current = !me.user.country;
        } catch {
          /* unknown is not a reason to stop someone — checkout still refuses without one */
        }
      }
    }
    if (countryNeeded.current) {
      // Not finishing after all; release the single-flight guard so the screen's own submit can
      // run this again once the question is answered.
      finishing.current = false;
      setStep(COUNTRY_STEP);
      return;
    }

    const { accessToken } = authStore.getState();
    if (!accessToken) {
      router.replace('/login');
      return;
    }
    try {
      const workspaceId = await resolveWorkspaceId();
      await updateWorkspace(workspaceId, {
        onboarding: {
          role,
          goal,
          suggestedTemplate: { id: templateForGoal(goal).id, version: 1 },
        },
        isOnboarded: true,
      });
      const authMe = await getAuthMe({ token: accessToken });
      authStore.setAuthMe(authMe);
    } catch {
      /* see the note above — the handoff happens regardless */
    }
    window.location.href = appHandoffUrl(accessToken, '/dashboard');
  }, [resolveWorkspaceId, role, goal, router]);

  /**
   * Save the country, then carry on to the dashboard.
   *
   * ⚠️ **A 409 is a success here.** The server sets country once and answers `COUNTRY_ALREADY_SET`
   * if it is already there — a second tab, a retry after a dropped response, support having filled
   * it in. The account has a country, which is the entire point of this screen; reporting an error
   * would strand someone over a question that is already answered.
   *
   * Anything else is shown and retryable, with the escape hatch in `ScreenCountry`: this is the
   * last screen of onboarding, and a customer must not be trapped on it by an API having a bad
   * minute. An unsaved country costs one prompt at checkout, which already refuses without one.
   */
  const submitCountry = useCallback(async () => {
    if (countrySaving) return;
    if (!country) {
      setCountryError('Please select your country.');
      return;
    }
    setCountrySaving(true);
    setCountryError(null);
    try {
      await setMyCountry(country);
    } catch (err) {
      if (!(err instanceof ApiError && err.code === 'COUNTRY_ALREADY_SET')) {
        setCountrySaving(false);
        setCountryError((err as Error).message);
        return;
      }
    }
    countryNeeded.current = false;
    setCountrySaving(false);
    void finish();
  }, [country, countrySaving, finish]);

  /** The escape hatch — only reachable after a save has actually failed. See `submitCountry`. */
  const skipCountry = useCallback(() => {
    countryNeeded.current = false;
    void finish();
  }, [finish]);

  // A short confirmation beat after a successful connect, then the dashboard.
  useEffect(() => {
    if (!connectedHandle) return;
    const t = setTimeout(() => void finish(), 1000);
    return () => clearTimeout(t);
  }, [connectedHandle, finish]);

  const advance = (to: number) => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => {
      setPicked(null);
      setStep(to);
    }, ADVANCE_DELAY_MS);
  };

  const pickRole = (next: OnboardingRole | null) => {
    if (picked) return;
    setPicked(next ?? 'skip');
    setRole(next);
    save({ role: next });
    trackSignupStep('workspace_created');
    advance(2);
  };

  const pickGoal = (next: OnboardingGoal | null) => {
    if (picked) return;
    setPicked(next ?? 'skip');
    setGoal(next);
    // `goal` is the answer; `suggestedTemplate` is the decision made from it. Both are stored —
    // "not sure yet" and a skipped screen resolve to the same template today, and only `goal` can
    // tell them apart if that ever needs to change.
    save({ goal: next, suggestedTemplate: { id: templateForGoal(next).id, version: 1 } });
    advance(3);
  };

  async function handleConnect() {
    if (connecting) return;
    setIgError(null);
    setConnecting(true);
    try {
      const workspaceId = await resolveWorkspaceId();

      if (preferredOAuthMode() === 'redirect') {
        const { url } = await getMetaOAuthStartUrl(workspaceId, 'redirect');
        window.location.assign(url);
        return;
      }

      const result = await openMetaOAuthPopup(
        async () => (await getMetaOAuthStartUrl(workspaceId, 'popup')).url,
        {
          oauthWorkspaceId: workspaceId,
          checkConnected: () => isWorkspaceInstagramConnected(workspaceId),
          verifyConnected: () => isWorkspaceInstagramConnected(workspaceId),
        },
      );
      if (result.meta === 'connected') {
        setIgError(null);
        setConnectedHandle(result.igHandle ?? 'Your account');
        markInstagramConnected();
      } else if (result.reason !== 'user_canceled') {
        setIgError(result.reason ?? 'token_exchange_failed');
      }
    } catch (err) {
      setIgError((err as Error).message);
    } finally {
      setConnecting(false);
    }
  }

  if (!mounted) return null;

  return (
    <div className={`w-full ${step === 3 ? 'max-w-3xl' : 'max-w-lg'}`}>
      {step === 1 && <StepProgress step={1} onSkip={() => pickRole(null)} />}
      {step === 2 && (
        <StepProgress step={2} onBack={() => setStep(1)} onSkip={() => pickGoal(null)} />
      )}
      {step === 3 && (
        <StepProgress
          step={3}
          onBack={() => setStep(2)}
          onSkip={() => setStep(4)}
          skipLabel="Skip demo"
        />
      )}
      {step === 4 && <StepProgress step={4} onBack={() => setStep(3)} />}
      {step === COUNTRY_STEP && <StepProgress step={TOTAL_STEPS} />}

      <div className="w-full rounded-2xl border bg-card p-6 shadow-soft sm:p-8">
        {step === 1 && <ScreenRole picked={picked} onPick={pickRole} />}
        {step === 2 && <ScreenGoal role={role} picked={picked} onPick={pickGoal} />}
        {step === 3 && (
          <ScreenDemo template={template} branding={branding} onContinue={() => setStep(4)} />
        )}
        {step === 4 && (
          <ScreenConnect
            role={role}
            connecting={connecting}
            connectedHandle={connectedHandle}
            igError={igError}
            onConnect={() => void handleConnect()}
            onSkip={() => void finish()}
          />
        )}
        {step === COUNTRY_STEP && (
          <ScreenCountry
            value={country}
            onChange={(v) => {
              setCountry(v);
              setCountryError(null);
            }}
            saving={countrySaving}
            error={countryError}
            onSubmit={() => void submitCountry()}
            onSkip={skipCountry}
          />
        )}
      </div>
    </div>
  );
}

// ── Screen 1: Who's this for ───────────────────────────────────────────────

const ROLE_OPTIONS: Array<{
  role: OnboardingRole;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}> = [
  {
    role: 'creator',
    title: 'My own account',
    subtitle: "I'm a creator or I run my own page",
    icon: <UserIcon />,
  },
  {
    role: 'business',
    title: 'My business',
    subtitle: 'A brand, shop, or service',
    icon: <BriefcaseIcon />,
  },
  {
    role: 'agency',
    title: 'My clients',
    subtitle: 'I manage Instagram for other people',
    icon: <UsersIcon />,
  },
];

/**
 * No Continue button. A tap selects, holds the selected state for a beat so the choice registers
 * visually, then advances — an instant jump reads as a mis-tap and people hit back to check what
 * they picked.
 *
 * The answer is a *hint*, never a gate: it reorders screen 2 and changes two strings later.
 */
function ScreenRole({
  picked,
  onPick,
}: {
  picked: string | null;
  onPick: (r: OnboardingRole) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold tracking-tight text-foreground">
          Who are you setting Liffio up for?
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          We&apos;ll use this to show you the right examples.
        </p>
      </div>
      <div className="space-y-2.5">
        {ROLE_OPTIONS.map((o) => (
          <OptionCard
            key={o.role}
            icon={o.icon}
            title={o.title}
            subtitle={o.subtitle}
            selected={picked === o.role}
            onClick={() => onPick(o.role)}
          />
        ))}
      </div>
    </div>
  );
}

// ── Screen 2: What do you want to send ─────────────────────────────────────

const GOAL_ICONS: Record<OnboardingGoal, React.ReactNode> = {
  link: <LinkIcon />,
  resource: <GiftIcon />,
  code: <TagIcon />,
  prices: <CoinIcon />,
  unsure: <HelpIcon />,
};

function ScreenGoal({
  role,
  picked,
  onPick,
}: {
  role: OnboardingRole | null;
  picked: string | null;
  onPick: (g: OnboardingGoal) => void;
}) {
  const options = useMemo(() => goalOptionsForRole(role), [role]);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold tracking-tight text-foreground">
          What do you want to DM people when they comment?
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick one to start. You can set up others later.
        </p>
      </div>
      <div className="space-y-2.5">
        {options.map((o) => (
          <OptionCard
            key={o.goal}
            icon={GOAL_ICONS[o.goal]}
            title={o.title}
            subtitle={o.subtitle}
            selected={picked === o.goal}
            onClick={() => onPick(o.goal)}
          />
        ))}
      </div>
    </div>
  );
}

// ── Screen 3: Demo ─────────────────────────────────────────────────────────

/**
 * The whole product, working, before we ask for a single permission.
 *
 * `commentMatchesKeywords` is a port of the server's matcher — lower-case, punctuation stripped,
 * whole words. A demo that fires on "guidebook" when production would not is a lie told at the
 * moment we are asking to be trusted. It creates nothing: every bit of state below is local.
 */
function ScreenDemo({
  template,
  branding,
  onContinue,
}: {
  template: OnboardingTemplate;
  branding: BrandingConfig | null;
  onContinue: () => void;
}) {
  const [phase, setPhase] = useState<DemoPhase>('idle');
  const [comment, setComment] = useState('');
  const [posted, setPosted] = useState('');
  const [error, setError] = useState<string | null>(null);
  const timers = useRef<Array<ReturnType<typeof setTimeout>>>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);
  useEffect(() => clearTimers, [clearTimers]);

  const replay = () => {
    clearTimers();
    setPhase('idle');
    setPosted('');
    setComment('');
    setError(null);
  };

  const post = () => {
    const trimmed = comment.trim();
    if (!trimmed) {
      setError('Type a comment first');
      return;
    }
    if (!commentMatchesKeywords(trimmed, template.demoKeywords)) {
      setError(template.demoMissHint);
      setComment('');
      return;
    }
    setError(null);
    setPosted(trimmed);
    setComment('');
    if (prefersReducedMotion()) {
      setPhase('dm');
      return;
    }
    timers.current.push(setTimeout(() => setPhase('replied'), REPLY_DELAY_MS));
    timers.current.push(setTimeout(() => setPhase('dm'), REPLY_DELAY_MS + DM_DELAY_MS));
  };

  const rail = [
    { label: `Someone comments ${template.displayKeyword}`, done: posted !== '' },
    { label: 'Liffio replies to their comment', done: phase === 'replied' || phase === 'dm' },
    { label: 'They get your DM in seconds', done: phase === 'dm' },
  ];

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_320px] md:items-start">
      {/* Headline, rail and CTA — first on mobile, right-hand column on desktop */}
      <div className="order-1 md:order-2">
        <h1 className="font-display text-xl font-bold tracking-tight text-foreground">
          Here&apos;s how it works
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Comment on this post like one of your followers would.
        </p>

        <ol className="mt-5 space-y-3">
          {rail.map((s, i) => (
            <li
              key={s.label}
              className={`flex items-center gap-3 text-sm transition-colors ${
                s.done ? 'text-foreground' : 'text-muted-foreground'
              }`}
            >
              <span
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border text-[11px] font-semibold transition-colors ${
                  s.done ? 'border-primary bg-primary text-primary-foreground' : 'border-input'
                }`}
              >
                {s.done ? <CheckIcon size={12} /> : i + 1}
              </span>
              {s.label}
            </li>
          ))}
        </ol>

        {phase === 'dm' && (
          <div className="mt-6 space-y-2">
            <Button className="w-full" onClick={onContinue}>
              Set this up on my Instagram
            </Button>
            <Button variant="ghost" className="w-full" onClick={replay} type="button">
              <ReplayIcon /> Replay
            </Button>
          </div>
        )}
      </div>

      {/* The sample post */}
      <div className="order-2 md:order-1">
        <div className="overflow-hidden rounded-2xl border border-input bg-background">
          <div className="flex items-center gap-2.5 border-b border-input px-3.5 py-3">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-muted text-xs font-semibold text-foreground">
              Y
            </span>
            <span className="text-sm font-semibold text-foreground">yourpage</span>
          </div>

          <div aria-hidden className="aspect-[4/3] bg-gradient-to-br from-muted to-background" />

          <div className="space-y-3 p-3.5">
            <p className="text-sm text-foreground">{template.demoCaption}</p>

            {posted && (
              <div className="space-y-2 border-t border-input pt-3">
                <div className="flex gap-2.5">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-muted text-[11px] font-semibold text-foreground">
                    Y
                  </span>
                  <p className="min-w-0 break-words text-sm text-foreground">
                    <span className="font-semibold">you</span>{' '}
                    <span className="text-muted-foreground">{posted}</span>
                  </p>
                </div>
                {(phase === 'replied' || phase === 'dm') && (
                  <div className="ml-9 flex gap-2.5">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">
                      Y
                    </span>
                    <p className="min-w-0 break-words text-sm text-foreground">
                      <span className="font-semibold">yourpage</span>{' '}
                      <span className="text-muted-foreground">{template.publicReply}</span>
                    </p>
                  </div>
                )}
              </div>
            )}

            {phase === 'dm' && (
              <div className="space-y-2 border-t border-input pt-3">
                <p className="text-xs font-semibold text-muted-foreground">Direct messages</p>
                <DmBubbles template={template} branding={branding} />
              </div>
            )}
          </div>

          {phase === 'idle' && (
            <div className="border-t border-input p-3.5">
              <div className="flex gap-2">
                <input
                  value={comment}
                  onChange={(e) => {
                    setComment(e.target.value);
                    if (error) setError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      post();
                    }
                  }}
                  placeholder={template.demoInputPlaceholder}
                  aria-label="Write a comment"
                  aria-invalid={Boolean(error)}
                  className="min-w-0 flex-1 rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/30"
                />
                <Button onClick={post} type="button" className="shrink-0 px-3 py-2">
                  <SendIcon /> Post
                </Button>
              </div>
              {error && (
                <p role="status" className="mt-2 text-xs text-destructive">
                  {error}
                </p>
              )}
            </div>
          )}
        </div>

        <p className="mt-2 text-center text-xs text-muted-foreground">
          Sample post. Nothing gets posted to Instagram.
        </p>
      </div>
    </div>
  );
}

// ── Screen 4: Connect Instagram ────────────────────────────────────────────

const CONNECT_STEPS = [
  'Instagram asks you to log in',
  'You approve access for Liffio',
  'You come back here',
];

/**
 * Every permission we are about to request is named here first, in plain words, with the one that
 * looks alarming explained ("only when you schedule one"). Instagram's own dialog lists scopes in
 * its language, not ours, and "publish posts" arriving unannounced on a screen someone reached to
 * automate comments reads as overreach. The cost of saying it is a longer screen; the cost of not
 * saying it is a cancel inside Meta's dialog, where we cannot explain anything.
 */
function ScreenConnect({
  role,
  connecting,
  connectedHandle,
  igError,
  onConnect,
  onSkip,
}: {
  role: OnboardingRole | null;
  connecting: boolean;
  connectedHandle: string | null;
  igError: string | null;
  onConnect: () => void;
  onSkip: () => void;
}) {
  const [howToOpen, setHowToOpen] = useState(false);

  if (connectedHandle) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-10">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-success/10 text-success">
          <CheckIcon size={22} />
        </span>
        <p className="text-sm font-semibold text-foreground">{connectedHandle} connected</p>
      </div>
    );
  }

  const err = igError ? IG_ERRORS[igError] : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-bold tracking-tight text-foreground">
          Now connect your Instagram
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {role === 'agency'
            ? "Connect a client's professional account, or your own to try it out."
            : 'Connect a professional account so you can start sending DMs like the one you just saw.'}
        </p>
      </div>

      {igError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3.5">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 text-destructive">
              <AlertCircleIcon size={15} />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground">
                {err?.title ?? "That didn't work"}
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {err?.summary ?? 'We could not connect Instagram. Please try again.'}
              </p>
              {err?.steps?.length ? (
                <ul className="mt-2 list-disc space-y-1 pl-4 text-xs text-muted-foreground">
                  {err.steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-input bg-muted/50 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          What happens next
        </p>
        <ol className="mt-3 space-y-2.5">
          {CONNECT_STEPS.map((s, i) => (
            <li key={s} className="flex items-center gap-3 text-sm text-foreground">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-input text-[11px] font-semibold">
                {i + 1}
              </span>
              {s}
            </li>
          ))}
        </ol>
      </div>

      <div className="space-y-3">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Instagram will ask to let Liffio see your profile and posts, read and reply to comments,
          send messages, see insights, and publish posts (only when you schedule one).
        </p>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Needs a Business or Creator account. On a personal account? Switching is free and takes a
          minute.{' '}
          <button
            type="button"
            onClick={() => setHowToOpen((o) => !o)}
            aria-expanded={howToOpen}
            className="font-semibold text-foreground underline underline-offset-2"
          >
            How to switch
          </button>
        </p>
        {howToOpen && (
          <ol className="list-decimal space-y-1 rounded-xl border border-input bg-muted/50 p-3 pl-7 text-xs text-muted-foreground">
            <li>Open Instagram and go to your profile</li>
            <li>Tap the menu, then Settings and privacy</li>
            <li>Tap Account type and tools, then Switch to professional account</li>
            <li>Pick Creator or Business and finish the steps</li>
          </ol>
        )}
      </div>

      <div className="space-y-2.5">
        <Button className="w-full" onClick={onConnect} loading={connecting} disabled={connecting}>
          {connecting ? (
            'Connecting…'
          ) : (
            <>
              <InstagramIcon size={15} /> Connect Instagram
            </>
          )}
        </Button>

        <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-muted-foreground">
          <ShieldIcon /> Official Instagram API · Verified Meta Tech Provider
        </p>
        <p className="text-center text-xs text-muted-foreground">
          Liffio never sees your password. You can disconnect any time in Settings.
        </p>

        <button
          type="button"
          onClick={onSkip}
          className="mx-auto block rounded-lg px-2 py-1 text-sm text-muted-foreground transition hover:text-foreground"
        >
          Do this later
        </button>
      </div>
    </div>
  );
}

// ── Screen 5: Country (only when the account has none) ─────────────────────

/**
 * The one question a Google signup never got asked.
 *
 * ## Why it is asked and not detected
 *
 * There is a geo header on this request, and `defaultCountry` is read from it — as a **pre-fill**,
 * which the customer can change and confirms by pressing the button. What it is not is the answer.
 * Country is the only thing choosing INR versus USD under a single gateway, and the server sets it
 * **once**: an inferred value is a price the customer never agreed to, charged for the life of the
 * subscription, from a header that says where they opened the browser rather than where they live.
 * An Indian customer on a work trip would be billed in USD at roughly double the INR sheet with no
 * way to see why. The backend refuses to read that header for this field for the same reason.
 *
 * ## Why it has no ordinary skip
 *
 * Every other screen here is skippable because nothing downstream needs the answer. This one is
 * different: without a country `createPackageCheckout` refuses with `CHECKOUT_COUNTRY_REQUIRED`,
 * and a skip would simply move the question to the moment the customer is trying to pay. Pre-filled
 * and one tap, here, is the cheaper place to answer it.
 *
 * The "continue without saving" link appears **only after a save has actually failed** — see
 * `submitCountry`. A last screen that a flaky API can lock someone out of is worse than a missing
 * country, and checkout still catches it.
 */
function ScreenCountry({
  value,
  onChange,
  saving,
  error,
  onSubmit,
  onSkip,
}: {
  value: string;
  onChange: (v: string) => void;
  saving: boolean;
  error: string | null;
  onSubmit: () => void;
  onSkip: () => void;
}) {
  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div>
        <h1 className="font-display text-xl font-bold tracking-tight text-foreground">
          Last thing — where are you based?
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          This sets the currency you are billed in if you ever upgrade. It does not change anything
          on the free plan.
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground" htmlFor="country">
          Country
        </label>
        <CountrySelect value={value} onChange={onChange} disabled={saving} />
        <ErrorMsg message={error} />
      </div>

      <div className="space-y-3">
        <Button type="submit" loading={saving} disabled={!value} className="w-full">
          Continue
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Pick the country you pay from. You will need support to change it later.
        </p>
        {error ? (
          <button
            type="button"
            onClick={onSkip}
            className="mx-auto block rounded-lg px-2 py-1 text-sm text-muted-foreground transition hover:text-foreground"
          >
            Continue without saving
          </button>
        ) : null}
      </div>
    </form>
  );
}
