import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { FALLBACK_CATEGORY } from "@/lib/catalog";

interface Params {
  params: { id: string };
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const category = await prisma.category.findUnique({ where: { id: params.id } });
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    await prisma.category.upsert({
      where: { name: FALLBACK_CATEGORY },
      update: {},
      create: { name: FALLBACK_CATEGORY },
    });

    await prisma.reel.updateMany({
      where: { category: category.name },
      data: { category: FALLBACK_CATEGORY },
    });

    await prisma.category.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[CATEGORIES_DELETE]", error);
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
