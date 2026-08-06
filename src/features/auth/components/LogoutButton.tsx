"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/shared/components/Button";
import { logout } from "@/features/auth/api/actions";
import { useTranslation } from "@/shared/lib/i18n/context";

export function LogoutButton() {
  const { dict } = useTranslation();
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      fullWidth
      disabled={isPending}
      onClick={() => startTransition(() => logout())}
    >
      <LogOut className="size-4" />
      {dict.settings.logOut}
    </Button>
  );
}
