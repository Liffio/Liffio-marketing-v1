import NextLink, { type LinkProps } from "next/link";
import type { ComponentProps, ReactNode } from "react";

type AppLinkProps = LinkProps &
  Omit<ComponentProps<"a">, keyof LinkProps> & {
    children: ReactNode;
  };

/** Internal navigation with prefetch disabled to avoid Next.js 16 dev router init races. */
export default function AppLink({ prefetch = false, ...props }: AppLinkProps) {
  return <NextLink prefetch={prefetch} {...props} />;
}
