'use client';

import { useState } from 'react';
import { API_BASE } from '@/lib/auth/api';
import { BOX_ERRORS, codeInput, codeOutcome, codeReady, CODE_INPUT_MAX, lookupCode } from '@/lib/partner-claim';

/**
 * What the sign-up form needs from the row: nothing typed, a found code (with the partner to
 * /check it against on Create account), or a typed code that hasn't been applied.
 */
export type AppliedCode = { status: 'empty' } | { status: 'pending' } | { status: 'found'; slug: string; code: string };

/*
  "Have a code?" on liffio.com/register (partner rewards SPEC 9.5, designs/claim-redeem.html). The
  same public lookup and rate limit as /redeem. Apply only looks the code up; the 30-minute hold
  is made on Create account (register-form.tsx), then rides the same pending-hold path a
  /claim/<slug> code does: ?redirect= to confirm-email, sessionStorage through onboarding and the
  Instagram connect, then the app's /partner-claim attach route.
*/
export function HaveACode({ onChange, error }: { onChange: (c: AppliedCode) => void; error: string | null }) {
  const [value, setValue] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [found, setFound] = useState<string | null>(null);

  const apply = async () => {
    if (!codeReady(value) || busy) return;
    setBusy(true);
    setMessage(null);
    try {
      const r = await lookupCode(API_BASE, value);
      const out = codeOutcome(r, r.partner ?? null);
      if (out.kind === 'found' && r.partner && r.offer && r.code) {
        setFound(`${r.partner.name}: ${r.offer.label}. Starts when you connect Instagram.`);
        onChange({ status: 'found', slug: r.partner.slug, code: r.code });
      } else {
        setMessage(out.kind === 'box' ? out.message : out.kind === 'notice' ? `${out.notice.title}. ${out.notice.body}` : BOX_ERRORS.invalid);
      }
    } catch (err) {
      setMessage(err instanceof Error && err.message === 'rate_limited' ? BOX_ERRORS.tooMany : BOX_ERRORS.failed);
    } finally {
      setBusy(false);
    }
  };

  const shown = error ?? message;
  return (
    <div className="a2-have">
      <label htmlFor="partnerCode" className="a2-have-h">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 8a2 2 0 0 0 2-2h14a2 2 0 0 0 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 0-2 2H5a2 2 0 0 0-2-2v-2a2 2 0 0 0 0-4z" />
          <path d="M13 6v2M13 11v2M13 16v2" />
        </svg>
        Have a code?
        <small>Optional</small>
      </label>
      <div className="a2-have-row">
        <input
          id="partnerCode"
          className={`a2-input a2-code${shown ? ' a2-bad' : found ? ' a2-good' : ''}`}
          placeholder="e.g. BOOST30"
          autoCapitalize="characters"
          // Not a login code and not a saved value: keep browsers and password managers out.
          name="perk"
          autoComplete="off"
          data-1p-ignore="true"
          data-lpignore="true"
          data-bwignore="true"
          data-form-type="other"
          spellCheck={false}
          maxLength={CODE_INPUT_MAX}
          value={value}
          readOnly={Boolean(found)}
          aria-describedby="partnerCodeMsg"
          aria-invalid={shown ? true : undefined}
          onChange={(e) => {
            const v = codeInput(e.target.value);
            setValue(v);
            setMessage(null);
            onChange(v ? { status: 'pending' } : { status: 'empty' });
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              void apply();
            }
          }}
        />
        {found ? (
          <button
            type="button"
            className="a2-have-btn"
            onClick={() => {
              setFound(null);
              setValue('');
              onChange({ status: 'empty' });
            }}
          >
            Remove
          </button>
        ) : (
          <button type="button" className="a2-have-btn" disabled={!codeReady(value) || busy} onClick={() => void apply()}>
            {busy ? 'Checking' : 'Apply'}
          </button>
        )}
      </div>
      <div id="partnerCodeMsg" aria-live="polite">
        {shown ? (
          <div className="a2-msg" role="alert">
            {shown}
          </div>
        ) : found ? (
          <div className="a2-have-ok">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            <span>{found}</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
