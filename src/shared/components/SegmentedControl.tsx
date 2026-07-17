"use client";

export interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  /** Override the default primary highlight for this option when active, e.g. "bg-positive text-bg-base". */
  activeClassName?: string;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className = "",
}: SegmentedControlProps<T>) {
  return (
    <div className={`flex gap-1 rounded-lg bg-surface-2 p-1 ${className}`}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={`h-10 flex-1 rounded-md text-sm font-bold transition-colors ${
              active
                ? (option.activeClassName ?? "bg-primary text-text-primary")
                : "text-text-muted"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
