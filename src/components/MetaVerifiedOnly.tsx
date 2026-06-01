import type { ReactNode } from "react";
import { isMetaVerified } from "@/lib/meta-verification";

type MetaVerifiedOnlyProps = {
  children: ReactNode;
};

/** Renders children only when `isMetaVerified=true` in `.env`. */
export function MetaVerifiedOnly({ children }: MetaVerifiedOnlyProps) {
  if (!isMetaVerified) return null;
  return <>{children}</>;
}
