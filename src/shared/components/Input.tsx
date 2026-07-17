"use client";

import { forwardRef, type InputHTMLAttributes, type ComponentType } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ComponentType<{ className?: string }>;
  invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { icon: Icon, invalid = false, className = "", ...props },
  ref,
) {
  return (
    <div
      className={`flex h-14 items-center gap-3 rounded-lg border bg-surface-2 px-4 ${
        invalid ? "border-danger" : "border-surface-border focus-within:border-primary"
      }`}
    >
      {Icon ? <Icon className="size-5 shrink-0 text-text-faint" /> : null}
      <input
        ref={ref}
        className={`min-w-0 flex-1 text-sm font-medium text-text-primary placeholder:text-text-faint ${className}`}
        {...props}
      />
    </div>
  );
});
