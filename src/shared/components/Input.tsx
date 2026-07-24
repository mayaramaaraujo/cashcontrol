"use client";

import { forwardRef, type InputHTMLAttributes, type ComponentType, type ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ComponentType<{ className?: string }>;
  /** Leading text/element (e.g. a currency symbol) shown instead of `icon`. */
  leadingText?: ReactNode;
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { icon: Icon, leadingText, invalid = false, className = "", ...props },
  ref,
) {
  return (
    <div
      className={`flex h-14 items-center gap-3 rounded-lg border bg-surface-2 px-4 ${
        invalid ? "border-danger" : "not-focus-within:border-surface-border focus-within:border-primary"
      }`}
    >
      {Icon ? <Icon className="size-5 shrink-0 text-text-faint" /> : null}
      {leadingText ? (
        <span className="shrink-0 font-display text-sm font-bold text-text-subtle">{leadingText}</span>
      ) : null}
      <input
        ref={ref}
        // text-base (16px), not text-sm: iOS Safari auto-zooms the viewport
        // on focus for any input with a font-size under 16px.
        className={`min-w-0 flex-1 text-base font-medium text-text-primary placeholder:text-text-faint outline-none ${className}`}
        {...props}
      />
    </div>
  );
});
