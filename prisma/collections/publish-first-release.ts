import { Prisma, PrismaClient } from "@prisma/client";
import { access } from "node:fs/promises";
import { join } from "node:path";
import { locales, type Locale } from "../../src/lib/i18n";
import collection from "./first-release.json";

const prisma = new PrismaClient();

async function main() {
  const url = new URL(process.env.DATABASE_URL ?? "");
  if (url.protocol !== "mysql:" || url.hostname !== "127.0.0.1" || url.port !== "3307" || url.pathname !== "/propverse") {
    throw new Error("This release targets the local PropVerse MySQL database at 127.0.0.1:3307.");
  }

  for (const item of collection) {
    if (item.translations.length !== locales.length ||
        locales.some((locale: Locale) => !item.translations.some(row => row.locale === locale))) {
      throw new Error("Missing release translations for " + item.slug);
    }
    await access(join(process.cwd(), "public", "collection", item.slug + ".webp"));
  }

  const results = await prisma.$transaction(async (tx) => {
    const publishedAt = new Date();
    const outcome = [];
    for (const item of collection) {
      const storageKey = "collection/" + item.slug + ".webp";
      const asset = await tx.asset.findUniqueOrThrow({
        where: { slug: item.slug },
        include: { category: true, media: true, translations: true, generation: true }
      });
      if (asset.category.slug !== item.category) throw new Error("Unexpected category for " + item.slug);
      if (asset.status === "PUBLISHED" && asset.media.some(media => media.storageKey === storageKey)) {
        outcome.push({slug: item.slug, status: "already published"});
        continue;
      }
      const edited = asset.media.length > 0 || asset.generation !== null || asset.translations.some(tr =>
        tr.locale !== "zh-CN" || tr.description || tr.summary || tr.prompt || tr.visualDescription ||
        tr.aliases !== null || tr.searchTerms !== null
      );
      if (asset.status !== "DRAFT" || edited) throw new Error("Review existing content for " + item.slug);

      const data: Prisma.AssetUpdateInput = {
        status: "PUBLISHED",
        publishedAt,
        translations: {
          upsert: item.translations.map(({locale, ...translation}) => ({
            where: { assetId_locale: { assetId: asset.id, locale } },
            update: translation,
            create: { locale, ...translation }
          }))
        },
        media: { create: {
          storageKey,
          publicUrl: "/" + storageKey,
          mimeType: "image/webp",
          mediaType: "IMAGE",
          role: "COVER",
          previewOnly: true
        }}
      };
      await tx.asset.update({
        where: {id: asset.id, status: "DRAFT", updatedAt: asset.updatedAt},
        data
      });
      outcome.push({slug: item.slug, status: "published"});
    }
    return outcome;
  }, {isolationLevel: "Serializable", timeout: 30000});
  console.table(results);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
}).finally(() => prisma.$disconnect());
