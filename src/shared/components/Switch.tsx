"use client";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export function Switch({ checked, onCheckedChange, className = "" }: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={`relative h-6 w-[42px] shrink-0 rounded-full transition-colors ${
        checked ? "bg-primary" : "bg-surface-4"
      } ${className}`}
    >
      <span
        className={`absolute top-[3px] size-[18px] rounded-full bg-text-primary transition-transform ${
          checked ? "translate-x-[21px]" : "translate-x-[3px]"
        }`}
      />
    </button>
  );
}
