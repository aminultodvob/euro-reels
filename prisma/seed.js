const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const admins = [
    { email: "admin@euro-reel.com", password: "admin123456" },
    { email: "admin@euro.com", password: "admin1234" },
  ];

  for (const creds of admins) {
    const hashedPassword = await bcrypt.hash(creds.password, 12);
    const admin = await prisma.user.upsert({
      where: { email: creds.email },
      update: { password: hashedPassword, role: "ADMIN" },
      create: {
        email: creds.email,
        password: hashedPassword,
        role: "ADMIN",
      },
    });
    console.log(`Admin ready: ${admin.email}`);
  }

  const sampleReels = [
    {
      title: "How to make a perfect Espresso",
      url: "https://www.facebook.com/reel/123456789",
      category: "Food",
      contentType: "REEL",
      embedUrl:
        "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F123456789&show_text=false",
      thumbnail:
        "https://images.unsplash.com/photo-1510972591461-12003c20c028?auto=format&fit=crop&q=80&w=800",
      viewCount: 1540,
    },
    {
      title: "Grand Canyon Sunset Drone View",
      url: "https://www.facebook.com/reel/987654321",
      category: "Travel",
      contentType: "REEL",
      embedUrl:
        "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F987654321&show_text=false",
      thumbnail:
        "https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?auto=format&fit=crop&q=80&w=800",
      viewCount: 3200,
    },
    {
      title: "Top 5 Comedy Skits 2024",
      url: "https://www.facebook.com/reel/555666777",
      category: "Comedy",
      contentType: "REEL",
      embedUrl:
        "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Freel%2F555666777&show_text=false",
      thumbnail:
        "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=800",
      viewCount: 890,
    },
  ];

  for (const reel of sampleReels) {
    await prisma.category.upsert({
      where: { name: reel.category },
      update: {},
      create: { name: reel.category },
    });
    await prisma.reel.upsert({
      where: { url: reel.url },
      update: {
        title: reel.title,
        category: reel.category,
        embedUrl: reel.embedUrl,
        thumbnail: reel.thumbnail,
        viewCount: reel.viewCount,
      },
      create: reel,
    });
  }

  console.log("Seed data inserted successfully.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
