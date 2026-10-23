const KEY = 'liffio_last_auth_method';

/**
 * Which sign-in method this browser last completed successfully, for the
 * "Last used" badge on /login's Google button. Read and write both go
 * through try/catch: a blocked or full `localStorage` must never break sign
 * in, it only means the badge does not show.
 */
export function markGoogleAuthUsed(): void {
  try {
    localStorage.setItem(KEY, 'google');
  } catch {
    /* storage blocked */
  }
}

export function markEmailAuthUsed(): void {
  try {
    localStorage.setItem(KEY, 'email');
  } catch {
    /* storage blocked */
  }
}

export function wasGoogleLastUsed(): boolean {
  try {
    return localStorage.getItem(KEY) === 'google';
  } catch {
    return false;
  }
}
