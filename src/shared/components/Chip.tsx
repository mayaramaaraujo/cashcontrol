"use client";

import type { ButtonHTMLAttributes } from "react";
import { CHIP_ACCENT_SELECTED_CLASSES, type ChipAccent } from "@/shared/lib/chip-accents";

export type { ChipAccent };
export { CHIP_ACCENTS, CHIP_ACCENT_BG_CLASSES } from "@/shared/lib/chip-accents";

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  accent?: ChipAccent;
}

export function Chip({
  selected = false,
  accent = "primary",
  className = "",
  children,
  ...props
}: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`shrink-0 rounded-sm border px-3 py-2 text-xs font-semibold transition-colors ${
        selected
          ? CHIP_ACCENT_SELECTED_CLASSES[accent]
          : "border-surface-border bg-surface-2 text-text-muted"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
