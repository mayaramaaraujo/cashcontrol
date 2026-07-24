"use client";

import { Loader2, Plus, type LucideIcon } from "lucide-react";

export interface BottomNavItem<T extends string> {
  value: T;
  label: string;
  icon: LucideIcon;
}

interface BottomNavProps<T extends string> {
  items: BottomNavItem<T>[];
  value: T;
  /** Item currently mid-navigation (tapped, not yet rendered) — shows a spinner in its place. */
  pendingValue?: T | null;
  onChange: (value: T) => void;
  onAddClick: () => void;
  addIcon?: LucideIcon;
}

export function BottomNav<T extends string>({
  items,
  value,
  pendingValue = null,
  onChange,
  onAddClick,
  addIcon: AddIcon = Plus,
}: BottomNavProps<T>) {
  const mid = Math.ceil(items.length / 2);
  const leftItems = items.slice(0, mid);
  const rightItems = items.slice(mid);

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-surface-border bg-bg-base/90 px-3 pt-2 backdrop-blur-md"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 10px)" }}
    >
      <div className="mx-auto flex max-w-md items-center justify-between gap-1">
        {leftItems.map((item) => (
          <NavButton
            key={item.value}
            item={item}
            active={item.value === value}
            pending={item.value === pendingValue}
            onChange={onChange}
          />
        ))}

        <button
          type="button"
          onClick={onAddClick}
          aria-label="Add"
          className="-mt-4 mx-1 flex size-14 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-primary to-primary-dark shadow-glow-primary"
        >
          <AddIcon className="size-6 text-text-primary" />
        </button>

        {rightItems.map((item) => (
          <NavButton
            key={item.value}
            item={item}
            active={item.value === value}
            pending={item.value === pendingValue}
            onChange={onChange}
          />
        ))}
      </div>
    </nav>
  );
}

function NavButton<T extends string>({
  item,
  active,
  pending,
  onChange,
}: {
  item: BottomNavItem<T>;
  active: boolean;
  pending: boolean;
  onChange: (value: T) => void;
}) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={() => onChange(item.value)}
      aria-current={active ? "page" : undefined}
      className={`flex flex-1 flex-col items-center gap-1 rounded-md py-1.5 transition-colors ${
        active || pending ? "bg-primary/15 text-primary-light" : "text-text-dim"
      }`}
    >
      {pending ? <Loader2 className="size-5 animate-spin" /> : <Icon className="size-5" />}
      <span className="text-xs font-semibold">{item.label}</span>
    </button>
  );
}
