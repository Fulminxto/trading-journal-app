import "./globals.css";

import type {
  Metadata,
  Viewport,
} from "next";

import { Toaster } from "sonner";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AppShell from "@/components/AppShell";
import PWARegister from "@/components/PWARegister";

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
        url: "/icons/voltis.svg",
        type: "image/svg+xml",
      },
    ],
    apple: [
      {
        url: "/icons/voltis.svg",
        type: "image/svg+xml",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#050b10",
  colorScheme: "dark",
};

export const dynamic = "force-dynamic";

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
      // Non blocchiamo l'app se l'update fallisce
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
      <html lang="it">
        <body className="bg-[#050b10] text-white">
          <PWARegister />

          <div className="flex min-h-screen items-center justify-center p-8">
            <div className="max-w-2xl rounded-[40px] border border-blue-500/20 bg-blue-500/10 p-10 text-center">
              <p className="text-sm uppercase tracking-[0.25em] text-blue-300">
                Manutenzione
              </p>

              <h1 className="mt-4 text-5xl font-black">
                VOLTIS è temporaneamente in manutenzione
              </h1>

              <p className="mt-6 text-sm leading-relaxed text-gray-300">
                L’accesso alla piattaforma è temporaneamente sospeso per
                aggiornamenti o verifiche interne.
              </p>

              <p className="mt-4 text-sm leading-relaxed text-gray-400">
                Riprova più tardi. Gli account autorizzati possono continuare ad
                accedere normalmente.
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
      <html lang="it">
        <body className="bg-[#050b10] text-white">
          <PWARegister />

          <div className="flex min-h-screen items-center justify-center p-8">
            <div className="max-w-2xl rounded-[40px] border border-yellow-500/20 bg-yellow-500/10 p-10 text-center">
              <p className="text-sm uppercase tracking-[0.25em] text-yellow-300">
                Account Frozen
              </p>

              <h1 className="mt-4 text-5xl font-black">
                Accesso temporaneamente sospeso
              </h1>

              <p className="mt-6 text-sm leading-relaxed text-gray-300">
                Il tuo accesso a VOLTIS è stato temporaneamente sospeso
                dall’amministratore.
              </p>

              <p className="mt-4 text-sm leading-relaxed text-gray-400">
                Se pensi che si tratti di un errore o hai bisogno di assistenza,
                puoi contattare il supporto.
              </p>

              <a
                href="/account-review"
                className="mt-8 inline-flex rounded-2xl bg-yellow-400 px-6 py-4 text-sm font-black uppercase tracking-[0.15em] text-black transition hover:bg-yellow-300"
              >
                Richiedi revisione account
              </a>
            </div>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="it">
      <body className="bg-[#050b10] text-white">
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
              appLanguage: currentUser.appLanguage,
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