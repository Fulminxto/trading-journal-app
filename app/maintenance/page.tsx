import {
  ShieldAlert,
  Clock,
} from "lucide-react";

import { prisma } from "@/lib/prisma";

export default async function MaintenancePage() {
  const maintenance =
    await prisma.maintenanceMode.findFirst();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050b10] p-8 text-white">
      <div className="max-w-2xl rounded-[40px] border border-red-500/20 bg-red-500/10 p-10 text-center backdrop-blur-xl">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-red-500/20 bg-red-500/10">
          <ShieldAlert
            size={34}
            className="text-red-300"
          />
        </div>

        <p className="mt-8 text-sm uppercase tracking-[0.25em] text-red-300">
          VOLTIS Maintenance
        </p>

        <h1 className="mt-4 text-5xl font-black">
          {maintenance?.title ||
            "Maintenance Mode"}
        </h1>

        <p className="mt-6 text-sm leading-relaxed text-gray-300">
          {maintenance?.message ||
            "VOLTIS è temporaneamente in manutenzione. Riprova più tardi."}
        </p>

        <div className="mt-8 flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-gray-400">
          <Clock size={18} />
          Accesso temporaneamente limitato
        </div>
      </div>
    </div>
  );
}
