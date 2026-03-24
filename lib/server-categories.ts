import { prisma } from "@/lib/prisma";
import { FALLBACK_CATEGORY } from "@/lib/catalog";

export async function ensureCategory(name: string) {
  const normalized = name.trim() || FALLBACK_CATEGORY;
  return prisma.category.upsert({
    where: { name: normalized },
    update: {},
    create: { name: normalized },
  });
}

export async function ensureFallbackCategory() {
  return ensureCategory(FALLBACK_CATEGORY);
}
