import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DEFAULT_CATEGORIES } from "@/lib/catalog";

export async function GET() {
  try {
    try {
      for (const name of DEFAULT_CATEGORIES) {
        await prisma.category.upsert({
          where: { name },
          update: {},
          create: { name },
        });
      }

      const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
      });

      return NextResponse.json({ categories });
    } catch {
      const grouped = await prisma.reel.groupBy({
        by: ["category"],
        _count: { category: true },
        orderBy: { category: "asc" },
      });

      return NextResponse.json({
        categories: grouped.map((item) => ({
          id: item.category,
          name: item.category,
          count: item._count.category,
        })),
      });
    }
  } catch (error) {
    console.error("[CATEGORIES_GET]", error);
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const name = String(body?.name || "").trim();

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("[CATEGORIES_POST]", error);
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
  }
}
