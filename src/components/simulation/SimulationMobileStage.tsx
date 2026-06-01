import type { ReactNode } from "react";

type SimulationMobileStageProps = {
  children: ReactNode;
  className?: string;
};

/** Centers coded simulations on small screens with a consistent max width. */
export function SimulationMobileStage({ children, className = "" }: SimulationMobileStageProps) {
  return (
    <div className={`simulation-mobile-stage relative mx-auto w-full max-w-[min(100%,300px)] ${className}`}>
      <div className="flex w-full justify-center [&>div]:max-w-full">{children}</div>
    </div>
  );
}
