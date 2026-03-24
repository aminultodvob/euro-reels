const { PrismaClient } = require("@prisma/client");
const { inferCategory } = require("./reel-category");

const prisma = new PrismaClient();

async function main() {
  const reels = await prisma.reel.findMany({
    select: {
      id: true,
      title: true,
      category: true,
    },
  });

  let updated = 0;

  for (const reel of reels) {
    const nextCategory = inferCategory(reel.title);
    if (reel.category === nextCategory) {
      continue;
    }

    await prisma.reel.update({
      where: { id: reel.id },
      data: { category: nextCategory },
    });
    await prisma.category.upsert({
      where: { name: nextCategory },
      update: {},
      create: { name: nextCategory },
    });
    updated += 1;
  }

  const categories = await prisma.reel.groupBy({
    by: ["category"],
    _count: { category: true },
    orderBy: { category: "asc" },
  });

  console.log(`Normalized categories. Updated=${updated}`);
  console.log(JSON.stringify(categories, null, 2));
}

main()
  .catch((error) => {
    console.error("Normalize failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
