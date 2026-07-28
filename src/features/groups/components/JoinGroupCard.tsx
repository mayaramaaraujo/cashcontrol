"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/shared/components/Button";
import { joinGroupByCode } from "@/features/groups/api/actions";
import { useTranslation } from "@/shared/lib/i18n/context";

interface JoinGroupCardProps {
  groupName: string;
  inviteCode: string;
}

export function JoinGroupCard({ groupName, inviteCode }: JoinGroupCardProps) {
  const { dict } = useTranslation();
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleJoin() {
    setIsJoining(true);
    setError(null);
    const result = await joinGroupByCode(inviteCode);
    if (result?.error) {
      setError(result.error);
      setIsJoining(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">
        {dict.join.joinGroupConfirmTitle(groupName)}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-text-subtle">{dict.join.joinDescription}</p>

      {error ? <p className="mt-3 text-xs font-medium text-danger">{error}</p> : null}

      <Button fullWidth disabled={isJoining} onClick={handleJoin} className="mt-6">
        {isJoining ? <Loader2 className="size-4 animate-spin" /> : null}
        {dict.join.joinGroup}
      </Button>
    </div>
  );
}
