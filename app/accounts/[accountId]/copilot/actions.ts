"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function sendCopilotMessage(formData: FormData) {
  const tradingAccountId = String(
    formData.get("tradingAccountId")
  );

  const content = String(formData.get("content") || "");

  if (!tradingAccountId || !content.trim()) {
    return;
  }

  await prisma.copilotMessage.create({
    data: {
      tradingAccountId,
      role: "user",
      content,
    },
  });

  await prisma.copilotMessage.create({
    data: {
      tradingAccountId,
      role: "assistant",
      content:
        "Ho ricevuto il messaggio. Nel prossimo step collegheremo questa risposta ai dati reali del tuo account.",
    },
  });

  revalidatePath(
    `/accounts/${tradingAccountId}/copilot`
  );
}