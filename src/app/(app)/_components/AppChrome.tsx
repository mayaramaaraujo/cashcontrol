"use client";

import { useState, useTransition, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, Home, Receipt, History, Users, Calendar, ArrowUp, ArrowDown } from "lucide-react";
import { Avatar, type AvatarColorIndex } from "@/shared/components/Avatar";
import { Sheet } from "@/shared/components/Sheet";
import { BottomNav, type BottomNavItem } from "@/shared/components/BottomNav";
import type { GroupMember } from "@/features/groups/types";
import { BillSheet } from "@/features/bills/components/BillSheet";
import { AddIncomeSheet } from "@/features/income/components/AddIncomeSheet";

type Tab = "home" | "bills" | "history" | "people";

const NAV_ITEMS: BottomNavItem<Tab>[] = [
  { value: "home", label: "Home", icon: Home },
  { value: "bills", label: "Bills", icon: Receipt },
  { value: "history", label: "History", icon: History },
  { value: "people", label: "People", icon: Users },
];

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function getMonthOptions() {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    return { value, label };
  });
}

interface AppChromeProps {
  groupName: string;
  members: GroupMember[];
  currentMemberId: string;
  children: ReactNode;
}

export function AppChrome({ groupName, members, currentMemberId, children }: AppChromeProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showAddChoice, setShowAddChoice] = useState(false);
  const [, startTransition] = useTransition();
  const [pendingTab, setPendingTab] = useState<Tab | null>(null);

  const activeTab = (NAV_ITEMS.find((item) => pathname.startsWith(`/${item.value}`))?.value ??
    "home") as Tab;

  // Once the new route has actually rendered, activeTab (derived from
  // pathname) already matches pendingTab, so it stops being shown as
  // pending here — no need to explicitly clear the state.
  const displayedPendingTab = pendingTab && pendingTab !== activeTab ? pendingTab : null;

  function navigateTab(tab: Tab) {
    if (tab === activeTab) return;
    setPendingTab(tab);
    startTransition(() => {
      router.push(`/${tab}`);
    });
  }

  const now = new Date();
  const defaultMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const selectedMonth = searchParams.get("month") ?? defaultMonth;
  const monthOptions = getMonthOptions();
  const monthLabel =
    monthOptions.find((m) => m.value === selectedMonth)?.label ??
    monthOptions[0].label;

  function setMonth(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", value);
    router.push(`${pathname}?${params.toString()}`);
    setShowMonthPicker(false);
  }

  function openSheet(sheet: "income" | "bill") {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sheet", sheet);
    router.push(`${pathname}?${params.toString()}`);
    setShowAddChoice(false);
  }

  function closeSheet() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("sheet");
    router.push(`${pathname}?${params.toString()}`);
  }

  const visibleMembers = members.slice(0, 3);
  const overflowCount = members.length - visibleMembers.length;

  return (
    <div className="min-h-screen">
      <div
        className="fixed inset-x-0 top-0 z-20 flex items-center justify-between bg-linear-to-b from-bg-base from-80% to-transparent px-5 pb-3"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 1.5rem)" }}
      >
        <div className="min-w-0">
          <button
            type="button"
            onClick={() => setShowMonthPicker(true)}
            className="flex items-center gap-1 text-xs text-text-subtle"
          >
            <span>{monthLabel}</span>
            <ChevronDown className="size-3" />
          </button>
          <h2 className="mt-0.5 truncate font-display text-xl font-bold text-text-primary">
            {groupName}
          </h2>
        </div>
        <Link href="/people" className="flex shrink-0 items-center">
          {visibleMembers.map((member) => (
            <Avatar
              key={member.id}
              initials={getInitials(member.displayName)}
              colorIndex={member.colorIndex as AvatarColorIndex}
              className="not-first:-ml-2 border-2 border-bg-base"
            />
          ))}
          {overflowCount > 0 ? (
            <span className="-ml-2 flex size-8 items-center justify-center rounded-full border-2 border-bg-base bg-surface-4 font-display text-xs font-bold text-text-primary">
              +{overflowCount}
            </span>
          ) : null}
        </Link>
      </div>

      <main
        className="px-5 pb-28"
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 6rem)" }}
      >
        {children}
      </main>

      <BottomNav
        items={NAV_ITEMS}
        value={activeTab}
        pendingValue={displayedPendingTab}
        onChange={navigateTab}
        onAddClick={() => setShowAddChoice(true)}
      />

      <Sheet open={showMonthPicker} onClose={() => setShowMonthPicker(false)} title="Select month">
        <div className="flex max-h-85 flex-col gap-1.5 overflow-y-auto">
          {monthOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setMonth(option.value)}
              className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold ${
                option.value === selectedMonth
                  ? "bg-primary/15 text-primary-light"
                  : "text-text-primary"
              }`}
            >
              <span className="flex items-center gap-2">
                <Calendar className="size-4" />
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </Sheet>

      <Sheet open={showAddChoice} onClose={() => setShowAddChoice(false)}>
        <button
          type="button"
          onClick={() => openSheet("income")}
          className="mb-2.5 flex w-full items-center gap-3.5 rounded-2xl border border-surface-border bg-surface-3 p-3.5"
        >
          <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/15">
            <ArrowUp className="size-5 text-primary-light" />
          </span>
          <span className="font-display text-base font-semibold text-text-primary">Add income</span>
        </button>
        <button
          type="button"
          onClick={() => openSheet("bill")}
          className="flex w-full items-center gap-3.5 rounded-2xl border border-surface-border bg-surface-3 p-3.5"
        >
          <span className="flex size-11 items-center justify-center rounded-2xl bg-positive/15">
            <ArrowDown className="size-5 text-positive" />
          </span>
          <span className="font-display text-base font-semibold text-text-primary">Add bill</span>
        </button>
      </Sheet>

      <AddIncomeSheet
        open={searchParams.get("sheet") === "income"}
        onClose={closeSheet}
        members={members}
        defaultMemberId={currentMemberId}
      />
      <BillSheet open={searchParams.get("sheet") === "bill"} onClose={closeSheet} />
    </div>
  );
}
