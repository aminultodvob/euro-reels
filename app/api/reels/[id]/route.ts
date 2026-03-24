import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateReelSchema } from "@/lib/validations";
import { generateEmbedUrl } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ensureCategory } from "@/lib/server-categories";
import { resolveFacebookThumbnail } from "@/lib/facebook-preview";

interface Params {
  params: { id: string };
}

export async function GET(_req: Request, { params }: Params) {
  try {
    const reel = await prisma.reel.findUnique({ where: { id: params.id } });
    if (!reel) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.reel.update({
      where: { id: params.id },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json(reel);
  } catch (error) {
    console.error("[REEL_GET]", error);
    return NextResponse.json({ error: "Failed to fetch reel" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = updateReelSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    if (parsed.data.category) {
      await ensureCategory(parsed.data.category);
    }

    const existing = await prisma.reel.findUnique({
      where: { id: params.id },
      select: { url: true, contentType: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const nextType = parsed.data.contentType ?? existing.contentType;
    const nextUrl = parsed.data.url ?? existing.url;
    const nextThumbnail =
      parsed.data.thumbnail === ""
        ? null
        : parsed.data.thumbnail || (parsed.data.url ? await resolveFacebookThumbnail(parsed.data.url) : undefined);
    const data: Prisma.ReelUpdateInput = {
      ...parsed.data,
      embedUrl: generateEmbedUrl(nextUrl, nextType),
      ...(nextThumbnail !== undefined ? { thumbnail: nextThumbnail } : {}),
    };

    const reel = await prisma.reel.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(reel);
  } catch (error) {
    console.error("[REEL_PUT]", error);
    return NextResponse.json({ error: "Failed to update reel" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await prisma.reel.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[REEL_DELETE]", error);
    return NextResponse.json({ error: "Failed to delete reel" }, { status: 500 });
  }
}
