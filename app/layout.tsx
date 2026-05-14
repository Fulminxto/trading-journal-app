import "./globals.css";

import Sidebar from "@/components/Sidebar";

export const metadata = {
  title: "Trading Journal",
  description: "Professional Trading Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it">
      <body className="bg-[#050b10] text-white">
        <div className="flex min-h-screen">
          <Sidebar />

          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}