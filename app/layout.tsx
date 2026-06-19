import "./globals.css";

import type {
  Metadata,
  Viewport,
} from "next";
import { Inter } from "next/font/google";

import { Toaster } from "sonner";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AppShell from "@/components/AppShell";
import PWARegister from "@/components/PWARegister";
import {
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";
import { resolveAccent } from "@/lib/accent-colors";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "VOLTIS",
  description:
    "Performance Operating System for disciplined traders.",
  applicationName: "VOLTIS",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "VOLTIS",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      {
        url: "/icons/variants/classic/icon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/icons/variants/classic/icon-256.png",
        sizes: "256x256",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/icons/variants/classic/icon-256.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#0C1430",
  colorScheme: "dark",
  viewportFit: "cover",
};

export const dynamic = "force-dynamic";

type RootLayoutLabels = {
  maintenanceEyebrow: string;
  maintenanceTitle: string;
  maintenanceDescription: string;
  maintenanceRetry: string;
  frozenEyebrow: string;
  frozenTitle: string;
  frozenDescription: string;
  frozenHelp: string;
  reviewAccount: string;
};

const rootLabels: Record<AppLanguage, RootLayoutLabels> = {
  it: {
    maintenanceEyebrow: "Manutenzione",
    maintenanceTitle: "VOLTIS è temporaneamente in manutenzione",
    maintenanceDescription:
      "L’accesso alla piattaforma è temporaneamente sospeso per aggiornamenti o verifiche interne.",
    maintenanceRetry:
      "Riprova più tardi. Gli account autorizzati possono continuare ad accedere normalmente.",
    frozenEyebrow: "Account Frozen",
    frozenTitle: "Accesso temporaneamente sospeso",
    frozenDescription:
      "Il tuo accesso a VOLTIS è stato temporaneamente sospeso dall’amministratore.",
    frozenHelp:
      "Se pensi che si tratti di un errore o hai bisogno di assistenza, puoi contattare il supporto.",
    reviewAccount: "Richiedi revisione account",
  },
  en: {
    maintenanceEyebrow: "Maintenance",
    maintenanceTitle: "VOLTIS is temporarily under maintenance",
    maintenanceDescription:
      "Access to the platform is temporarily suspended for updates or internal checks.",
    maintenanceRetry:
      "Try again later. Authorized accounts can continue accessing normally.",
    frozenEyebrow: "Account Frozen",
    frozenTitle: "Access temporarily suspended",
    frozenDescription:
      "Your access to VOLTIS has been temporarily suspended by the administrator.",
    frozenHelp:
      "If you think this is a mistake or need assistance, you can contact support.",
    reviewAccount: "Request account review",
  },
  uk: {
    maintenanceEyebrow: "Технічне обслуговування",
    maintenanceTitle: "VOLTIS тимчасово на обслуговуванні",
    maintenanceDescription:
      "Доступ до платформи тимчасово призупинено для оновлень або внутрішніх перевірок.",
    maintenanceRetry:
      "Спробуйте пізніше. Авторизовані акаунти можуть продовжувати доступ у звичайному режимі.",
    frozenEyebrow: "Account Frozen",
    frozenTitle: "Доступ тимчасово призупинено",
    frozenDescription:
      "Ваш доступ до VOLTIS тимчасово призупинено адміністратором.",
    frozenHelp:
      "Якщо ви вважаєте це помилкою або потребуєте допомоги, зверніться до support.",
    reviewAccount: "Запросити перегляд акаунта",
  },
  ru: {
    maintenanceEyebrow: "Обслуживание",
    maintenanceTitle: "VOLTIS временно на обслуживании",
    maintenanceDescription:
      "Доступ к платформе временно приостановлен для обновлений или внутренних проверок.",
    maintenanceRetry:
      "Попробуйте позже. Авторизованные аккаунты могут продолжать входить как обычно.",
    frozenEyebrow: "Account Frozen",
    frozenTitle: "Доступ временно приостановлен",
    frozenDescription:
      "Ваш доступ к VOLTIS временно приостановлен администратором.",
    frozenHelp:
      "Если вы считаете это ошибкой или нужна помощь, обратитесь в support.",
    reviewAccount: "Запросить проверку аккаунта",
  },
  es: {
    maintenanceEyebrow: "Mantenimiento",
    maintenanceTitle: "VOLTIS está temporalmente en mantenimiento",
    maintenanceDescription:
      "El acceso a la plataforma está temporalmente suspendido por actualizaciones o controles internos.",
    maintenanceRetry:
      "Inténtalo más tarde. Las cuentas autorizadas pueden seguir accediendo normalmente.",
    frozenEyebrow: "Account Frozen",
    frozenTitle: "Acceso temporalmente suspendido",
    frozenDescription:
      "Tu acceso a VOLTIS ha sido suspendido temporalmente por el administrador.",
    frozenHelp:
      "Si crees que es un error o necesitas asistencia, puedes contactar soporte.",
    reviewAccount: "Solicitar revisión de cuenta",
  },
  fr: {
    maintenanceEyebrow: "Maintenance",
    maintenanceTitle: "VOLTIS est temporairement en maintenance",
    maintenanceDescription:
      "L’accès à la plateforme est temporairement suspendu pour des mises à jour ou des vérifications internes.",
    maintenanceRetry:
      "Réessayez plus tard. Les comptes autorisés peuvent continuer à accéder normalement.",
    frozenEyebrow: "Account Frozen",
    frozenTitle: "Accès temporairement suspendu",
    frozenDescription:
      "Votre accès à VOLTIS a été temporairement suspendu par l’administrateur.",
    frozenHelp:
      "Si vous pensez qu’il s’agit d’une erreur ou avez besoin d’aide, contactez le support.",
    reviewAccount: "Demander une révision du compte",
  },
  de: {
    maintenanceEyebrow: "Wartung",
    maintenanceTitle: "VOLTIS befindet sich vorübergehend in Wartung",
    maintenanceDescription:
      "Der Zugriff auf die Plattform ist vorübergehend für Updates oder interne Prüfungen ausgesetzt.",
    maintenanceRetry:
      "Versuche es später erneut. Autorisierte Konten können weiterhin normal zugreifen.",
    frozenEyebrow: "Account Frozen",
    frozenTitle: "Zugriff vorübergehend gesperrt",
    frozenDescription:
      "Dein Zugriff auf VOLTIS wurde vorübergehend vom Administrator gesperrt.",
    frozenHelp:
      "Wenn du denkst, dass dies ein Fehler ist oder Hilfe brauchst, kontaktiere den Support.",
    reviewAccount: "Account-Review anfordern",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  const currentUser = session?.user?.id
    ? await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    })
    : null;

  const language = normalizeAppLanguage(
    currentUser?.appLanguage
  );

  const t = rootLabels[language] ?? rootLabels.en;

  const accent = resolveAccent(currentUser?.accentColor);
  const accentStyle = {
    "--color-accent": accent.accent,
    "--color-accent-bright": accent.bright,
  } as React.CSSProperties;

  if (currentUser) {
    try {
      await prisma.user.update({
        where: {
          id: currentUser.id,
        },
        data: {
          lastSeenAt: new Date(),
        },
      });
    } catch {
      // Do not block the app if this update fails.
    }
  }

  let maintenance = null;

  try {
    maintenance =
      await prisma.maintenanceMode.findFirst();
  } catch {
    maintenance = null;
  }

  const isMaintenanceBlocking =
    maintenance?.enabled &&
    maintenance?.blockLogin;

  const canBypassMaintenance =
    currentUser?.role === "FOUNDER" ||
    currentUser?.role === "ADMIN";

  const isFrozen =
    currentUser?.status === "FROZEN";

  const shouldShowMaintenance =
    isMaintenanceBlocking &&
    currentUser &&
    !canBypassMaintenance;

  if (shouldShowMaintenance) {
    return (
      <html lang={language} className={inter.variable} style={accentStyle}>
        <body className="text-white">
          <PWARegister />

          <div className="flex min-h-screen items-center justify-center p-8">
            <div className="max-w-2xl rounded-[40px] border border-blue-500/20 bg-blue-500/10 p-10 text-center">
              <p className="text-sm uppercase tracking-[0.25em] text-blue-300">
                {t.maintenanceEyebrow}
              </p>

              <h1 className="mt-4 text-5xl font-black">
                {t.maintenanceTitle}
              </h1>

              <p className="mt-6 text-sm leading-relaxed text-gray-300">
                {t.maintenanceDescription}
              </p>

              <p className="mt-4 text-sm leading-relaxed text-gray-400">
                {t.maintenanceRetry}
              </p>
            </div>
          </div>
        </body>
      </html>
    );
  }

  if (
    isFrozen &&
    currentUser?.role !== "FOUNDER"
  ) {
    return (
      <html lang={language} className={inter.variable} style={accentStyle}>
        <body className="text-white">
          <PWARegister />

          <div className="flex min-h-screen items-center justify-center p-8">
            <div className="max-w-2xl rounded-[40px] border border-yellow-500/20 bg-yellow-500/10 p-10 text-center">
              <p className="text-sm uppercase tracking-[0.25em] text-yellow-300">
                {t.frozenEyebrow}
              </p>

              <h1 className="mt-4 text-5xl font-black">
                {t.frozenTitle}
              </h1>

              <p className="mt-6 text-sm leading-relaxed text-gray-300">
                {t.frozenDescription}
              </p>

              <p className="mt-4 text-sm leading-relaxed text-gray-400">
                {t.frozenHelp}
              </p>

              <a
                href="/account-review"
                className="mt-8 inline-flex rounded-2xl bg-yellow-400 px-6 py-4 text-sm font-black uppercase tracking-[0.15em] text-black transition hover:bg-yellow-300"
              >
                {t.reviewAccount}
              </a>
            </div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang={language} className={inter.variable} style={accentStyle}>
      <body className="text-white">
        <PWARegister />

        <Toaster
          position="top-right"
          richColors
          closeButton
          theme="dark"
        />

        {!currentUser ? (
          children
        ) : (
          <AppShell
            user={{
              name: currentUser.name,
              username: currentUser.username,
              role: currentUser.role,
              appLanguage: language,
              appIconVariant: currentUser.appIconVariant ?? "classic",
            }}
          >
            <div className="flex min-h-screen flex-col">
              <main className="flex-1">
                {children}
              </main>
            </div>
          </AppShell>
        )}
      </body>
    </html>
  );
}

