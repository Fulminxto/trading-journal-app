import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function getSeedPassword(envName: string) {
  const value = process.env[envName]?.trim();

  if (!value) {
    throw new Error(
      `${envName} mancante. Aggiungilo nel file .env prima di eseguire il seed.`
    );
  }

  const forbiddenPasswords = new Set([
    "password",
    "password123",
    "12345678",
    "changeme",
    "change-me",
    "temporary",
  ]);

  if (
    value.length < 12 ||
    forbiddenPasswords.has(value.toLowerCase())
  ) {
    throw new Error(
      `${envName} deve contenere almeno 12 caratteri e non deve essere una password provvisoria/debole.`
    );
  }

  return value;
}

async function main() {
  const yarikPassword = getSeedPassword(
    "SEED_YARIK_PASSWORD"
  );

  const ivanPassword = getSeedPassword(
    "SEED_IVAN_PASSWORD"
  );

  const yarikPasswordHash = await bcrypt.hash(
    yarikPassword,
    12
  );

  const ivanPasswordHash = await bcrypt.hash(
    ivanPassword,
    12
  );

  const yarik = await prisma.user.upsert({
    where: {
      username: "yarik",
    },
    update: {},
    create: {
      username: "yarik",
      passwordHash: yarikPasswordHash,
      name: "Yarik",
      role: "FOUNDER",
    },
  });

  const ivan = await prisma.user.upsert({
    where: {
      username: "ivan",
    },
    update: {},
    create: {
      username: "ivan",
      passwordHash: ivanPasswordHash,
      name: "Ivan",
      role: "MEMBER",
    },
  });

  const existingSharedAccount =
    await prisma.tradingAccount.findFirst({
      where: {
        name: "Shared Account",
        type: "SHARED",
      },
    });

  const shared =
    existingSharedAccount ??
    (await prisma.tradingAccount.create({
      data: {
        name: "Shared Account",
        type: "SHARED",
        initialBalance: 10000,
        currency: "USD",
        members: {
          create: [
            {
              userId: yarik.id,
              role: "MANAGER",
            },
            {
              userId: ivan.id,
              role: "MEMBER",
            },
          ],
        },
      },
    }));

  console.log("Seed completato");
  console.log({
    users: [
      {
        id: yarik.id,
        username: yarik.username,
        role: yarik.role,
      },
      {
        id: ivan.id,
        username: ivan.username,
        role: ivan.role,
      },
    ],
    sharedAccount: {
      id: shared.id,
      name: shared.name,
      type: shared.type,
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
