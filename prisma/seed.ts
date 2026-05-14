import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const yarikPassword = await bcrypt.hash("yarik123", 10);
  const ivanPassword = await bcrypt.hash("ivan123", 10);

  const yarik = await prisma.user.upsert({
    where: { username: "yarik" },
    update: {},
    create: {
      username: "yarik",
      passwordHash: yarikPassword,
      name: "Yarik",
    },
  });

  const ivan = await prisma.user.upsert({
    where: { username: "ivan" },
    update: {},
    create: {
      username: "ivan",
      passwordHash: ivanPassword,
      name: "Ivan",
    },
  });

  const shared = await prisma.tradingAccount.create({
    data: {
      name: "Shared Account",
      type: "SHARED",
      initialBalance: 10000,
      currency: "USD",
      members: {
        create: [
          { userId: yarik.id, role: "OWNER" },
          { userId: ivan.id, role: "MEMBER" },
        ],
      },
    },
  });

  console.log("Seed completato");
  console.log({ yarik, ivan, shared });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });