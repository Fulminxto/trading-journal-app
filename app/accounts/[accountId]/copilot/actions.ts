"use server";

import { prisma } from "@/lib/prisma";

export async function sendCopilotMessage({
  tradingAccountId,
  content,
}: {
  tradingAccountId: string;
  content: string;
}) {
  if (!content.trim()) {
    return;
  }

  await prisma.copilotMessage.create({
    data: {
      tradingAccountId,
      role: "user",
      content,
    },
  });

  const aiResponse =
    "VOLTIS sta analizzando il tuo account e il comportamento operativo.";

  await prisma.copilotMessage.create({
    data: {
      tradingAccountId,
      role: "assistant",
      content: aiResponse,
    },
  });
}