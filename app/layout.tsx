import "./globals.css";

import { Toaster } from "sonner";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AppShell from "@/components/AppShell";

export const metadata = {
  title: "Trading Journal",
  description: "Professional Trading Platform",
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

  return (
    <html lang="it">
      <body className="bg-[#050b10] text-white">
        <Toaster
          position="top-right"
          richColors
          closeButton
          theme="dark"
        />

        <AppShell
          user={
            currentUser
              ? {
                  name: currentUser.name,
                  username:
                    currentUser.username,
                  role: currentUser.role,
                }
              : null
          }
        >
          <div className="flex min-h-screen flex-col">
            <main className="flex-1">
              {children}
            </main>

            <footer className="border-t border-white/10 bg-black/20 px-6 py-5">
              <div className="flex flex-col gap-2 text-center text-xs text-gray-500 lg:flex-row lg:items-center lg:justify-between lg:text-left">
                <div>
                  <p>
                    Trading Journal © 2026
                  </p>

                  <p className="mt-1 text-gray-600">
                    All rights reserved.
                  </p>
                </div>

                <div className="max-w-xl">
                  <p>
                    Private performance
                    analysis software for
                    professional traders.
                  </p>

                  <p className="mt-1 text-gray-600">
                    Unauthorized
                    duplication or
                    redistribution is
                    prohibited.
                  </p>
                </div>
              </div>
            </footer>
          </div>
        </AppShell>
      </body>
    </html>
  );
}