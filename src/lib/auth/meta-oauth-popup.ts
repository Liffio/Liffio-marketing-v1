export const META_OAUTH_MESSAGE_TYPE = 'liffio:meta-oauth';
export const META_OAUTH_CLOSE_MESSAGE_TYPE = 'liffio:meta-oauth-close';
export const META_OAUTH_BC_CHANNEL = 'liffio:meta-oauth-bc';

export type MetaOAuthResult = {
  meta: 'connected' | 'error';
  reason?: string;
  step?: number;
  workspaceId?: string;
  igHandle?: string | null;
};

type MetaOAuthMessage = { type: typeof META_OAUTH_MESSAGE_TYPE; payload: MetaOAuthResult };

export type OpenMetaOAuthPopupOptions = {
  oauthWorkspaceId?: string;
  checkConnected?: () => Promise<boolean>;
  verifyConnected?: () => Promise<boolean>;
};

const sleep = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

async function waitForConnectionConfirmation(
  check: (() => Promise<boolean>) | undefined,
  maxWaitMs = 12_000,
): Promise<boolean> {
  if (!check) return true;
  const deadline = Date.now() + maxWaitMs;
  while (Date.now() < deadline) {
    try { if (await check()) return true; } catch { /* ignore */ }
    await sleep(500);
  }
  return false;
}

function buildPopupFeatures(): string {
  const w = 520, h = 720;
  const left = Math.max(0, Math.round(window.screenX + (window.outerWidth - w) / 2));
  const top = Math.max(0, Math.round(window.screenY + (window.outerHeight - h) / 2));
  return [`width=${w}`, `height=${h}`, `left=${left}`, `top=${top}`, 'scrollbars=yes', 'resizable=yes', 'toolbar=no', 'menubar=no', 'location=no', 'status=no'].join(',');
}

function isTrustedOAuthMessage(data: unknown): data is MetaOAuthMessage {
  return Boolean(data && typeof data === 'object' && (data as MetaOAuthMessage).type === META_OAUTH_MESSAGE_TYPE && (data as MetaOAuthMessage).payload);
}

function isOAuthCloseMessage(data: unknown): boolean {
  return Boolean(data && typeof data === 'object' && (data as { type?: string }).type === META_OAUTH_CLOSE_MESSAGE_TYPE);
}

function forceClosePopup(popup: Window) {
  let attempts = 0;
  const id = window.setInterval(() => {
    attempts++;
    if (popup.closed) { window.clearInterval(id); return; }
    try { popup.close(); } catch { /* ignore */ }
    if (attempts >= 20) window.clearInterval(id);
  }, 200);
  try { window.focus(); } catch { /* ignore */ }
}

export function openMetaOAuthPopup(
  fetchAuthorizeUrl: () => Promise<string>,
  options: OpenMetaOAuthPopupOptions = {},
): Promise<MetaOAuthResult> {
  return new Promise((resolve, reject) => {
    const appOrigin = window.location.origin;
    const popup = window.open('about:blank', 'liffio-meta-oauth', buildPopupFeatures());
    if (!popup) { reject(new Error('Popup blocked. Allow popups for this site and try again.')); return; }

    try {
      popup.document.title = 'Instagram';
      popup.document.body.innerHTML = '<p style="font-family:system-ui,sans-serif;padding:24px;color:#666">Opening Instagram…</p>';
    } catch { /* cross-origin after navigation */ }

    let settled = false;
    const timeoutId = window.setTimeout(() => fail(new Error('Instagram login timed out.')), 10 * 60 * 1000);

    const bc = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(META_OAUTH_BC_CHANNEL) : null;
    if (bc) {
      bc.onmessage = (e: MessageEvent) => {
        if (isOAuthCloseMessage(e.data)) { forceClosePopup(popup); return; }
        if (!isTrustedOAuthMessage(e.data)) return;
        const payload = e.data.payload;
        if (payload.meta === 'connected' && !payload.workspaceId && options.oauthWorkspaceId) payload.workspaceId = options.oauthWorkspaceId;
        void settleAfterVerification(payload);
      };
    }

    const onMessage = (e: MessageEvent) => {
      if (e.origin !== appOrigin) return;
      if (isOAuthCloseMessage(e.data)) { forceClosePopup(popup); return; }
      if (!isTrustedOAuthMessage(e.data)) return;
      const payload = e.data.payload;
      if (payload.meta === 'connected' && !payload.workspaceId && options.oauthWorkspaceId) payload.workspaceId = options.oauthWorkspaceId;
      void settleAfterVerification(payload);
    };

    const connPollId = window.setInterval(() => {
      if (!options.checkConnected || settled) return;
      void options.checkConnected().then((connected) => {
        if (connected) void settleAfterVerification({ meta: 'connected', step: 3, workspaceId: options.oauthWorkspaceId });
      });
    }, 800);

    const closedPollId = window.setInterval(() => {
      if (!popup.closed || settled) return;
      window.setTimeout(async () => {
        if (settled) return;
        if (options.checkConnected) {
          try { if (await options.checkConnected()) { await settleAfterVerification({ meta: 'connected', step: 3, workspaceId: options.oauthWorkspaceId }); return; } } catch { /* ignore */ }
        }
        if (options.verifyConnected && options.verifyConnected !== options.checkConnected) {
          try { if (await options.verifyConnected()) { await settleAfterVerification({ meta: 'connected', step: 3, workspaceId: options.oauthWorkspaceId }); return; } } catch { /* ignore */ }
        }
        settle({ meta: 'error', reason: 'user_canceled' });
      }, 600);
    }, 400);

    function cleanup() {
      window.clearTimeout(timeoutId);
      window.clearInterval(connPollId);
      window.clearInterval(closedPollId);
      window.removeEventListener('message', onMessage);
      bc?.close();
    }

    function settle(result: MetaOAuthResult) {
      if (settled) return;
      settled = true;
      cleanup();
      forceClosePopup(popup!);
      resolve(result);
    }

    async function settleAfterVerification(result: MetaOAuthResult) {
      if (result.meta === 'connected') {
        const verify = options.verifyConnected ?? options.checkConnected;
        if (!(await waitForConnectionConfirmation(verify))) { settle({ meta: 'error', reason: 'connection_not_persisted' }); return; }
      }
      settle(result);
    }

    function fail(err: Error) {
      if (settled) return;
      settled = true;
      cleanup();
      forceClosePopup(popup!);
      reject(err);
    }

    window.addEventListener('message', onMessage);
    void fetchAuthorizeUrl().then((url) => { popup.location.href = url; }).catch((err) => fail(err instanceof Error ? err : new Error(String(err))));
  });
}
