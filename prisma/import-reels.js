const fs = require("fs");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const { inferCategory, inferContentTypeFromImportType } = require("./reel-category");

const prisma = new PrismaClient();

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  values.push(current);
  return values;
}

function parseCsv(content) {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length <= 1) {
    return [];
  }

  const headers = parseCsvLine(lines[0]);

  return lines.slice(1).map((line) => {
    const cols = parseCsvLine(line);
    return headers.reduce((row, header, index) => {
      row[header] = cols[index] ?? "";
      return row;
    }, {});
  });
}

function generateEmbedUrl(url) {
  return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
    url
  )}&show_text=false&appId=`;
}

async function main() {
  const csvPath = path.join(process.cwd(), "extracted_reels.csv");
  const content = fs.readFileSync(csvPath, "utf8");
  const rows = parseCsv(content);

  if (rows.length === 0) {
    throw new Error("No rows found in extracted_reels.csv");
  }

  let created = 0;
  let updated = 0;

  for (const row of rows) {
    const title = row.title?.trim();
    const url = row.link?.trim();
    const contentType = inferContentTypeFromImportType(row.type, url);

    if (!title || !url || !["REEL", "POST", "VIDEO"].includes(contentType)) {
      continue;
    }

    if (row.type === "facebook-other") {
      continue;
    }

    const data = {
      title,
      url,
      category: inferCategory(title),
      contentType,
      embedUrl: generateEmbedUrl(url, contentType),
      thumbnail: null,
    };

    await prisma.category.upsert({
      where: { name: data.category },
      update: {},
      create: { name: data.category },
    });

    const existing = await prisma.reel.findUnique({ where: { url } });

    if (existing) {
      await prisma.reel.update({
        where: { url },
        data,
      });
      updated += 1;
    } else {
      await prisma.reel.create({ data });
      created += 1;
    }
  }

  const total = await prisma.reel.count();
  console.log(`Imported Facebook content complete. Created=${created} Updated=${updated} Total=${total}`);
}

main()
  .catch((error) => {
    console.error("Import failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
