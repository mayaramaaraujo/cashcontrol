"use client";

import type { ButtonHTMLAttributes } from "react";

const VARIANT_CLASSES = {
  primary:
    "bg-gradient-to-br from-primary to-primary-dark text-text-primary shadow-glow-primary",
  secondary: "bg-white text-zinc-900",
  outline: "border border-surface-border bg-surface-2 text-text-primary",
  danger: "bg-danger/12 text-danger",
} as const;

export type ButtonVariant = keyof typeof VARIANT_CLASSES;

const SIZE_CLASSES = {
  sm: "h-11 text-sm",
  md: "h-14 text-sm",
} as const;

export type ButtonSize = keyof typeof SIZE_CLASSES;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 font-display font-semibold transition-opacity disabled:pointer-events-none disabled:opacity-50 ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
