import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
import { reelSchema } from "@/lib/validations";
import { generateEmbedUrl } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ensureCategory } from "@/lib/server-categories";
import { resolveFacebookThumbnail } from "@/lib/facebook-preview";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const letter = searchParams.get("letter");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    const where: Prisma.ReelWhereInput = {};
    if (category && category !== "All") where.category = category;
    if (letter && letter !== "All") {
      where.title = {
        startsWith: letter,
        mode: "insensitive",
      };
    }
    if (search) {
      const searchFilters: Prisma.ReelWhereInput[] = [
        { title: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
      ];
      const existingAnd = where.AND
        ? Array.isArray(where.AND)
          ? where.AND
          : [where.AND]
        : [];
      where.AND = [...existingAnd, { OR: searchFilters }];
    }

    const [reels, total] = await Promise.all([
      prisma.reel.findMany({
        where,
        orderBy: [{ title: "asc" }, { createdAt: "desc" }],
        skip,
        take: limit,
      }),
      prisma.reel.count({ where }),
    ]);

    return NextResponse.json({
      reels,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[REELS_GET]", error);
    return NextResponse.json({ error: "Failed to fetch reels" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = reelSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { title, url, category, contentType, thumbnail } = parsed.data;
    const embedUrl = generateEmbedUrl(url, contentType);
    await ensureCategory(category);
    const previewThumbnail = thumbnail || (await resolveFacebookThumbnail(url));

    const reel = await prisma.reel.create({
      data: {
        title,
        url,
        category,
        contentType,
        embedUrl,
        thumbnail: previewThumbnail || null,
      },
    });

    return NextResponse.json(reel, { status: 201 });
  } catch (error) {
    console.error("[REELS_POST]", error);
    return NextResponse.json({ error: "Failed to create reel" }, { status: 500 });
  }
}
