"use client";

import { useState } from "react";
import { toast } from "sonner";
import { BellRing, BellOff, Loader2 } from "lucide-react";
import { type AppLanguage } from "@/lib/i18n";
import { updatePushEnabled } from "@/app/settings/actions";

type Props = {
  initialEnabled: boolean;
  language: AppLanguage;
};

type PushStatus =
  | "loading"
  | "unsupported"
  | "sw-unavailable"
  | "denied"
  | "idle"
  | "active";

type PushLabels = {
  eyebrow: string;
  title: string;
  description: string;
  enableBtn: string;
  disableBtn: string;
  deniedTitle: string;
  deniedDescription: string;
  unsupportedTitle: string;
  unsupportedDescription: string;
  swUnavailableTitle: string;
  swUnavailableDescription: string;
  activeTitle: string;
  activeDescription: string;
  toastEnabled: string;
  toastDisabled: string;
  toastError: string;
  toastDenied: string;
};

const LABELS: Record<AppLanguage, PushLabels> = {
  it: {
    eyebrow: "Notifiche Push",
    title: "Notifiche push native",
    description:
      "Ricevi avvisi direttamente sul tuo dispositivo anche quando VOLTIS è in background.",
    enableBtn: "Attiva notifiche push",
    disableBtn: "Disattiva",
    deniedTitle: "Permesso negato",
    deniedDescription:
      "Hai bloccato le notifiche per VOLTIS. Per riattivarle, vai nelle impostazioni del browser (o del dispositivo) e consenti le notifiche per questo sito.",
    unsupportedTitle: "Browser non supportato",
    unsupportedDescription:
      "Le notifiche push non sono disponibili su questo browser. Su iOS installa VOLTIS come app (Aggiungi a schermata Home) con iOS 16.4+.",
    swUnavailableTitle: "Disponibili solo nell'app installata",
    swUnavailableDescription:
      "Le notifiche push funzionano solo quando VOLTIS è installata come app PWA sul dispositivo e in produzione. Non sono testabili in locale.",
    activeTitle: "Notifiche push attive",
    activeDescription:
      "Stai ricevendo notifiche push su questo dispositivo.",
    toastEnabled: "Notifiche push attivate.",
    toastDisabled: "Notifiche push disattivate.",
    toastError: "Errore durante l'operazione. Riprova.",
    toastDenied: "Permesso notifiche negato dal sistema.",
  },
  en: {
    eyebrow: "Push Notifications",
    title: "Native push notifications",
    description:
      "Receive alerts directly on your device even when VOLTIS is in the background.",
    enableBtn: "Enable push notifications",
    disableBtn: "Disable",
    deniedTitle: "Permission denied",
    deniedDescription:
      "You have blocked notifications for VOLTIS. To re-enable them, go to your browser (or device) settings and allow notifications for this site.",
    unsupportedTitle: "Browser not supported",
    unsupportedDescription:
      "Push notifications are not available on this browser. On iOS, install VOLTIS as an app (Add to Home Screen) with iOS 16.4+.",
    swUnavailableTitle: "Available only in the installed app",
    swUnavailableDescription:
      "Push notifications only work when VOLTIS is installed as a PWA on your device and running in production. They cannot be tested locally.",
    activeTitle: "Push notifications active",
    activeDescription:
      "You are receiving push notifications on this device.",
    toastEnabled: "Push notifications enabled.",
    toastDisabled: "Push notifications disabled.",
    toastError: "Something went wrong. Try again.",
    toastDenied: "Notification permission denied by the system.",
  },
  uk: {
    eyebrow: "Push-сповіщення",
    title: "Нативні push-сповіщення",
    description:
      "Отримуйте сповіщення безпосередньо на пристрій, навіть коли VOLTIS у фоновому режимі.",
    enableBtn: "Увімкнути push-сповіщення",
    disableBtn: "Вимкнути",
    deniedTitle: "Дозвіл відхилено",
    deniedDescription:
      "Ви заблокували сповіщення для VOLTIS. Щоб повторно увімкнути, перейдіть до налаштувань браузера (або пристрою) та дозвольте сповіщення для цього сайту.",
    unsupportedTitle: "Браузер не підтримується",
    unsupportedDescription:
      "Push-сповіщення недоступні в цьому браузері. На iOS встановіть VOLTIS як додаток (Додати на головний екран) з iOS 16.4+.",
    swUnavailableTitle: "Доступно лише у встановленому додатку",
    swUnavailableDescription:
      "Push-сповіщення працюють лише коли VOLTIS встановлена як PWA на пристрої та запущена у production-середовищі. Локальне тестування недоступне.",
    activeTitle: "Push-сповіщення активні",
    activeDescription:
      "Ви отримуєте push-сповіщення на цьому пристрої.",
    toastEnabled: "Push-сповіщення увімкнено.",
    toastDisabled: "Push-сповіщення вимкнено.",
    toastError: "Щось пішло не так. Спробуйте ще раз.",
    toastDenied: "Система відхилила дозвіл на сповіщення.",
  },
  ru: {
    eyebrow: "Push-уведомления",
    title: "Нативные push-уведомления",
    description:
      "Получайте уведомления прямо на устройство, даже когда VOLTIS работает в фоне.",
    enableBtn: "Включить push-уведомления",
    disableBtn: "Отключить",
    deniedTitle: "Разрешение отклонено",
    deniedDescription:
      "Вы заблокировали уведомления для VOLTIS. Чтобы снова включить, перейдите в настройки браузера (или устройства) и разрешите уведомления для этого сайта.",
    unsupportedTitle: "Браузер не поддерживается",
    unsupportedDescription:
      "Push-уведомления недоступны в этом браузере. На iOS установите VOLTIS как приложение (Добавить на главный экран) с iOS 16.4+.",
    swUnavailableTitle: "Доступно только в установленном приложении",
    swUnavailableDescription:
      "Push-уведомления работают только когда VOLTIS установлена как PWA на устройстве и запущена в production-среде. Локальное тестирование недоступно.",
    activeTitle: "Push-уведомления активны",
    activeDescription:
      "Вы получаете push-уведомления на этом устройстве.",
    toastEnabled: "Push-уведомления включены.",
    toastDisabled: "Push-уведомления отключены.",
    toastError: "Что-то пошло не так. Попробуйте снова.",
    toastDenied: "Система отклонила разрешение на уведомления.",
  },
  es: {
    eyebrow: "Notificaciones Push",
    title: "Notificaciones push nativas",
    description:
      "Recibe alertas directamente en tu dispositivo incluso cuando VOLTIS está en segundo plano.",
    enableBtn: "Activar notificaciones push",
    disableBtn: "Desactivar",
    deniedTitle: "Permiso denegado",
    deniedDescription:
      "Has bloqueado las notificaciones de VOLTIS. Para reactivarlas, ve a los ajustes del navegador (o del dispositivo) y permite las notificaciones para este sitio.",
    unsupportedTitle: "Navegador no compatible",
    unsupportedDescription:
      "Las notificaciones push no están disponibles en este navegador. En iOS, instala VOLTIS como app (Añadir a pantalla de inicio) con iOS 16.4+.",
    swUnavailableTitle: "Disponibles solo en la app instalada",
    swUnavailableDescription:
      "Las notificaciones push solo funcionan cuando VOLTIS está instalada como PWA en el dispositivo y ejecutándose en producción. No se pueden probar en local.",
    activeTitle: "Notificaciones push activas",
    activeDescription:
      "Estás recibiendo notificaciones push en este dispositivo.",
    toastEnabled: "Notificaciones push activadas.",
    toastDisabled: "Notificaciones push desactivadas.",
    toastError: "Algo salió mal. Inténtalo de nuevo.",
    toastDenied: "El sistema denegó el permiso de notificaciones.",
  },
  fr: {
    eyebrow: "Notifications Push",
    title: "Notifications push natives",
    description:
      "Recevez des alertes directement sur votre appareil même lorsque VOLTIS est en arrière-plan.",
    enableBtn: "Activer les notifications push",
    disableBtn: "Désactiver",
    deniedTitle: "Permission refusée",
    deniedDescription:
      "Vous avez bloqué les notifications pour VOLTIS. Pour les réactiver, accédez aux paramètres de votre navigateur (ou appareil) et autorisez les notifications pour ce site.",
    unsupportedTitle: "Navigateur non pris en charge",
    unsupportedDescription:
      "Les notifications push ne sont pas disponibles sur ce navigateur. Sur iOS, installez VOLTIS comme application (Ajouter à l'écran d'accueil) avec iOS 16.4+.",
    swUnavailableTitle: "Disponibles uniquement dans l'app installée",
    swUnavailableDescription:
      "Les notifications push ne fonctionnent que lorsque VOLTIS est installée comme PWA sur l'appareil et s'exécute en production. Elles ne peuvent pas être testées en local.",
    activeTitle: "Notifications push actives",
    activeDescription:
      "Vous recevez des notifications push sur cet appareil.",
    toastEnabled: "Notifications push activées.",
    toastDisabled: "Notifications push désactivées.",
    toastError: "Une erreur s'est produite. Réessayez.",
    toastDenied: "Le système a refusé la permission de notifications.",
  },
  de: {
    eyebrow: "Push-Benachrichtigungen",
    title: "Native Push-Benachrichtigungen",
    description:
      "Erhalte Benachrichtigungen direkt auf dein Gerät, auch wenn VOLTIS im Hintergrund läuft.",
    enableBtn: "Push-Benachrichtigungen aktivieren",
    disableBtn: "Deaktivieren",
    deniedTitle: "Berechtigung verweigert",
    deniedDescription:
      "Du hast Benachrichtigungen für VOLTIS blockiert. Um sie wieder zu aktivieren, gehe zu den Einstellungen deines Browsers (oder Geräts) und erlaube Benachrichtigungen für diese Seite.",
    unsupportedTitle: "Browser nicht unterstützt",
    unsupportedDescription:
      "Push-Benachrichtigungen sind in diesem Browser nicht verfügbar. Stelle auf iOS sicher, dass du VOLTIS als App installiert hast (Zum Home-Bildschirm hinzufügen) mit iOS 16.4+.",
    swUnavailableTitle: "Nur in der installierten App verfügbar",
    swUnavailableDescription:
      "Push-Benachrichtigungen funktionieren nur, wenn VOLTIS als PWA auf dem Gerät installiert ist und in der Produktionsumgebung läuft. Lokales Testen ist nicht möglich.",
    activeTitle: "Push-Benachrichtigungen aktiv",
    activeDescription:
      "Du erhältst Push-Benachrichtigungen auf diesem Gerät.",
    toastEnabled: "Push-Benachrichtigungen aktiviert.",
    toastDisabled: "Push-Benachrichtigungen deaktiviert.",
    toastError: "Etwas ist schiefgelaufen. Versuche es erneut.",
    toastDenied:
      "Das System hat die Benachrichtigungsberechtigung verweigert.",
  },
};

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const rawData = window.atob(base64);
  const output = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    output[i] = rawData.charCodeAt(i);
  }
  return output;
}

