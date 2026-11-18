import { NextRequest, NextResponse } from "next/server";
import { Prisma, AssetStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

function authorized(request: NextRequest) {
  const token = process.env.ADMIN_API_TOKEN;
  return Boolean(token && request.headers.get("authorization") === `Bearer ${token}`);
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  const body = await request.json();
  const data: Prisma.AssetUpdateInput = {};
  for (const key of ["slug", "subcategory", "regionCode", "featured", "sortOrder"] as const) {
    if (body[key] !== undefined) Object.assign(data, { [key]: body[key] });
  }
  if (body.status !== undefined) {
    if (!["DRAFT", "REVIEW", "PUBLISHED", "ARCHIVED"].includes(body.status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    data.status = body.status as AssetStatus;
    if (body.status === "PUBLISHED") data.publishedAt = new Date();
  }
  if (Array.isArray(body.translations)) {
    data.translations = {
      upsert: body.translations.map((item: { locale: string; name: string; aliases?: string[]; summary?: string; description?: string; visualDescription?: string; prompt?: string; searchTerms?: string[] }) => ({
        where: { assetId_locale: { assetId: id, locale: item.locale } },
        create: { locale: item.locale, name: item.name, aliases: item.aliases ?? [], summary: item.summary, description: item.description, visualDescription: item.visualDescription, prompt: item.prompt, searchTerms: item.searchTerms ?? [] },
        update: { name: item.name, aliases: item.aliases ?? [], summary: item.summary, description: item.description, visualDescription: item.visualDescription, prompt: item.prompt, searchTerms: item.searchTerms ?? [] }
      }))
    };
  }
  if (Array.isArray(body.media)) {
    data.media = {
      deleteMany: {},
      create: body.media.map((item: { mediaType: "IMAGE" | "MODEL_3D"; role?: "COVER" | "GALLERY" | "THUMBNAIL"; storageKey: string; publicUrl: string; mimeType?: string; width?: number; height?: number; previewOnly?: boolean; sortOrder?: number }) => ({
        mediaType: item.mediaType, role: item.role ?? "GALLERY", storageKey: item.storageKey, publicUrl: item.publicUrl, mimeType: item.mimeType, width: item.width, height: item.height, previewOnly: item.previewOnly ?? true, sortOrder: item.sortOrder ?? 0
      }))
    };
  }
  const asset = await prisma.asset.update({ where: { id }, data, include: { translations: true, media: true } });
  return NextResponse.json({ data: asset });
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;
  await prisma.asset.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
