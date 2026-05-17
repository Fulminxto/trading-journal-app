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
      toast.success(
        "Impostazioni salvate correttamente."
      );

      shown.current = true;
    }

    shown.current = true;
  }, [status]);

  return null;
}