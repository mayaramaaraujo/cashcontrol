"use client";

import { useEffect, useState, useTransition } from "react";
import { Switch } from "@/shared/components/Switch";
import { subscribeToPush, unsubscribeFromPush } from "@/features/notifications/lib";
import { saveSubscription, deleteSubscription } from "@/features/notifications/api/actions";
import { useTranslation } from "@/shared/lib/i18n/context";

export function NotificationToggle() {
  const { dict } = useTranslation();
  const [checked, setChecked] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;
    navigator.serviceWorker.getRegistration("/sw.js").then(async (registration) => {
      const subscription = await registration?.pushManager.getSubscription();
      setChecked(!!subscription);
    });
  }, []);

  function handleChange(next: boolean) {
    startTransition(async () => {
      if (next) {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
          setPermissionDenied(true);
          return;
        }
        setPermissionDenied(false);

        const subscription = await subscribeToPush(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
        );
        const json = subscription.toJSON();
        await saveSubscription({
          endpoint: subscription.endpoint,
          p256dh: json.keys?.p256dh ?? "",
          auth: json.keys?.auth ?? "",
        });
        setChecked(true);
      } else {
        const endpoint = await unsubscribeFromPush();
        if (endpoint) await deleteSubscription(endpoint);
        setChecked(false);
      }
    });
  }

  return (
    <div className="mt-6 flex items-center justify-between border-t border-surface-border pt-5">
      <div>
        <p className="text-sm font-semibold text-text-primary">{dict.notifications.title}</p>
        <p className="mt-0.5 text-xs text-text-subtle">{dict.notifications.description}</p>
        {permissionDenied && (
          <p className="mt-1 text-xs text-warning">{dict.notifications.permissionDenied}</p>
        )}
      </div>
      <Switch checked={checked} onCheckedChange={handleChange} />
    </div>
  );
}
