"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

type Props = {
  status?: string;
};

const messages: Record<
  string,
  {
    type: "success" | "error" | "info" | "warning";
    message: string;
  }
> = {
  success: {
    type: "success",
    message: "Operazione completata correttamente.",
  },
  created: {
    type: "success",
    message: "Elemento creato correttamente.",
  },
  updated: {
    type: "success",
    message: "Modifica salvata correttamente.",
  },
  deleted: {
    type: "success",
    message: "Elemento eliminato correttamente.",
  },
  archived: {
    type: "info",
    message: "Elemento archiviato correttamente.",
  },
  error: {
    type: "error",
    message: "Si è verificato un errore. Riprova.",
  },
  "username-taken": {
    type: "error",
    message: "Questo username è già in uso.",
  },
  frozen: {
    type: "warning",
    message: "Utente sospeso correttamente.",
  },
  unfrozen: {
    type: "success",
    message: "Utente riattivato correttamente.",
  },
  "password-reset": {
    type: "success",
    message: "Password aggiornata correttamente.",
  },
  "user-created": {
    type: "success",
    message: "Utente creato correttamente.",
  },
  "user-deleted": {
    type: "success",
    message: "Utente eliminato correttamente.",
  },
};

export default function GlobalToast({ status }: Props) {
  const shown = useRef(false);

  useEffect(() => {
    if (shown.current || !status) {
      return;
    }

    const current = messages[status];

    if (!current) {
      return;
    }

    if (current.type === "success") {
      toast.success(current.message);
    }

    if (current.type === "error") {
      toast.error(current.message);
    }

    if (current.type === "info") {
      toast.info(current.message);
    }

    if (current.type === "warning") {
      toast.warning(current.message);
    }

    shown.current = true;
  }, [status]);

  return null;
}
