"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

type Props = {
  status?: string;
};

export default function SettingsToast({
  status,
}: Props) {
  const shown = useRef(false);

  useEffect(() => {
    if (shown.current) {
      return;
    }

    if (status === "success") {
      toast.success("Settings saved successfully.");
    }

    shown.current = true;
  }, [status]);

  return null;
}
