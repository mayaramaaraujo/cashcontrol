"use client";

import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/Button";
import { Sheet } from "@/shared/components/Sheet";
import { deleteAccount } from "@/features/auth/api/actions";
import { useTranslation } from "@/shared/lib/i18n/context";

export function DeleteAccountButton() {
  const { dict } = useTranslation();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setIsDeleting(true);
    setError(null);
    const result = await deleteAccount();
    if (result?.error) {
      setError(result.error);
      setIsDeleting(false);
    }
  }

  return (
    <>
      <Button type="button" variant="danger" size="sm" fullWidth onClick={() => setOpen(true)}>
        <Trash2 className="size-4" />
        {dict.settings.deleteAccount}
      </Button>

      <Sheet open={open} onClose={() => setOpen(false)} title={dict.settings.deleteAccountTitle}>
        <p className="text-sm text-text-subtle">{dict.settings.deleteAccountBody}</p>
        {error ? <p className="mt-3 text-xs font-medium text-danger">{error}</p> : null}
        <Button
          variant="danger"
          fullWidth
          disabled={isDeleting}
          onClick={handleConfirm}
          className="mt-5"
        >
          {isDeleting ? <Loader2 className="size-4 animate-spin" /> : null}
          {dict.settings.confirmDelete}
        </Button>
      </Sheet>
    </>
  );
}
