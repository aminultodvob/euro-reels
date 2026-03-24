const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const categories = await prisma.reel.findMany({
    distinct: ["category"],
    select: { category: true },
  });

  for (const item of categories) {
    if (!item.category) continue;
    await prisma.category.upsert({
      where: { name: item.category },
      update: {},
      create: { name: item.category },
    });
  }

  const total = await prisma.category.count();
  console.log(`Synced categories. Total=${total}`);
}

main()
  .catch((error) => {
    console.error("Sync categories failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
