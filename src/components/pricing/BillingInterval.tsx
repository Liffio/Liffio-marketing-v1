"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

/**
 * Shared monthly/annual state for one page.
 *
 * The toggle lives in PricingPlansGrid, but the break-even calculator further
 * down the page needs to know about it — it hides itself on annual, because
 * "how many accounts do you run" and "how are you billed" together make a
 * two-variable comparison for no gain. The crossover is 10 either way.
 *
 * 🚩 The context is OPTIONAL by design. PricingPlansGrid also renders on the
 * homepage inside PricingSection, where there is no provider and no calculator;
 * there it keeps its own state and behaves exactly as before.
 */
type BillingInterval = { annual: boolean; setAnnual: (value: boolean) => void };

const BillingIntervalContext = createContext<BillingInterval | null>(null);

export function BillingIntervalProvider({ children }: { children: ReactNode }) {
  const [annual, setAnnual] = useState(false);
  return (
    <BillingIntervalContext.Provider value={{ annual, setAnnual }}>
      {children}
    </BillingIntervalContext.Provider>
  );
}

/** Null when there is no provider — the caller then owns its own state. */
export function useSharedBillingInterval(): BillingInterval | null {
  return useContext(BillingIntervalContext);
}
