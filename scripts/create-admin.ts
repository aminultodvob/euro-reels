import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@euro-reel.com";
  const password = await bcrypt.hash("admin123456", 10);
  
  const user = await prisma.user.upsert({
    where: { email },
    update: { password, role: "ADMIN" },
    create: {
      email,
      password,
      role: "ADMIN"
    }
  });

  console.log("Admin user upserted:", user.email);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
