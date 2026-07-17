import { redirect } from "next/navigation";
import { getCurrentGroup } from "@/shared/lib/supabase/get-current-group";

export default async function RootPage() {
  const currentGroup = await getCurrentGroup();

  if (!currentGroup) {
    redirect("/setup");
  }

  redirect("/home");
}
