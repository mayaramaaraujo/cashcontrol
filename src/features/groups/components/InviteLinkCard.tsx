"use client";

import { useState } from "react";
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
      <div className="flex h-11 items-center gap-2.5 rounded-sm border border-surface-border bg-black/25 py-1.5 pr-1.5 pl-3.5">
        <span className="min-w-0 flex-1 truncate text-xs font-semibold text-text-tertiary">
          {inviteUrl}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className={`h-8 shrink-0 rounded-xs px-3 text-xs font-bold transition-colors ${
            copied ? "bg-positive/20 text-positive" : "bg-linear-to-br from-primary to-primary-dark text-text-primary"
          }`}
        >
          {copied ? dict.settings.copied : dict.settings.copy}
        </button>
      </div>
    </div>
  );
}
