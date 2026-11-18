import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { categorySeed } from "../src/lib/categories";

const prisma = new PrismaClient();
async function main() {
  const info = await prisma.$queryRaw<Array<{ version: string; db: string; charset: string }>>
    `SELECT VERSION() AS version, DATABASE() AS db, @@character_set_database AS charset`;
  assert.equal(info[0].db, "propverse");
  assert.equal(info[0].charset, "utf8mb4");
  const categories = await prisma.category.findMany({
    orderBy: { slug: "asc" },
    include: { translations: { orderBy: { locale: "asc" } }, assets: true }
  });
  const expectedCounts: Record<string, number> = { objects: 12, architecture: 8, culture: 5, landscapes: 4, special: 1 };
  for (const expected of categorySeed) {
    const category = categories.find((row) => row.slug === expected.slug);
    assert.ok(category, "Missing category: " + expected.slug);
    for (const locale of Object.keys(expected.names)) {
      assert.ok(category.translations.some((row) => row.locale === locale && row.name.length > 0), "Missing category locale: " + locale);
    }
    assert.ok(category.assets.length >= expectedCounts[expected.slug], "Missing assets in " + expected.slug);
  }
  const assets = await prisma.asset.findMany({ orderBy: { slug: "asc" }, include: {
    translations: { orderBy: { locale: "asc" } }
  } });
  assert.ok(assets.length >= 30);
  assert.ok(assets.filter((asset) => asset.translations.some((t) => t.locale === "zh-CN" && t.name.length > 0)).length >= 30);
  // Read all nine tables, including the tables not populated by the initial seed.
  const snapshot = {
    categories, assets,
    media: await prisma.assetMedia.findMany({ orderBy: { id: "asc" } }),
    tags: await prisma.tag.findMany({ orderBy: { id: "asc" } }),
    tagTranslations: await prisma.tagTranslation.findMany({ orderBy: { id: "asc" } }),
    assetTags: await prisma.assetTag.findMany({ orderBy: [{ assetId: "asc" }, { tagId: "asc" }] }),
    generationRecords: await prisma.generationRecord.findMany({ orderBy: { id: "asc" } })
  };
  // Relation ordering must be deterministic for the repeat-seed comparison.
  for (const category of snapshot.categories) category.assets.sort((a, b) => a.id.localeCompare(b.id));
  console.log(JSON.stringify({
    mysql: info[0],
    categories: categories.length,
    categoryTranslations: categories.reduce((sum, row) => sum + row.translations.length, 0),
    assets: assets.length,
    assetTranslations: assets.reduce((sum, row) => sum + row.translations.length, 0),
    statuses: assets.reduce<Record<string, number>>((result, row) => {
      result[row.status] = (result[row.status] ?? 0) + 1; return result;
    }, {}),
    perCategory: Object.fromEntries(categories.map((row) => [row.slug, row.assets.length])),
    fingerprint: createHash("sha256").update(JSON.stringify(snapshot)).digest("hex")
  }, null, 2));
}
main()
  .catch((error) => { console.error(error); process.exitCode = 1; })
  .finally(async () => { await prisma.$disconnect(); });
