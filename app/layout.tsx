"use client";

import "./globals.css";
import { useState } from "react";
import { Menu } from "lucide-react";
import Sidebar from "@/components/Sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <html lang="it">
      <body className="bg-[#050b10] text-white">
        <div className="flex min-h-screen">
          <Sidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />

          <main className="min-h-screen flex-1 overflow-x-hidden">
            {/* Topbar Mobile */}
            <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-[#050b10]/90 px-4 py-4 backdrop-blur lg:hidden">
              <button
                onClick={() => setSidebarOpen(true)}
                className="rounded-xl border border-white/10 bg-white/5 p-2"
              >
                <Menu size={22} />
              </button>

              <span className="text-sm font-semibold text-gray-300">
                Trading App
              </span>
            </div>

            <div className="p-4 sm:p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}