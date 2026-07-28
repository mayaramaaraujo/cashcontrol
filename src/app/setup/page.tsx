import { redirect } from "next/navigation";
import { getCurrentGroup } from "@/shared/lib/supabase/get-current-group";
import { GroupSetupForm } from "@/features/groups/components/GroupSetupForm";
import { LogoutButton } from "@/features/auth/components/LogoutButton";
import { DeleteAccountButton } from "@/features/auth/components/DeleteAccountButton";
import { getLocale } from "@/shared/lib/i18n/server";
import { getDictionary } from "@/shared/lib/i18n/dictionaries";

export default async function SetupPage() {
  const currentGroup = await getCurrentGroup();

  if (currentGroup) {
    redirect("/home");
  }

  const dict = getDictionary(await getLocale());

  return (
    <div
      className="min-h-screen px-8 pb-9"
      style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 5rem)" }}
    >
      <h1 className="font-display text-2xl font-bold tracking-tight text-text-primary">
        {dict.setup.title}
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-text-subtle">{dict.setup.subtitle}</p>

      <GroupSetupForm />

      <div className="mt-10 flex items-center justify-between border-t border-surface-border pt-5">
        <LogoutButton />
        <DeleteAccountButton />
      </div>
    </div>
  );
}
