import webpush from "web-push";
import { getAdminClient } from "@/shared/lib/supabase/admin";
import { BILL_COLUMNS, mapBillRow, getBillDueInfo } from "@/features/bills/lib";
import { ptBR } from "@/shared/lib/i18n/dictionaries/pt-BR";

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!,
);

function reminderCopy(billName: string, status: "due-soon" | "overdue") {
  const label = status === "overdue" ? ptBR.bills.overdue : ptBR.bills.dueSoon;
  const body =
    status === "overdue"
      ? `A conta "${billName}" está atrasada.`
      : `A conta "${billName}" vence em breve.`;
  return { title: `${billName} · ${label}`, body };
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = getAdminClient();

  // Only repeating bills have an ongoing due-date cycle to remind about —
  // a non-repeating bill is a one-off expense, not a recurring obligation.
  const { data: billRows, error: billsError } = await supabase
    .from("bills")
    .select(BILL_COLUMNS)
    .eq("repeat_monthly", true);

  if (billsError) {
    return Response.json({ error: billsError.message }, { status: 500 });
  }

  const bills = (billRows ?? []).map(mapBillRow);
  let sent = 0;
  let skipped = 0;

  for (const bill of bills) {
    const dueInfo = getBillDueInfo(bill);
    if (dueInfo.status !== "due-soon" && dueInfo.status !== "overdue") continue;

    const { data: members, error: membersError } = await supabase
      .from("group_members")
      .select("user_id")
      .eq("group_id", bill.groupId)
      .eq("status", "active")
      .not("user_id", "is", null);

    if (membersError) continue;

    const cycleMonth = `${dueInfo.nextDueDate.slice(0, 7)}-01`;

    for (const member of members ?? []) {
      const userId = member.user_id;
      if (!userId) continue;

      const { error: insertError } = await supabase.from("bill_reminders_sent").insert({
        bill_id: bill.id,
        user_id: userId,
        cycle_month: cycleMonth,
        reminder_type: dueInfo.status,
      });

      // A unique-constraint violation means this reminder was already sent
      // this cycle — skip without sending again.
      if (insertError) {
        skipped++;
        continue;
      }

      const { data: subscriptions } = await supabase
        .from("push_subscriptions")
        .select("id, endpoint, p256dh, auth")
        .eq("user_id", userId);

      const { title, body } = reminderCopy(bill.name, dueInfo.status);

      for (const subscription of subscriptions ?? []) {
        try {
          await webpush.sendNotification(
            {
              endpoint: subscription.endpoint,
              keys: { p256dh: subscription.p256dh, auth: subscription.auth },
            },
            JSON.stringify({ title, body, billId: bill.id }),
          );
          sent++;
        } catch (err) {
          if (err instanceof webpush.WebPushError && (err.statusCode === 404 || err.statusCode === 410)) {
            await supabase.from("push_subscriptions").delete().eq("id", subscription.id);
          }
        }
      }
    }
  }

  return Response.json({ sent, skipped });
}
