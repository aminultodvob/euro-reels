const { PrismaClient } = require("@prisma/client");
const { resolveFacebookThumbnail } = require("../lib/facebook-preview");

const prisma = new PrismaClient();

async function main() {
  const rows = await prisma.reel.findMany({
    where: {
      OR: [{ thumbnail: null }, { thumbnail: "" }],
    },
    select: {
      id: true,
      title: true,
      url: true,
    },
  });

  let updated = 0;
  let skipped = 0;

  for (const row of rows) {
    const thumbnail = await resolveFacebookThumbnail(row.url);

    if (!thumbnail) {
      skipped += 1;
      continue;
    }

    await prisma.reel.update({
      where: { id: row.id },
      data: { thumbnail },
    });

    updated += 1;
    console.log(`thumbnail: ${row.title}`);
  }

  console.log(`Backfill complete. Updated=${updated} Skipped=${skipped}`);
}

main()
  .catch((error) => {
    console.error("Thumbnail backfill failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
