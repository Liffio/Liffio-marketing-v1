"use client";

import { useEffect, useRef } from "react";
import { authStore } from "@/lib/auth/store";
import { getAuthMe } from "@/lib/auth/api";

/**
 * Mounted once in the root layout. authStore only persists the access token
 * across page loads (not the user object), so a returning visitor with a
 * valid session still needs one getAuthMe() call before the page knows who
 * they are (the Navbar reads `session.user`).
 *
 * 🔴 It no longer tells analytics who they are. It used to pass the user id to
 * `umami.identify`, which stored raw user UUIDs in Umami. That call is gone
 * for good (see `analytics.ts`); the name is kept only to avoid churn in the
 * layout, and this restores the session's user and nothing else.
 */
export function IdentifyOnLoad() {
  const checked = useRef(false);

  useEffect(() => {
    if (checked.current) return;
    checked.current = true;

    const { accessToken, user } = authStore.getState();
    if (!accessToken || user) return; // no session, or already identified this session

    getAuthMe({ token: accessToken })
      .then((authMe) => {
        authStore.setAuthMe(authMe);
      })
      .catch(() => {
        // Expired/invalid token, non-fatal: the visitor is simply logged out.
      });
  }, []);

  return null;
}
