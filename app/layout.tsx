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
                  username: currentUser.username,
                  role: currentUser.role,
                }
              : null
          }
        >
          {children}
        </AppShell>
      </body>
    </html>
  );
}