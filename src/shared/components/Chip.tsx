"use client";

import type { ButtonHTMLAttributes } from "react";

const ACCENT_SELECTED_CLASSES = {
  primary: "border-primary bg-primary/15 text-text-primary",
  positive: "border-positive bg-positive/15 text-text-primary",
  "positive-dark": "border-positive-dark bg-positive-dark/15 text-text-primary",
  warning: "border-warning bg-warning/15 text-text-primary",
  violet: "border-violet bg-violet/15 text-text-primary",
  "neutral-accent": "border-neutral-accent bg-neutral-accent/15 text-text-primary",
  "avatar-1": "border-avatar-1 bg-avatar-1/15 text-text-primary",
  "avatar-2": "border-avatar-2 bg-avatar-2/15 text-text-primary",
  "avatar-3": "border-avatar-3 bg-avatar-3/15 text-text-primary",
  "avatar-4": "border-avatar-4 bg-avatar-4/15 text-text-primary",
  "avatar-5": "border-avatar-5 bg-avatar-5/15 text-text-primary",
  neutral: "border-surface-4 bg-surface-4 text-text-primary",
} as const;

export type ChipAccent = keyof typeof ACCENT_SELECTED_CLASSES;

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
          ? ACCENT_SELECTED_CLASSES[accent]
          : "border-surface-border bg-surface-2 text-text-muted"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
