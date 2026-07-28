"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { logout } from "@/features/auth/api/actions";
import { useTranslation } from "@/shared/lib/i18n/context";

export function LogoutButton() {
  const { dict } = useTranslation();
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => startTransition(() => logout())}
      className="flex items-center gap-1.5 text-xs font-semibold text-text-dim disabled:opacity-50"
    >
      <LogOut className="size-3.5" />
      {dict.people.logOut}
    </button>
  );
}
