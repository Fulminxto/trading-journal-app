import "./globals.css";
import AppShell from "@/components/AppShell";

export const metadata = {
  title: "Trading App",
  description: "Trading Journal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body className="bg-[#050b10] text-white">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}