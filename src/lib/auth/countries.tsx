'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * The one country list the product asks from.
 *
 * It lives here rather than in the signup form because signup is no longer the only place that
 * asks. **Google signup cannot ask** — the callback is a redirect with no form, and Google's
 * profile carries no country — so the account lands with `country: null` and onboarding has to
 * collect it instead (`(auth)/onboarding/screen-country.tsx`).
 *
 * Two copies of this list would be two different sets of selectable countries for the same
 * account field, and the field is set-once on the server: whichever screen happened to ask is
 * what the customer is billed in, forever.
 */
export const COUNTRIES: [string, string][] = [
  // Core English markets
  ['US', 'United States'], ['GB', 'United Kingdom'], ['IN', 'India'], ['CA', 'Canada'],
  ['AU', 'Australia'], ['NZ', 'New Zealand'], ['IE', 'Ireland'],
  // Western & Northern Europe
  ['DE', 'Germany'], ['FR', 'France'], ['NL', 'Netherlands'], ['CH', 'Switzerland'],
  ['IT', 'Italy'], ['ES', 'Spain'], ['BE', 'Belgium'], ['AT', 'Austria'],
  ['SE', 'Sweden'], ['NO', 'Norway'], ['DK', 'Denmark'], ['FI', 'Finland'], ['PT', 'Portugal'],
  // Gulf
  ['AE', 'UAE'], ['SA', 'Saudi Arabia'],
  // High income Asia
  ['SG', 'Singapore'], ['HK', 'Hong Kong'], ['JP', 'Japan'], ['KR', 'South Korea'], ['TW', 'Taiwan'],
  // MENA
  ['IL', 'Israel'], ['TR', 'Turkey'], ['EG', 'Egypt'],
  // South & Southeast Asia
  ['MY', 'Malaysia'], ['ID', 'Indonesia'], ['PH', 'Philippines'], ['TH', 'Thailand'], ['VN', 'Vietnam'],
  ['PK', 'Pakistan'], ['BD', 'Bangladesh'], ['LK', 'Sri Lanka'], ['NP', 'Nepal'],
  // Latin America
  ['BR', 'Brazil'], ['MX', 'Mexico'], ['AR', 'Argentina'], ['CO', 'Colombia'], ['CL', 'Chile'], ['PE', 'Peru'],
  // Eastern Europe
  ['RU', 'Russia'], ['PL', 'Poland'], ['UA', 'Ukraine'], ['CZ', 'Czech Republic'],
  ['RO', 'Romania'], ['HU', 'Hungary'], ['GR', 'Greece'], ['RS', 'Serbia'],
  // Africa
  ['ZA', 'South Africa'], ['NG', 'Nigeria'], ['KE', 'Kenya'], ['GH', 'Ghana'], ['ET', 'Ethiopia'], ['TZ', 'Tanzania'],
  // Other
  ['AF', 'Afghanistan'],
];

const KNOWN_CODES = new Set(COUNTRIES.map(([code]) => code));

/** Only codes the picker can actually render — anything else must fall back to blank. */
export function isKnownCountryCode(code: string | null | undefined): boolean {
  return !!code && KNOWN_CODES.has(code.toUpperCase());
}

export function CountryFlagImg({ code }: { code: string }) {
  return (
    <img
      src={`https://flagcdn.com/w20/${code.toLowerCase()}.png`}
      width={20}
      height={15}
      alt={code}
      className="rounded-[2px] object-cover"
    />
  );
}

export function CountrySelect({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = COUNTRIES.find(([code]) => code === value);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm border border-input rounded-xl bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition text-left disabled:cursor-not-allowed disabled:opacity-60"
      >
        {selected ? (
          <>
            <CountryFlagImg code={selected[0]} />
            <span className="flex-1">{selected[1]}</span>
          </>
        ) : (
          <span className="flex-1 text-muted-foreground">Select your country…</span>
        )}
        <svg className={`h-4 w-4 text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>
      {open && (
        <div className="absolute z-50 mt-1 w-full max-h-48 sm:max-h-60 overflow-y-auto rounded-xl border border-input bg-background shadow-lg">
          {COUNTRIES.map(([code, label]) => (
            <button
              key={code}
              type="button"
              onClick={() => { onChange(code); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left hover:bg-primary/5 transition-colors ${value === code ? 'bg-primary/10 text-primary font-medium' : 'text-foreground'}`}
            >
              <CountryFlagImg code={code} />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
