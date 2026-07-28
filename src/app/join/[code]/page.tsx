import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentGroup } from "@/shared/lib/supabase/get-current-group";
import { createClient } from "@/shared/lib/supabase/server";
import { AuthShell } from "@/features/auth/components/AuthShell";
import { JoinGroupCard } from "@/features/groups/components/JoinGroupCard";
import { getLocale } from "@/shared/lib/i18n/server";
import { getDictionary } from "@/shared/lib/i18n/dictionaries";

// Mirrors shared/components/Button's primary/outline + md-size classes —
// can't reuse Button directly since it renders a <button>, and nesting a
// <button> inside this page's <Link> (an <a>) would be invalid HTML
// (interactive content inside interactive content).
const LINK_BUTTON_BASE =
  "flex h-14 w-full items-center justify-center rounded-lg px-5 font-display text-sm font-semibold";
const LINK_BUTTON_PRIMARY = `${LINK_BUTTON_BASE} bg-gradient-to-br from-primary to-primary-dark text-text-primary shadow-glow-primary`;
const LINK_BUTTON_OUTLINE = `${LINK_BUTTON_BASE} border border-surface-border bg-surface-2 text-text-primary`;

interface JoinPageProps {
  params: Promise<{ code: string }>;
}

export default async function JoinPage({ params }: JoinPageProps) {
  const { code } = await params;

  const currentGroup = await getCurrentGroup();
  if (currentGroup) {
    redirect("/home");
  }

  const dict = getDictionary(await getLocale());

  const supabase = await createClient();
  const [{ data: group }, userRes] = await Promise.all([
    supabase.rpc("get_group_by_invite_code", { p_invite_code: code }).maybeSingle(),
    supabase.auth.getUser(),
  ]);

  if (!group) {
    return (
      <AuthShell title={dict.join.notFoundTitle} subtitle={dict.join.notFoundSubtitle} termsNotice={dict.auth.termsNotice}>
        <Link href="/login" className={`${LINK_BUTTON_PRIMARY} mt-2`}>
          {dict.join.backToSignIn}
        </Link>
      </AuthShell>
    );
  }

  if (!userRes.data.user) {
    return (
      <AuthShell
        title={dict.join.joinGroupTitle(group.name)}
        subtitle={dict.join.signInSubtitle}
        termsNotice={dict.auth.termsNotice}
      >
        <div className="flex flex-col gap-3">
          <Link href={`/login?next=/join/${code}`} className={LINK_BUTTON_PRIMARY}>
            {dict.join.signIn}
          </Link>
          <Link href={`/signup?next=/join/${code}`} className={LINK_BUTTON_OUTLINE}>
            {dict.join.createAccount}
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <div
      className="flex flex-1 flex-col px-8 pb-16"
      style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 4rem)" }}
    >
      <JoinGroupCard groupName={group.name} inviteCode={code} />
    </div>
  );
}