function swReadyWithTimeout(
  ms: number
): Promise<ServiceWorkerRegistration> {
  return Promise.race([
    navigator.serviceWorker.ready,
    new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error("sw_timeout")),
        ms
      )
    ),
  ]);
}

export default function PushNotificationsPanel({
  initialEnabled,
  language,
}: Props) {
  const t = LABELS[language];
  const [status, setStatus] = useState<PushStatus>(() => {
    if (typeof window === "undefined") return "loading";
    if (!("Notification" in window) || !("serviceWorker" in navigator))
      return "unsupported";
    const perm = Notification.permission;
    if (perm === "denied") return "denied";
    if (perm === "granted" && initialEnabled) return "active";
    return "idle";
  });
  const [busy, setBusy] = useState(false);

  async function handleEnable() {
    if (busy) return;
    setBusy(true);
    try {
      const permission =
        await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus("denied");
        toast.error(t.toastDenied);
        return;
      }

      // Fast-fail if no SW is registered at all
      const existingReg =
        await navigator.serviceWorker.getRegistration();
      if (!existingReg) {
        setStatus("sw-unavailable");
        return;
      }

      const vapidKey =
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidKey) throw new Error("vapid_missing");

      // 10 s timeout so the button never hangs forever
      const sw = await swReadyWithTimeout(10_000);

      const subscription = await sw.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });

      const json = subscription.toJSON();
      const keys = json.keys as {
        p256dh: string;
        auth: string;
      };

      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: json.endpoint,
          p256dh: keys.p256dh,
          auth: keys.auth,
        }),
      });

      if (!res.ok) throw new Error("subscribe_api");

      await updatePushEnabled(true);
      setStatus("active");
      toast.success(t.toastEnabled);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "";
      if (
        msg === "sw_timeout" ||
        msg === "vapid_missing"
      ) {
        setStatus("sw-unavailable");
      } else {
        toast.error(t.toastError);
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleDisable() {
    if (busy) return;
    setBusy(true);
    try {
      const sw = await swReadyWithTimeout(10_000);
      const subscription =
        await sw.pushManager.getSubscription();

      if (subscription) {
        const json = subscription.toJSON();
        await fetch("/api/push/subscribe", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint: json.endpoint }),
        });
        await subscription.unsubscribe();
      }

      await updatePushEnabled(false);
      setStatus("idle");
      toast.success(t.toastDisabled);
    } catch {
      toast.error(t.toastError);
    } finally {
      setBusy(false);
    }
  }

  if (status === "loading") return null;

  if (status === "unsupported") {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex items-start gap-3">
          <BellOff
            size={22}
            className="mt-1 flex-shrink-0 text-gray-600"
          />

          <div>
            <p className="text-sm text-gray-500">
              {t.eyebrow}
            </p>

            <h3 className="mt-1 text-lg font-bold text-gray-500">
              {t.unsupportedTitle}
            </h3>

            <p className="mt-2 text-sm text-gray-600">
              {t.unsupportedDescription}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "sw-unavailable") {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex items-start gap-3">
          <BellOff
            size={22}
            className="mt-1 flex-shrink-0 text-gray-500"
          />

          <div>
            <p className="text-sm text-gray-400">
              {t.eyebrow}
            </p>

            <h3 className="mt-1 text-lg font-bold text-gray-400">
              {t.swUnavailableTitle}
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              {t.swUnavailableDescription}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "denied") {
    return (
      <div className="rounded-3xl border border-amber-500/20 bg-amber-500/[0.04] p-6">
        <div className="flex items-start gap-3">
          <BellOff
            size={22}
            className="mt-1 flex-shrink-0 text-amber-400"
          />

          <div>
            <p className="text-sm text-amber-400">
              {t.eyebrow}
            </p>

            <h3 className="mt-1 text-lg font-bold text-amber-300">
              {t.deniedTitle}
            </h3>

            <p className="mt-2 text-sm text-gray-400">
              {t.deniedDescription}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (status === "active") {
    return (
      <div className="rounded-3xl border border-green-500/20 bg-green-500/[0.04] p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <BellRing
              size={22}
              className="mt-1 flex-shrink-0 text-green-400"
            />

            <div>
              <p className="text-sm text-green-400">
                {t.eyebrow}
              </p>

              <h3 className="mt-1 text-lg font-bold text-green-300">
                {t.activeTitle}
              </h3>

              <p className="mt-2 text-sm text-gray-400">
                {t.activeDescription}
              </p>
            </div>
          </div>

          <button
            onClick={handleDisable}
            disabled={busy}
            className="flex-shrink-0 rounded-xl border border-white/10 bg-black/30 px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-black/50 disabled:opacity-50"
          >
            {busy ? (
              <Loader2
                size={16}
                className="animate-spin"
              />
            ) : (
              t.disableBtn
            )}
          </button>
        </div>
      </div>
    );
  }

  // idle
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <BellRing
            size={22}
            className="mt-1 flex-shrink-0 text-gray-400"
          />

          <div>
            <p className="text-sm text-gray-400">
              {t.eyebrow}
            </p>

            <h3 className="mt-1 text-lg font-bold">
              {t.title}
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              {t.description}
            </p>
          </div>
        </div>

        <button
          onClick={handleEnable}
          disabled={busy}
          className="flex-shrink-0 rounded-xl bg-green-500 px-4 py-2 text-sm font-bold text-black transition hover:bg-green-400 disabled:opacity-50"
        >
          {busy ? (
            <Loader2
              size={16}
              className="animate-spin"
            />
          ) : (
            t.enableBtn
          )}
        </button>
      </div>
    </div>
  );
}
