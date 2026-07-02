'use client';

import { Suspense, useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '@/components/Logo';
import { authStore } from '@/lib/auth/store';
import {
  getAuthMe,
  getMetaOAuthStartUrl,
  isWorkspaceInstagramConnected,
  updateWorkspace,
  getAutomationWizardData,
  createAutomation,
  appHandoffUrl,
  type AutomationWizardData,
} from '@/lib/auth/api';
import { openMetaOAuthPopup, META_OAUTH_BC_CHANNEL, META_OAUTH_MESSAGE_TYPE, type MetaOAuthResult } from '@/lib/auth/meta-oauth-popup';
import {
  AlertCircleIcon,
  ArrowRightIcon,
  Button,
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  Input,
  InstagramIcon,
  Label,
  LockIcon,
  MessageSquareIcon,
  PlusIcon,
  Spinner,
  Textarea,
  XIcon,
  ZapIcon,
} from '@/lib/auth/ui';

// ── Error copy ─────────────────────────────────────────────────────────────

const IG_ERRORS: Record<string, { title: string; summary: string; steps: string[] }> = {
  no_instagram_business_account: {
    title: 'Instagram account not found',
    summary: 'No Professional Instagram account was found linked to your Facebook Page.',
    steps: [
      'Switch your Instagram to a Professional account — Instagram → Settings → Account → Switch to Professional',
      'Link that Instagram account to your Facebook Page — Facebook Page → Settings → Linked accounts → Instagram',
      'Enable message access in Instagram → Settings → Privacy → Messages',
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
    summary: 'Instagram rejected the connection — the Meta developer app may not be configured correctly.',
    steps: [
      'In Meta for Developers → Instagram → API setup with Instagram login → Business login settings: add your callback URL to OAuth Redirect URIs',
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
  token_exchange_failed: {
    title: 'Token exchange failed',
    summary: 'Instagram returned an error when exchanging the login code for an access token.',
    steps: [
      'Confirm META_APP_ID, META_APP_SECRET, and META_OAUTH_REDIRECT_URI are set correctly in server .env',
      'Check server logs for the full error message, then reconnect',
    ],
  },
};

// ── Sub-components ─────────────────────────────────────────────────────────

function StepProgress({ step }: { step: number }) {
  const steps = ['Your Brand', 'Connect', 'Automate'];
  return (
    <div className="mb-8 flex w-full max-w-lg items-start">
      {steps.map((label, i) => {
        const num = i + 1;
        const done = num < step;
        const active = num === step;
        return (
          <div key={label} className="flex flex-1 items-start">
            <div className="flex flex-col items-center gap-1.5 w-24 shrink-0">
              <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all ${done ? 'border-primary bg-primary text-primary-foreground' : active ? 'border-primary text-primary' : 'border-input text-muted-foreground'}`}>
                {done ? <CheckIcon size={14} /> : num}
              </div>
              <span className={`text-center text-xs font-medium leading-tight ${active ? 'text-foreground' : 'text-muted-foreground'}`}>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div className={`mt-4 h-0.5 flex-1 transition-all duration-500 ${done ? 'bg-primary' : 'bg-muted'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function Requirement({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2.5 text-sm text-foreground">
      <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/15">
        <CheckIcon size={10} />
      </div>
      {text}
    </div>
  );
}

function ValueProp({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 p-3.5">
      <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted">{icon}</div>
      <div>
        <div className="text-sm font-medium text-foreground">{title}</div>
        <div className="mt-0.5 text-xs text-muted-foreground">{desc}</div>
      </div>
    </div>
  );
}

function IgErrorPanel({ reason }: { reason: string }) {
  const [expanded, setExpanded] = useState(false);
  const info = IG_ERRORS[reason];
  if (!info) {
    return (
      <div className="flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 text-sm text-destructive">
        <AlertCircleIcon size={14} />
        <span>{reason || 'Instagram connect failed. Please try again.'}</span>
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-xl border border-warning/30 bg-warning/10">
      <div className="space-y-1 p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-warning">
          <AlertCircleIcon size={14} />
          {info.title}
        </div>
        <p className="pl-6 text-xs text-warning">{info.summary}</p>
      </div>
      <button type="button" className="flex w-full items-center justify-between border-t border-warning/30 px-4 py-2.5 text-xs text-muted-foreground hover:bg-warning/10 transition-colors" onClick={() => setExpanded((e) => !e)}>
        How to fix this
        {expanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
      </button>
      {expanded && (
        <div className="space-y-2.5 border-t border-warning/20 px-4 pb-4 pt-2">
          {info.steps.map((s, i) => (
            <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-warning/20 text-[10px] font-bold text-warning">{i + 1}</span>
              <span>{s}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LockedCard({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border bg-muted px-4 py-3 text-sm text-muted-foreground">
      <LockIcon size={14} />
      {label}
      <span className="ml-auto text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">Pro</span>
    </div>
  );
}

function Segmented({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: { v: string; l: string }[] }) {
  return (
    <div className="inline-flex w-full rounded-lg border bg-muted p-1">
      {options.map((o) => (
        <button key={o.v} type="button" onClick={() => onChange(o.v)}
          className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${value === o.v ? 'bg-card text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
          {o.l}
        </button>
      ))}
    </div>
  );
}

function ReviewRow({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-card p-3.5">
      <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</div>
      <div className="text-sm text-foreground">{children}</div>
    </div>
  );
}

// ── Automation Wizard ──────────────────────────────────────────────────────

function AutomationWizard({
  onClose,
  onLaunch,
  resolveWorkspaceId,
}: {
  onClose: () => void;
  onLaunch: () => void;
  resolveWorkspaceId: () => Promise<string>;
}) {
  const [sub, setSub] = useState<1 | 2 | 3 | 4>(1);
  const [postMode, setPostMode] = useState<'specific' | 'any' | 'next'>('any');
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [keywordMode, setKeywordMode] = useState<'specific' | 'any'>('specific');
  const [keywords, setKeywords] = useState<string[]>(['GUIDE']);
  const [kwInput, setKwInput] = useState('');
  const [autoReply, setAutoReply] = useState(true);
  const [replies, setReplies] = useState(['Sent! Check your DMs', 'On its way to your inbox', 'Just DM\'d you the link']);
  const [dmType, setDmType] = useState('text-button');
  const [dmText, setDmText] = useState('Hi there! Appreciate your comment. Here\'s the link you asked for');
  const [hasButton, setHasButton] = useState(true);
  const [btnLabel, setBtnLabel] = useState('Get Your Free Guide');
  const [btnUrl, setBtnUrl] = useState('https://');
  const [wizardData, setWizardData] = useState<AutomationWizardData | null>(null);
  const [wizardLoading, setWizardLoading] = useState(true);
  const [wizardError, setWizardError] = useState('');
  const [launching, setLaunching] = useState(false);
  const [launchError, setLaunchError] = useState('');

  useEffect(() => {
    resolveWorkspaceId().then((workspaceId) =>
      getAutomationWizardData(workspaceId)
        .then((data) => { setWizardData(data); if (data.media?.[0]) setSelectedPost(data.media[0].id); })
        .catch((err) => setWizardError((err as Error).message))
        .finally(() => setWizardLoading(false))
    );
  }, [resolveWorkspaceId]);

  function addKw() {
    const v = kwInput.trim().toUpperCase();
    if (!v || keywords.includes(v)) return;
    setKeywords((k) => [...k, v]);
    setKwInput('');
  }

  async function launch() {
    setLaunchError('');
    setLaunching(true);
    try {
      const workspaceId = await resolveWorkspaceId();
      await createAutomation(workspaceId, {
        name: `${(wizardData?.profile.username ?? 'Instagram').replace(/^@/, '')} – Comment DM`,
        keywords: keywordMode === 'any' ? [] : keywords.map((k) => k.trim()).filter(Boolean),
        excludedKeywords: [],
        anyComment: keywordMode === 'any',
        postScope: postMode,
        postId: postMode === 'specific' ? (selectedPost ?? null) : null,
        dmMessage: dmText.trim(),
        autoReply,
        replyMessages: autoReply ? replies.map((r) => r.trim()).filter(Boolean) : [],
        dmButtonLabel: dmType === 'text-button' && hasButton ? btnLabel.trim() || undefined : undefined,
        dmButtonUrl: dmType === 'text-button' && hasButton ? btnUrl.trim() || undefined : undefined,
      });
      onLaunch();
    } catch (err) {
      setLaunchError((err as Error).message);
    } finally {
      setLaunching(false);
    }
  }

  const selectedMedia = wizardData?.media.find((m) => m.id === selectedPost) ?? null;
  const SUBSTEP_LABELS = ['Trigger', 'Keywords & Replies', 'Message'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-xl flex-col rounded-2xl border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <MessageSquareIcon size={14} />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">New automation</div>
              <div className="text-xs text-muted-foreground">Comment → auto DM</div>
            </div>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 text-muted-foreground hover:text-foreground transition-colors">
            <XIcon size={16} />
          </button>
        </div>

        {/* Profile bar */}
        <div className="flex items-center gap-2 border-b border-border px-5 py-2.5">
          {wizardData?.profile.profilePictureUrl ? (
            <img src={wizardData.profile.profilePictureUrl} alt="" className="h-7 w-7 rounded-full object-cover" />
          ) : (
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-brand-500 to-brand-700" />
          )}
          <span className="text-sm font-medium text-foreground">@{wizardData?.profile.username ?? 'yourbrand'}</span>
          <div className="ml-auto flex items-center gap-1">
            {SUBSTEP_LABELS.map((_, i) => (
              <div key={i} className={`h-1.5 w-6 rounded-full transition-all ${i + 1 <= Math.min(sub, 3) ? 'bg-primary' : 'bg-muted'}`} />
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          {wizardLoading && <div className="rounded-lg border bg-muted p-3 text-sm text-muted-foreground">Loading your Instagram profile…</div>}
          {wizardError && <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{wizardError}</div>}

          {/* Sub-step 1: Trigger */}
          {sub === 1 && (
            <>
              <div>
                <Label>Which post triggers this automation?</Label>
                <p className="mt-0.5 text-xs text-muted-foreground">Choose when comments on your Instagram should trigger a DM.</p>
              </div>
              <Segmented value={postMode} onChange={(v) => setPostMode(v as 'specific' | 'any' | 'next')} options={[{ v: 'any', l: 'All posts' }, { v: 'next', l: 'Next post only' }, { v: 'specific', l: 'Pick a post' }]} />
              {postMode === 'any' && <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-primary">One automation covers every post and reel on your account — past and future.</div>}
              {postMode === 'next' && <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 text-xs text-primary">This automation activates only on your next published post.</div>}
              {postMode === 'specific' && (
                <>
                  <div className="grid grid-cols-3 gap-2">
                    {(wizardData?.media ?? []).map((item) => (
                      <button key={item.id} type="button" onClick={() => setSelectedPost(item.id)}
                        className={`relative aspect-square overflow-hidden rounded-lg border-2 bg-muted transition-all ${selectedPost === item.id ? 'border-primary' : 'border-border hover:border-muted-foreground'}`}>
                        {item.thumbnailUrl ? (
                          <img src={item.thumbnailUrl} alt={item.caption || ''} className="absolute inset-0 h-full w-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
                        )}
                        {selectedPost === item.id && (
                          <div className="absolute inset-0 flex items-center justify-center bg-primary/25">
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary"><CheckIcon size={14} /></div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  {(wizardData?.media?.length ?? 0) === 0 && !wizardLoading && <p className="text-xs text-muted-foreground">No posts found on this account yet.</p>}
                </>
              )}
            </>
          )}

          {/* Sub-step 2: Keywords */}
          {sub === 2 && (
            <>
              <div>
                <Label>What triggers the automation?</Label>
                <p className="mt-0.5 text-xs text-muted-foreground">Send a DM when someone comments a specific keyword, or on any comment.</p>
              </div>
              <Segmented value={keywordMode} onChange={(v) => setKeywordMode(v as 'specific' | 'any')} options={[{ v: 'specific', l: 'Specific keyword' }, { v: 'any', l: 'Any comment' }]} />
              {keywordMode === 'specific' && (
                <>
                  <div className="flex gap-2">
                    <Input value={kwInput} onChange={(e) => setKwInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addKw(); } }} placeholder="e.g. GUIDE, LINK, FREE" />
                    <Button variant="outline" onClick={addKw} type="button"><PlusIcon size={14} /> Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {keywords.map((k) => (
                      <span key={k} className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                        {k}
                        <button type="button" onClick={() => setKeywords((kw) => kw.filter((x) => x !== k))} className="text-primary/70 hover:text-destructive"><XIcon size={10} /></button>
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">Not case-sensitive. The comment must contain the keyword.</p>
                </>
              )}

              <div className="h-px bg-border" />

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-foreground">Auto-reply on the post</div>
                  <p className="mt-0.5 text-xs text-muted-foreground">Reply publicly to their comment — rotates between variations</p>
                </div>
                <button type="button" onClick={() => setAutoReply((v) => !v)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none ${autoReply ? 'bg-primary' : 'bg-muted'}`}>
                  <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-card shadow transform transition-transform ${autoReply ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>

              {autoReply && (
                <div className="space-y-2.5">
                  {replies.map((r, i) => (
                    <div key={i}>
                      <Label>Reply variation {i + 1}</Label>
                      <Textarea value={r} onChange={(e) => { const next = [...replies]; next[i] = e.target.value.slice(0, 140); setReplies(next); }} rows={2} />
                      <div className="mt-0.5 text-right text-[10px] text-muted-foreground">{r.length}/140</div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Sub-step 3: Message */}
          {sub === 3 && (
            <>
              <div>
                <Label>What DM do you want to send?</Label>
                <p className="mt-0.5 text-xs text-muted-foreground">Write the message that gets sent automatically when someone comments.</p>
              </div>

              <div className="space-y-1.5">
                <Label>Message type</Label>
                <Segmented value={dmType} onChange={setDmType} options={[{ v: 'text-button', l: 'Text + Button' }, { v: 'text', l: 'Text only' }]} />
              </div>

              <div>
                <Label>Message</Label>
                <Textarea value={dmText} onChange={(e) => setDmText(e.target.value.slice(0, 900))} rows={4} placeholder="Hi there! Here's the resource you asked for…" className="mt-1" />
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">Use {'{{name}}'} {'{{username}}'} {'{{keyword}}'} as variables</span>
                  <span className="text-[10px] text-muted-foreground">{dmText.length}/900</span>
                </div>
              </div>

              <div className="space-y-2">
                <LockedCard label="Follow-up message sequence" />
                <LockedCard label="Ask to follow before DM" />
              </div>

              {dmType === 'text-button' && (
                hasButton ? (
                  <div className="space-y-2.5 rounded-xl border border-input bg-muted p-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground">Button</span>
                      <button type="button" onClick={() => setHasButton(false)} className="rounded p-1 text-muted-foreground hover:text-destructive"><XIcon size={14} /></button>
                    </div>
                    <Input value={btnLabel} onChange={(e) => setBtnLabel(e.target.value)} placeholder="Button label" />
                    <Input value={btnUrl} onChange={(e) => setBtnUrl(e.target.value)} placeholder="https://yourlink.com" />
                  </div>
                ) : (
                  <Button variant="outline" onClick={() => setHasButton(true)} type="button"><PlusIcon size={14} /> Add button link</Button>
                )
              )}
            </>
          )}

          {/* Sub-step 4: Review */}
          {sub === 4 && (
            <>
              <div>
                <h3 className="font-display text-base font-bold text-foreground">Review your automation</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">Confirm the details before launching.</p>
              </div>
              <div className="space-y-3">
                <ReviewRow title="Trigger">
                  {postMode === 'specific' ? 'Comment on a specific post' : postMode === 'next' ? 'Comment on your next post' : 'Comment on any post or reel'}
                  {postMode === 'specific' && selectedMedia && (
                    <div className="mt-1.5 flex items-center gap-2">
                      {selectedMedia.thumbnailUrl && <img src={selectedMedia.thumbnailUrl} alt="" className="h-10 w-10 shrink-0 rounded-md object-cover" />}
                      <span className="line-clamp-2 text-xs text-muted-foreground">{selectedMedia.caption || 'Selected post'}</span>
                    </div>
                  )}
                </ReviewRow>
                <ReviewRow title="Keyword">
                  {keywordMode === 'any' ? 'Any comment' : (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {keywords.map((k) => <span key={k} className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">{k}</span>)}
                    </div>
                  )}
                </ReviewRow>
                {autoReply && (
                  <ReviewRow title="Public reply">
                    <span className="italic text-muted-foreground">"{replies[0]}"</span>
                    {replies.length > 1 && <span className="text-xs text-muted-foreground"> +{replies.length - 1} variations</span>}
                  </ReviewRow>
                )}
                <ReviewRow title="DM message">
                  <div className="mt-1 max-w-[85%] rounded-xl rounded-tl-sm border bg-muted p-3">
                    <p className="text-sm text-foreground">{dmText}</p>
                    {dmType === 'text-button' && hasButton && btnLabel && (
                      <div className="mt-2 rounded-md bg-primary px-3 py-1.5 text-center text-xs font-medium text-primary-foreground">{btnLabel}</div>
                    )}
                  </div>
                </ReviewRow>
              </div>
              {launchError && <p className="text-xs text-destructive mt-1">{launchError}</p>}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-5 py-4">
          <span className="text-xs text-muted-foreground">{sub <= 3 ? `Step ${sub} of 3` : 'Review'}</span>
          <div className="flex gap-2">
            {sub > 1 && <Button variant="outline" onClick={() => setSub((s) => (s - 1) as 1 | 2 | 3 | 4)}>Back</Button>}
            {sub < 3 && <Button onClick={() => setSub((s) => (s + 1) as 1 | 2 | 3 | 4)}>Next</Button>}
            {sub === 3 && <Button onClick={() => setSub(4)}>Review & Launch</Button>}
            {sub === 4 && (
              <Button loading={launching} disabled={wizardLoading || !!wizardError || (postMode === 'specific' && !selectedPost) || (keywordMode === 'specific' && keywords.length === 0)} onClick={launch}>
                Confirm & Launch
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Onboarding Page ───────────────────────────────────────────────────

function OnboardingPageInner() {
  const router = useRouter();
  const params = useSearchParams();

  const [step, setStep] = useState(1);
  const [displayName, setDisplayName] = useState('');
  const [handle, setHandle] = useState('');
  const [igConnected, setIgConnected] = useState(false);
  const [igError, setIgError] = useState<string | null>(null);
  const [showWizard, setShowWizard] = useState(false);
  const [automationCreated, setAutomationCreated] = useState(false);
  const [saving, setSaving] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle OAuth redirect back to onboarding (popup fallback — full page redirect)
  useEffect(() => {
    const meta = params.get('meta');
    if (!meta) return;
    if (meta === 'connected') {
      setIgConnected(true);
      setIgError(null);
      setStep((s) => Math.max(s, 3));
    } else if (meta === 'error') {
      const reason = decodeURIComponent(params.get('reason') ?? '');
      if (reason !== 'user_canceled') {
        setIgError(reason);
        setStep((s) => (s < 2 ? 2 : s));
      }
    }
    // Clean up URL params
    router.replace('/onboarding');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for BroadcastChannel from OAuth complete page (same-origin popup)
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;
    const bc = new BroadcastChannel(META_OAUTH_BC_CHANNEL);
    bc.onmessage = async (e: MessageEvent) => {
      if (!e.data || e.data.type !== META_OAUTH_MESSAGE_TYPE) return;
      const result: MetaOAuthResult = e.data.payload;
      if (result.meta === 'connected') {
        if (result.workspaceId) {
          const ok = await isWorkspaceInstagramConnected(result.workspaceId);
          if (!ok) { setIgError('connection_not_persisted'); return; }
        }
        setIgConnected(true);
        setIgError(null);
        setStep((s) => Math.max(s, 3));
      } else if (result.meta === 'error' && result.reason !== 'user_canceled') {
        setIgError(result.reason ?? 'token_exchange_failed');
        setStep((s) => (s < 2 ? 2 : s));
      }
    };
    return () => bc.close();
  }, []);

  // Accept token from app.liffio.com handoff (e.g. when guard redirects here)
  useEffect(() => {
    const urlToken = params.get('token');
    if (urlToken) {
      authStore.setSession({ accessToken: urlToken });
      getAuthMe({ token: urlToken }).then((me) => authStore.setAuthMe(me)).catch(() => {});
      // Remove token from URL
      router.replace('/onboarding');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Redirect if already onboarded
  useEffect(() => {
    if (!mounted) return;
    const { isOnboarded, accessToken } = authStore.getState();
    if (!accessToken) { router.replace('/login'); return; }
    if (isOnboarded) {
      window.location.href = appHandoffUrl(accessToken, '/dashboard');
    }
  }, [mounted, router]);

  const resolveWorkspaceId = useCallback(async (): Promise<string> => {
    const { workspaceId, accessToken } = authStore.getState();
    if (workspaceId) return workspaceId;
    if (!accessToken) throw new Error('Not authenticated');
    const authMe = await getAuthMe({ token: accessToken });
    authStore.setAuthMe(authMe);
    if (!authMe.workspaceId) throw new Error('No workspace found. Please sign in again.');
    return authMe.workspaceId;
  }, []);

  async function handleStep1Continue() {
    setSaving(true);
    try {
      const workspaceId = await resolveWorkspaceId();
      await updateWorkspace(workspaceId, {
        ...(displayName.trim() ? { displayName: displayName.trim() } : {}),
        onboarding: { handle: handle.trim() ? `@${handle.replace(/^@/, '')}` : undefined, step: 1 },
      });
    } catch { /* non-fatal */ }
    setSaving(false);
    setStep(2);
  }

  async function handleConnectInstagram() {
    setIgError(null);
    setConnecting(true);
    try {
      const workspaceId = await resolveWorkspaceId();
      const result = await openMetaOAuthPopup(
        async () => {
          const data = await getMetaOAuthStartUrl(workspaceId);
          return data.url;
        },
        {
          oauthWorkspaceId: workspaceId,
          checkConnected: () => isWorkspaceInstagramConnected(workspaceId),
          verifyConnected: () => isWorkspaceInstagramConnected(workspaceId),
        },
      );
      if (result.meta === 'connected') {
        setIgConnected(true);
        setIgError(null);
        setStep(3);
      } else if (result.reason !== 'user_canceled') {
        setIgError(result.reason ?? 'token_exchange_failed');
      }
    } catch (err) {
      setIgError((err as Error).message);
    } finally {
      setConnecting(false);
    }
  }

  async function finishOnboarding() {
    setFinishing(true);
    try {
      const { accessToken } = authStore.getState();
      if (!accessToken) { router.replace('/login'); return; }
      const workspaceId = await resolveWorkspaceId();
      await updateWorkspace(workspaceId, { isOnboarded: true });
      const authMe = await getAuthMe({ token: accessToken });
      authStore.setAuthMe(authMe);
      window.location.href = appHandoffUrl(accessToken, '/dashboard');
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setFinishing(false);
    }
  }

  if (!mounted) return null;

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-soft-gradient opacity-80" />
      <header className="relative z-10 flex items-center justify-between px-6 py-4">
        <Logo size="small" />
      </header>

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-10">
        <StepProgress step={step} />

        <div className="w-full max-w-lg">
          <div className="w-full rounded-2xl border bg-card p-8 shadow-soft">

            {/* ── Step 1: Brand ───────────────────────────────── */}
            {step === 1 && (
              <div className="space-y-7">
                <div>
                  <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Welcome to Liffio</h1>
                  <p className="mt-1 text-sm text-muted-foreground">Connect your Instagram and start sending automated DMs in minutes.</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="ws-name">Workspace name</Label>
                    <Input id="ws-name" value={displayName} onChange={(e) => setDisplayName(e.target.value.slice(0, 80))} placeholder="My Brand, Studio Name…" />
                    <p className="text-xs text-muted-foreground">Used as your workspace label inside Liffio.</p>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="ig-handle">Instagram handle <span className="font-normal text-muted-foreground">(optional)</span></Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">@</span>
                      <Input id="ig-handle" value={handle} onChange={(e) => setHandle(e.target.value.replace(/^@/, '').replace(/\s/g, ''))} placeholder="yourbrand" className="pl-7" />
                    </div>
                    <p className="text-xs text-muted-foreground">We'll verify it when you connect your account.</p>
                  </div>
                </div>
                <Button className="w-full" onClick={handleStep1Continue} loading={saving}>
                  Continue <ArrowRightIcon size={14} />
                </Button>
              </div>
            )}

            {/* ── Step 2: Connect Instagram ───────────────────── */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">Connect your Instagram</h1>
                  <p className="mt-1 text-sm text-muted-foreground">Liffio connects via Instagram Business Login — your password is never shared.</p>
                </div>

                {igConnected ? (
                  <div className="space-y-5">
                    <div className="flex items-center gap-3 rounded-xl border border-success/30 bg-success/10 p-4">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-success/20">
                        <CheckIcon size={18} />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">Instagram connected</div>
                        {handle && <div className="text-xs text-muted-foreground">@{handle.replace(/^@/, '')}</div>}
                      </div>
                    </div>
                    <Button className="w-full" onClick={() => setStep(3)}>Continue <ArrowRightIcon size={14} /></Button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 rounded-xl border bg-muted p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Requirements</p>
                      <Requirement text="Professional account (Creator or Business)" />
                      <Requirement text="Instagram linked to a Facebook Page" />
                      <Requirement text="Admin access on that Facebook Page" />
                    </div>

                    {igError && <IgErrorPanel reason={igError} />}

                    <div className="space-y-2.5">
                      <Button className="w-full" onClick={handleConnectInstagram} loading={connecting}>
                        <InstagramIcon size={16} />
                        {igError ? 'Retry Instagram connect' : 'Connect with Instagram'}
                      </Button>
                      <Button variant="ghost" className="w-full text-sm text-muted-foreground" onClick={() => setStep(3)}>
                        Skip for now — I'll connect later
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}

            {/* ── Step 3: First Automation ─────────────────────── */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
                    {automationCreated ? 'Automation is live' : 'Create your first automation'}
                  </h1>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {automationCreated
                      ? 'Liffio is now monitoring your comments 24/7 and sending DMs automatically.'
                      : 'When someone comments a keyword on your post, Liffio sends them a DM instantly.'}
                  </p>
                </div>

                {automationCreated ? (
                  <div className="space-y-4">
                    <div className="space-y-1.5 rounded-xl border border-success/30 bg-success/10 p-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-success">
                        <CheckIcon size={14} /> Your automation is active
                      </div>
                      <p className="pl-6 text-xs text-success">New comments that match your keyword will receive a DM automatically.</p>
                    </div>
                    <Button className="w-full" onClick={finishOnboarding} loading={finishing}>
                      {finishing ? 'Opening dashboard…' : 'Go to dashboard'} <ArrowRightIcon size={14} />
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="divide-y divide-border overflow-hidden rounded-xl border bg-card">
                      <ValueProp icon={<MessageSquareIcon size={14} />} title="Comment triggers DM" desc="Someone comments your keyword → they receive a personal DM instantly" />
                      <ValueProp icon={<ZapIcon size={14} />} title="Auto-reply on the post" desc="Reply publicly to boost engagement and post reach" />
                      <ValueProp icon={<ArrowRightIcon size={14} />} title="Link button in DM" desc="Send a button to your link, product, or free resource" />
                    </div>
                    <div className="space-y-2.5">
                      <Button className="w-full" onClick={() => setShowWizard(true)} disabled={!igConnected}>
                        <ZapIcon size={14} /> Set up automation
                      </Button>
                      {!igConnected && <p className="text-center text-xs text-muted-foreground">Connect Instagram first to enable automations</p>}
                      <Button variant="ghost" className="w-full text-sm text-muted-foreground" onClick={finishOnboarding} loading={finishing}>
                        Skip — I'll set up later
                      </Button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {step > 1 && (
          <button className="mt-5 text-sm text-muted-foreground transition-colors hover:text-foreground" onClick={() => setStep((s) => s - 1)}>
            ← Back
          </button>
        )}
      </div>

      {showWizard && (
        <AutomationWizard
          onClose={() => setShowWizard(false)}
          resolveWorkspaceId={resolveWorkspaceId}
          onLaunch={() => { setShowWizard(false); setAutomationCreated(true); }}
        />
      )}
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={null}>
      <OnboardingPageInner />
    </Suspense>
  );
}
