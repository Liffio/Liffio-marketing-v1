"use client";

import { useEffect, useRef } from "react";
import { authStore } from "@/lib/auth/store";
import { getAuthMe } from "@/lib/auth/api";
import { identifyUser } from "./analytics";

/**
 * Mounted once in the root layout. authStore only persists the access token
 * across page loads (not the user object), so a returning visitor with a
 * valid session still needs one getAuthMe() call before we know who they
 * are. Without this, only the exact moment of submitting the login form
 * gets identified — a bookmarked/reopened tab with a still-valid token
 * would stay anonymous even though it's the same known user.
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
        identifyUser(authMe.user.id);
      })
      .catch(() => {
        // Expired/invalid token — non-fatal, just skip identification.
      });
  }, []);

  return null;
}
