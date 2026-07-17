import { redirect } from "next/navigation";
import { getCurrentGroup } from "@/shared/lib/supabase/get-current-group";
import { GroupSetupForm } from "@/features/groups/components/GroupSetupForm";
import { LogoutButton } from "@/features/auth/components/LogoutButton";
import { DeleteAccountButton } from "@/features/auth/components/DeleteAccountButton";

export default async function SetupPage() {
  const currentGroup = await getCurrentGroup();

  if (currentGroup) {
    redirect("/home");
  }

  return (
    <div className="min-h-screen px-8 pt-20 pb-9">
      <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">
        Create your group
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-text-subtle">
        Name it, then invite whoever shares money with you.
      </p>

      <GroupSetupForm />

      <div className="mt-10 flex items-center justify-between border-t border-surface-border pt-5">
        <LogoutButton />
        <DeleteAccountButton />
      </div>
    </div>
  );
}
