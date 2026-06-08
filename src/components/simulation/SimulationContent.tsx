"use client";

import type { ReactNode } from "react";
import { useSimulationLayout } from "@/hooks/usePhoneSize";

type SimulationContentProps = {
  children: ReactNode;
  className?: string;
};

/** Inner screen area - consistent min-height across all simulation templates. */
export function SimulationContent({ children, className = "" }: SimulationContentProps) {
  const { contentMinHeight } = useSimulationLayout();

  return (
    <div
      className={`flex min-h-0 w-full flex-1 flex-col ${className}`}
      style={{ minHeight: contentMinHeight }}
    >
      {children}
    </div>
  );
}
