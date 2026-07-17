"use client";

import { useState } from "react";
import { Home as HomeIcon, Receipt, History, Users } from "lucide-react";
import { Avatar } from "@/shared/components/Avatar";
import { Button } from "@/shared/components/Button";
import { Chip } from "@/shared/components/Chip";
import { Input } from "@/shared/components/Input";
import { SegmentedControl } from "@/shared/components/SegmentedControl";
import { Sheet } from "@/shared/components/Sheet";
import { BottomNav } from "@/shared/components/BottomNav";

type SummaryMode = "income" | "bills" | "left";
type Tab = "home" | "bills" | "history" | "people";

const NAV_ITEMS = [
  { value: "home" as Tab, label: "Home", icon: HomeIcon },
  { value: "bills" as Tab, label: "Bills", icon: Receipt },
  { value: "history" as Tab, label: "History", icon: History },
  { value: "people" as Tab, label: "People", icon: Users },
];

export default function Home() {
  const [summaryMode, setSummaryMode] = useState<SummaryMode>("income");
  const [category, setCategory] = useState("Salary");
  const [tab, setTab] = useState<Tab>("home");
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <div className="flex flex-1 flex-col items-center gap-8 px-6 py-16 pb-32">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold tracking-tight text-text-primary">
          CashControl
        </h1>
        <p className="mt-2 max-w-xs text-sm text-text-subtle">
          Shared design-system primitives, previewed here until the real screens land.
        </p>
      </div>

      <div className="flex w-full max-w-xs flex-col gap-3">
        <div className="flex items-center gap-2">
          <Avatar initials="E" colorIndex={0} />
          <Avatar initials="M" colorIndex={5} />
          <Avatar initials="S" colorIndex={3} size="lg" />
        </div>

        <Input placeholder="you@email.com" />

        <SegmentedControl
          value={summaryMode}
          onChange={setSummaryMode}
          options={[
            { value: "income", label: "Income" },
            { value: "bills", label: "Bills", activeClassName: "bg-positive text-bg-base" },
            { value: "left", label: "Left", activeClassName: "bg-violet text-text-primary" },
          ]}
        />

        <div className="flex flex-wrap gap-2">
          {["Salary", "Freelance", "Bonus"].map((c) => (
            <Chip key={c} selected={category === c} onClick={() => setCategory(c)}>
              {c}
            </Chip>
          ))}
        </div>

        <Button onClick={() => setSheetOpen(true)}>Open sheet</Button>
        <Button variant="secondary">Continue with Google</Button>
        <Button variant="danger" size="sm">
          Delete bill
        </Button>
      </div>

      <BottomNav items={NAV_ITEMS} value={tab} onChange={setTab} onAddClick={() => setSheetOpen(true)} />

      <Sheet open={sheetOpen} onClose={() => setSheetOpen(false)} title="Design system sheet">
        <p className="text-sm text-text-subtle">
          This bottom sheet closes on backdrop click, Escape, or the X button.
        </p>
      </Sheet>
    </div>
  );
}
