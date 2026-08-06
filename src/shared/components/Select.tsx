"use client";

import { ChevronDown } from "lucide-react";

interface SelectOption<T extends string> {
  value: T;
  label: string;
}

interface SelectProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  className?: string;
}

export function Select<T extends string>({ value, onChange, options, className = "" }: SelectProps<T>) {
  return (
    <div className={`relative inline-flex ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="h-10 appearance-none rounded-lg border border-surface-border bg-surface-2 py-2 pr-9 pl-3.5 text-sm font-semibold text-text-primary outline-none focus:border-primary"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-text-faint" />
    </div>
  );
}
