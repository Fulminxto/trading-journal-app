import webpush from "web-push";
import { prisma } from "@/lib/prisma";

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT ?? "",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "",
  process.env.VAPID_PRIVATE_KEY ?? "",
);

type PushPayload = {
  title: string;
  body: string;
  url?: string;
};

export async function sendPushToUser(
  userId: string,
  payload: PushPayload
): Promise<void> {
  const subscriptions =
    await prisma.pushSubscription.findMany({
      where: { userId },
    });

  if (subscriptions.length === 0) return;

  await Promise.allSettled(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          },
          JSON.stringify({
            title: payload.title,
            body: payload.body,
            url: payload.url ?? "/notifications",
          })
        );
      } catch (err) {
        const status =
          (err as { statusCode?: number }).statusCode;
        if (status === 410 || status === 404) {
          // Subscription expired or revoked — remove it
          await prisma.pushSubscription.delete({
            where: { id: sub.id },
          });
        } else {
          console.error(
            `[push] Failed for subscription ${sub.id}:`,
            err
          );
        }
      }
    })
  );
}
