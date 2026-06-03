"use client";

import {
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
} from "lucide-react";

const toastMessages: Record<
  string,
  {
    title: string;
    description: string;
    icon: "success" | "error" | "info" | "warning";
  }
> = {
  created: {
    title: "Created successfully",
    description: "The item was created successfully.",
    icon: "success",
  },
  updated: {
    title: "Changes saved",
    description: "Your changes were applied successfully.",
    icon: "success",
  },
  deleted: {
    title: "Deleted successfully",
    description: "The item was deleted successfully.",
    icon: "success",
  },
  archived: {
    title: "Archived successfully",
    description: "The item was moved to the archive.",
    icon: "info",
  },
  error: {
    title: "Operation failed",
    description: "Something went wrong. Try again.",
    icon: "error",
  },
};

type Props = {
  status?: string;
};

export default function Toast({ status }: Props) {
  if (!status || !toastMessages[status]) {
    return null;
  }

  const toast = toastMessages[status];

  const Icon =
    toast.icon === "success"
      ? CheckCircle2
      : toast.icon === "error"
        ? XCircle
        : toast.icon === "warning"
          ? AlertTriangle
          : Info;

  return (
    <div className="fixed right-6 top-6 z-[9999] w-[360px] rounded-3xl border border-white/10 bg-[#071018]/95 p-5 text-white shadow-2xl backdrop-blur-xl">
      <div className="flex items-start gap-4">
        <div className="rounded-2xl bg-cyan-500/10 p-2 text-cyan-300">
          <Icon size={22} />
        </div>

        <div>
          <h3 className="text-sm font-black">
            {toast.title}
          </h3>

          <p className="mt-1 text-sm leading-relaxed text-gray-400">
            {toast.description}
          </p>
        </div>
      </div>
    </div>
  );
}
