import Link from "next/link";
import { notFound } from "next/navigation";
import { Search } from "lucide-react";
import { categorySeed } from "@/lib/categories";
import { isLocale, messages } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function LibraryPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ category?: string; q?: string }> }) {
  const { locale: raw } = await params;
  const query = await searchParams;
  if (!isLocale(raw)) notFound();
  const t = messages[raw];
  const category = categorySeed.find((item) => item.slug === query.category);
  const assets = await prisma.asset.findMany({
    where: { status: "PUBLISHED", ...(category ? { category: { slug: category.slug } } : {}) },
    include: { translations: { where: { locale: raw } }, media: { where: { role: "COVER" }, take: 1 }, category: true },
    orderBy: [{ featured: "desc" }, { sortOrder: "asc" }, { publishedAt: "desc" }],
    take: 60
  }).catch(() => []);
  const filtered = query.q ? assets.filter((asset) => {
    const translation = asset.translations[0];
    return translation?.name.toLowerCase().includes(query.q!.toLowerCase()) || JSON.stringify(translation?.searchTerms ?? []).toLowerCase().includes(query.q!.toLowerCase());
  }) : assets;
  return <main>
    <header className="site-header"><Link href={`/${raw}`} className="wordmark"><span className="wordmark-mark">p.</span><span>propverse<span className="wordmark-dot">.</span></span></Link><nav className="site-nav"><Link href={`/${raw}`}>{t.home}</Link><Link href={`/${raw}/library`}>{t.library}</Link></nav><div className="site-tools"><span className="eyebrow">{raw}</span></div></header>
    <div className="library-shell">
      <div className="library-heading"><div><span className="eyebrow">THE VISUAL REFERENCE INDEX</span><h1>{t.library}</h1><p>{t.intro}</p></div><span className="library-count">{filtered.length} ASSETS</span></div>
      <div className="library-layout">
        <aside className="library-sidebar"><div className="sidebar-label">CATEGORIES / 分类</div><div className="category-list"><Link className={!query.category?"category-item active":"category-item"} href={`/${raw}/library`}>{t.all}</Link>{categorySeed.map((item)=><Link className={query.category===item.slug?"category-item active":"category-item"} href={`/${raw}/library?category=${item.slug}`} key={item.slug}>{item.names[raw]}</Link>)}</div></aside>
        <section className="catalog"><form className="catalog-toolbar"><label className="search-field"><Search size={15}/><input name="q" defaultValue={query.q} placeholder={t.search}/></label><input type="hidden" name="category" value={query.category ?? ""}/><button className="copy-button" type="submit">SEARCH</button></form>
          {filtered.length ? <div className="asset-grid">{filtered.map((asset) => { const translation=asset.translations[0]; const cover=asset.media[0]; return <Link className="asset-card" href={`/${raw}/library/${asset.slug}`} key={asset.id}><div className="asset-thumb">{cover && <img src={cover.publicUrl} alt={translation?.name ?? asset.slug}/>}</div><div className="asset-info"><small>{categorySeed.find(c=>c.slug===asset.category.slug)?.names[raw] ?? asset.category.slug}</small><h3>{translation?.name ?? asset.slug}</h3><small>{translation?.summary}</small></div></Link>; })}</div> : <div style={{padding:"100px 20px",textAlign:"center",color:"var(--muted)"}}>{t.noResults}</div>}
        </section>
      </div>
    </div>
    <footer className="site-footer"><strong>propverse.</strong><span>Find what you imagine.</span></footer>
  </main>;
}
