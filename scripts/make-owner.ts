import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.update({
    where: {
      username: "yarik",
    },

    data: {
      role: "OWNER",
    },
  });

  console.log("OWNER assegnato:");
  console.log(user);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });