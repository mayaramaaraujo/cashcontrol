/**
 * Plain (non-"use client") home for the Chip accent palette. `Chip.tsx` is a
 * client component, so any value (not type) imported from it into a Server
 * Component or Server Action module resolves to an opaque client reference
 * instead of the real value — these constants need to be usable from both,
 * so they live here and `Chip.tsx` re-exports them for client consumers.
 */
export const CHIP_ACCENT_SELECTED_CLASSES = {
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

export type ChipAccent = keyof typeof CHIP_ACCENT_SELECTED_CLASSES;

export const CHIP_ACCENTS = Object.keys(CHIP_ACCENT_SELECTED_CLASSES) as ChipAccent[];

/** Solid `bg-*` class per accent — Tailwind needs the full class name statically present. */
export const CHIP_ACCENT_BG_CLASSES: Record<ChipAccent, string> = {
  primary: "bg-primary",
  positive: "bg-positive",
  "positive-dark": "bg-positive-dark",
  warning: "bg-warning",
  violet: "bg-violet",
  "neutral-accent": "bg-neutral-accent",
  "avatar-1": "bg-avatar-1",
  "avatar-2": "bg-avatar-2",
  "avatar-3": "bg-avatar-3",
  "avatar-4": "bg-avatar-4",
  "avatar-5": "bg-avatar-5",
  neutral: "bg-surface-4",
};
