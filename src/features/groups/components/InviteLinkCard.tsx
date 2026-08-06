"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/shared/components/Button";
import { useTranslation } from "@/shared/lib/i18n/context";

interface InviteLinkCardProps {
  inviteUrl: string;
}

export function InviteLinkCard({ inviteUrl }: InviteLinkCardProps) {
  const { dict } = useTranslation();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="rounded-xl border border-surface-border bg-surface-1 p-4">
      <p className="mb-2.5 text-xs text-text-subtle">{dict.settings.inviteLinkLabel}</p>
      <div className="flex items-center gap-2.5 rounded-sm border border-surface-border bg-black/25 py-1.5 pr-1.5 pl-3.5">
        <span className="min-w-0 flex-1 truncate text-xs font-semibold text-text-tertiary">
          {inviteUrl}
        </span>
        <Button type="button" size="sm" onClick={handleCopy} className="shrink-0 gap-1.5">
          {copied ? <Check className="size-3.5" /> : null}
          {copied ? dict.settings.copied : dict.settings.copy}
        </Button>
      </div>
    </div>
  );
}
