import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check, Film, Image as ImageIcon, Search } from "lucide-react";
import { isLocale, messages } from "@/lib/i18n";
import { homeCopy } from "@/lib/home-copy";
import { libraryCopy } from "@/lib/library-copy";
import { prisma } from "@/lib/prisma";
import styles from "./library.module.css";

export const dynamic = "force-dynamic";
const categories = ["objects", "architecture", "culture", "landscapes", "special"] as const;
type Params = Record<string, string | string[] | undefined>;

export default async function LibraryPage({ params, searchParams }: {
  params: Promise<{locale: string}>; searchParams: Promise<Params>
}) {
  const {locale} = await params;
  if (!isLocale(locale)) notFound();
  const query = await searchParams;
  const q = typeof query.q === "string" ? query.q.trim() : "";
  const category = categories.find(slug => slug === query.category);
  const t = homeCopy[locale], copy = libraryCopy[locale], common = messages[locale];
  const path = `/${locale}/library`;
  function categoryUrl(slug?: string) {
    const params = new URLSearchParams();
    if (slug) params.set("category", slug);
    if (q) params.set("q", q);
    return params.size ? path + "?" + params.toString() : path;
  }
  const assets = await prisma.asset.findMany({
    where: {status: "PUBLISHED", translations: {some: {locale}}, ...(category && {category: {slug: category}})},
    select: {
      id: true, slug: true, category: {select: {slug: true, translations: {where: {locale}, select: {name: true}}}},
      translations: {where: {locale}, select: {name: true, summary: true, searchTerms: true}},
      media: {where: {role: "COVER", mediaType: "IMAGE"}, orderBy: {sortOrder: "asc"}, take: 1, select: {publicUrl: true}}
    },
    orderBy: [{featured: "desc"}, {sortOrder: "asc"}, {publishedAt: "desc"}]
  }).catch((error: unknown) => { console.error("Library query failed", error); return null; });
  const term = q.toLocaleLowerCase(locale);
  const matches = assets?.filter(({translations: [tr]}) =>
    !term || [tr.name, JSON.stringify(tr.searchTerms ?? [])].some(value => value.toLocaleLowerCase(locale).includes(term))
  ) ?? [];
  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <div className={styles.kicker}><Film size={16} />{t.eyebrow}</div>
          <h1>{t.library}</h1><p>{copy.intro}</p>
          <form className={styles.search} action={path} role="search" key={q}>
            <Search size={19} aria-hidden="true"/>
            <input type="search" name="q" defaultValue={q} placeholder={common.search} aria-label={common.search}/>
            {category && <input type="hidden" name="category" value={category}/>}
            <button>{copy.search}</button>
          </form>
        </div>
      </section>
      <nav className={styles.filters} aria-label={t.categories}>
        <div className={styles.heading}>
          <h2>{t.categories}</h2>
          <Link href={categoryUrl()} className={styles.all} aria-current={!category ? "true" : undefined}>{common.all}</Link>
        </div>
        <div className={styles.strip}>
          {categories.map(slug => (
            <Link className={styles.tile} href={categoryUrl(slug)} key={slug} aria-current={category === slug ? "true" : undefined}>
              <img src={`/home/${slug}.webp`} alt=""/>
              <span>{t[slug]}{category === slug ? <Check size={16}/> : <ArrowUpRight size={16}/>}</span>
            </Link>
          ))}
        </div>
      </nav>
      <section className={styles.results} aria-labelledby="results-title">
        <div className={styles.heading}>
          <h2 id="results-title">{category ? t[category] : copy.results}{assets && <small>{matches.length}</small>}</h2>
          {(q || category) && <Link href={path} className={styles.clear}>{copy.clear}</Link>}
        </div>
        {matches.length ? <div className={styles.grid}>{matches.map(asset => {
          const tr = asset.translations[0];
          const slug = categories.find(item => item === asset.category.slug);
          return <Link key={asset.id} href={path + "/" + asset.slug} className={styles.asset}>
            <div className={styles.thumb}>{asset.media[0] ? <img src={asset.media[0].publicUrl} alt="" loading="lazy"/> : <ImageIcon size={32}/>}</div>
            <div className={styles.assetInfo}>
              <small>{slug ? t[slug] : asset.category.translations[0]?.name}</small>
              <h3>{tr.name}</h3>{tr.summary && <p>{tr.summary}</p>}
            </div>
          </Link>;
        })}</div> : <div className={styles.empty}>
          {q ? <Search aria-hidden="true"/> : <Film aria-hidden="true"/>}
          <p>{!assets ? copy.unavailable : q || category ? common.noResults : copy.waiting}</p>
        </div>}
      </section>
    </>
  );
}
