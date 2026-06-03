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
    message: "Operation completed successfully.",
  },
  created: {
    type: "success",
    message: "Item created successfully.",
  },
  updated: {
    type: "success",
    message: "Changes saved successfully.",
  },
  deleted: {
    type: "success",
    message: "Item deleted successfully.",
  },
  archived: {
    type: "info",
    message: "Item archived successfully.",
  },
  error: {
    type: "error",
    message: "Something went wrong. Try again.",
  },
  "username-taken": {
    type: "error",
    message: "This username is already in use.",
  },
  frozen: {
    type: "warning",
    message: "User suspended successfully.",
  },
  unfrozen: {
    type: "success",
    message: "User reactivated successfully.",
  },
  "password-reset": {
    type: "success",
    message: "Password updated successfully.",
  },
  "user-created": {
    type: "success",
    message: "User created successfully.",
  },
  "user-deleted": {
    type: "success",
    message: "User deleted successfully.",
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
