"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

type Props = {
  status?: string;
};

export default function ProfileToast({
  status,
}: Props) {
  const shown = useRef(false);

  useEffect(() => {
    if (shown.current) {
      return;
    }

    if (status === "success") {
      toast.success(
        "Profilo aggiornato correttamente."
      );

      shown.current = true;
    }

    if (status === "username-taken") {
      toast.error(
        "Questo username è già in uso."
      );

      shown.current = true;
    }
  }, [status]);

  return null;
}
