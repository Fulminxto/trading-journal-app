import { Zap } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0C1430] text-white">
      <div className="flex flex-col items-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03]">
          <Zap
            size={28}
            strokeWidth={2.2}
            className="animate-pulse text-white"
          />
        </div>

        <p className="text-xs uppercase tracking-[0.45em] text-gray-600">
          Loading Workspace
        </p>
      </div>
    </div>
  );
}
