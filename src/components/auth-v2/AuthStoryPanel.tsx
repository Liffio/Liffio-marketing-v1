'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';

/**
 * The right-hand story panel shared by register, confirm-email and login.
 *
 * Ports the comment -> DM animation from `auth-design-reference.html` 1:1:
 * same beats, same durations, same 4-step timeline sync. The static preview
 * drove this with direct DOM manipulation (`classList.toggle`); here each
 * beat is a derived render of a single `step` counter, which is what let the
 * reduced-motion branch become a plain early return instead of a second copy
 * of the DOM-manipulation code.
 */

const DURATIONS_MS = [700, 1500, 1300, 500, 500, 1100, 2400, 500, 700, 2200];

type Beat = {
  ev: 0 | 1 | 2 | 3 | 4;
  row1: boolean;
  row2: boolean;
  row3: boolean;
  chat: boolean;
  b1: boolean;
  typing: boolean;
  b2: boolean;
};

const BEATS: Beat[] = [
  { ev: 0, row1: false, row2: false, row3: false, chat: false, b1: false, typing: false, b2: false },
  { ev: 1, row1: true, row2: false, row3: false, chat: false, b1: false, typing: false, b2: false },
  { ev: 2, row1: true, row2: false, row3: false, chat: false, b1: false, typing: false, b2: false },
  { ev: 2, row1: true, row2: false, row3: false, chat: true, b1: false, typing: false, b2: false },
  { ev: 2, row1: true, row2: false, row3: false, chat: true, b1: true, typing: false, b2: false },
  { ev: 2, row1: true, row2: false, row3: false, chat: true, b1: true, typing: true, b2: false },
  { ev: 3, row1: true, row2: false, row3: false, chat: true, b1: true, typing: false, b2: true },
  { ev: 3, row1: true, row2: false, row3: false, chat: false, b1: true, typing: false, b2: true },
  { ev: 4, row1: true, row2: true, row3: false, chat: false, b1: true, typing: false, b2: true },
  { ev: 4, row1: true, row2: true, row3: true, chat: false, b1: true, typing: false, b2: true },
];

const REDUCED_MOTION_BEAT: Beat = {
  ev: 4,
  row1: true,
  row2: true,
  row3: true,
  chat: true,
  b1: true,
  typing: false,
  b2: true,
};

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
}
function getReducedMotionSnapshot(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, () => false);
}

function usePhoneAnimation(): Beat {
  const reduced = usePrefersReducedMotion();
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    if (reduced) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    function run(i: number) {
      setStepIndex(i);
      timer = setTimeout(() => {
        if (cancelled) return;
        run((i + 1) % BEATS.length);
      }, DURATIONS_MS[i]);
    }
    run(0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [reduced]);

  return reduced ? REDUCED_MOTION_BEAT : BEATS[stepIndex];
}

const TIMELINE = [
  { ev: 1 as const, label: 'Comment matches RECIPE', note: 'priya.bakes' },
  { ev: 2 as const, label: 'Public reply posted', note: 'under the comment' },
  { ev: 3 as const, label: 'DM delivered', note: '12 seconds later' },
  { ev: 4 as const, label: 'Next comment, same thing', note: 'all day, every day' },
];

export function AuthStoryPanel({ headline }: { headline: string }) {
  const beat = usePhoneAnimation();

  return (
    <aside className="a2-story" aria-label="How Liffio works">
      <h2>{headline}</h2>
      <p className="a2-lede">
        You pick the keyword once. Liffio replies to every comment, even the ones at 3am.
      </p>

      <div className="a2-scene">
        <div className="a2-phone" aria-hidden="true">
          <div className={`a2-screen${beat.chat ? ' a2-chat' : ''}`}>
            <div className="a2-bar">
              <span>9:41</span>
              <span>●●● ▮</span>
            </div>
            <div className="a2-post">
              <div className="a2-ph">
                <span className="a2-pav" />
                yourbrand
              </div>
              <div className="a2-img" />
              <div className="a2-cm">
                <b>yourbrand</b> Full recipe in your DMs. Comment RECIPE 👇
              </div>
              <div className={`a2-row${beat.row1 ? ' a2-in' : ''}`}>
                <span className="a2-cav a2-y" />
                <p>
                  <b>priya.bakes</b> need this asap <span className="a2-kw">RECIPE</span>
                  <span className="a2-reply" style={{ display: 'block' }}>
                    Reply · Sent you a DM 💌
                  </span>
                </p>
              </div>
              <div className={`a2-row${beat.row2 ? ' a2-in' : ''}`}>
                <span className="a2-cav a2-g" />
                <p>
                  <b>chef.arjun</b> <span className="a2-kw">recipe</span> pls
                </p>
              </div>
              <div className={`a2-row${beat.row3 ? ' a2-in' : ''}`}>
                <span className="a2-cav" />
                <p>
                  <b>mia.eats</b> RECIPE!!
                </p>
              </div>
            </div>
            <div className="a2-dm">
              <div className="a2-dmh">
                <span className="a2-pav" />
                yourbrand
              </div>
              <div className="a2-msgs">
                <div className={`a2-b a2-them${beat.b1 ? ' a2-in' : ''}`}>need this asap RECIPE</div>
                <div className={`a2-typing${beat.typing ? ' a2-in' : ''}`}>
                  <i />
                  <i />
                  <i />
                </div>
                <div className={`a2-b a2-me${beat.b2 ? ' a2-in' : ''}`}>
                  Hey Priya! Here&apos;s the full recipe 🍰<span className="a2-lnk">Open recipe</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="a2-log" aria-hidden="true">
          {TIMELINE.map((t) => (
            <div key={t.ev} className={`a2-ev${beat.ev === t.ev ? ' a2-on' : ''}`}>
              {t.label}
              <small>{t.note}</small>
            </div>
          ))}
        </div>
      </div>

      <div className="a2-facts">
        <span>
          <strong>Razorpay</strong> billing
        </span>
        <span>
          <strong>GST</strong> invoices in India
        </span>
        <span>
          <strong>Cancel</strong> any time
        </span>
      </div>
    </aside>
  );
}
