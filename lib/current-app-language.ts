import "server-only";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  normalizeAppLanguage,
  type AppLanguage,
} from "@/lib/i18n";

export async function getCurrentAppLanguage(): Promise<AppLanguage> {
  const session = await auth();

  if (!session?.user?.id) {
    return normalizeAppLanguage(null);
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      appLanguage: true,
    },
  });

  return normalizeAppLanguage(user?.appLanguage);
}
