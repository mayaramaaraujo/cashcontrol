"use client";

import { useState } from "react";
import { SegmentedControl } from "@/shared/components/SegmentedControl";
import { formatCurrency } from "@/shared/lib/utils";
import type { HeroData, SummaryMode } from "@/features/dashboard/lib";

interface HeroSectionProps {
  hero: Record<SummaryMode, HeroData>;
}

export function HeroSection({ hero }: HeroSectionProps) {
  const [mode, setMode] = useState<SummaryMode>("income");
  const active = hero[mode];

  return (
    <div>
      <SegmentedControl
        value={mode}
        onChange={setMode}
        options={[
          { value: "income", label: "Income" },
          { value: "bills", label: "Bills", activeClassName: "bg-positive text-bg-base" },
          { value: "left", label: "Left", activeClassName: "bg-violet text-text-primary" },
        ]}
      />

      <div className="relative mt-3.5 overflow-hidden rounded-3xl border border-primary/22 bg-gradient-to-br from-bg-hero-from via-bg-hero-via to-bg-hero-to p-6">
        <div className="hero-glow absolute -top-16 -right-10 size-44 rounded-full" />
        <p className="relative text-xs font-semibold tracking-wide text-primary-muted">
          {active.label}
        </p>
        <div className="relative mt-2 flex items-end gap-1.5">
          <span className={`font-display text-2xl font-medium ${active.colorClass}`}>€</span>
          <span
            className={`font-display text-5xl font-extrabold tracking-tighter ${active.colorClass}`}
          >
            {formatCurrency(active.value)}
          </span>
        </div>
        <p className="relative mt-3 text-sm text-text-muted">{active.sub}</p>
      </div>
    </div>
  );
}
