import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { isLocale, messages, locales } from "@/lib/i18n";
import { categorySeed } from "@/lib/categories";

const tiles = [
  { label: "A wooden stool", image: "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=700&q=80", style: "tile-a" },
  { label: "An old television", image: "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?auto=format&fit=crop&w=700&q=80", style: "tile-b" },
  { label: "A handwritten letter", image: "https://images.unsplash.com/photo-1455390582262-044c-dea277a?auto=format&fit=crop&w=700&q=80", style: "tile-c" },
  { label: "A traditional chair", image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=700&q=80", style: "tile-d" },
  { label: "A vintage telephone", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=700&q=80", style: "tile-e" },
  { label: "A wooden toolbox", image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=700&q=80", style: "tile-f" },
  { label: "A side table", image: "https://images.unsplash.com/photo-1499933374294-4584851497cc?auto=format&fit=crop&w=700&q=80", style: "tile-g" }
];

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const t = messages[raw];
  return <main>
    <header className="site-header">
      <Link href={`/${raw}`} className="wordmark"><span className="wordmark-mark">p.</span><span>propverse<span className="wordmark-dot">.</span></span></Link>
      <nav className="site-nav"><Link href={`/${raw}`}>{t.home}</Link><Link href={`/${raw}/library`}>{t.library}</Link><a href="#about">{t.about}</a></nav>
      <div className="site-tools"><span className="eyebrow">{raw}</span><Link className="header-cta" href={`/${raw}/library`}>{t.explore} <ArrowUpRight size={12}/></Link></div>
    </header>
    <section className="page-wrap">
      <div className="home-masthead">
        <div><div className="home-wordmark">Prop<span>Verse</span></div><div className="home-kicker"><span>THE VISUAL REFERENCE INDEX</span><span>VOL. 001 — STORY MATERIALS</span></div></div>
        <div className="home-statement"><span className="eyebrow">FOR AI FILMMAKERS & STORYTELLERS</span><h1>{t.tagline}</h1><p style={{color:"var(--muted)",fontSize:13,lineHeight:1.7}}>{t.intro}</p><Link className="dark-link" href={`/${raw}/library`}>{t.explore} <ArrowUpRight size={14}/></Link></div>
      </div>
      <div className="visual-board">
        <div className="board-label">A VISUAL INDEX OF STORY MATERIALS · 2D + 3D</div>
        {tiles.map((tile) => <div className={`board-tile ${tile.style}`} key={tile.label}><img src={tile.image} alt={tile.label}/><span>{tile.label}</span></div>)}
        <div className="board-foot"><span>DISCOVER BY LOOKING, NOT BY NAMING.</span><span>OBJECTS HAVE STORIES.</span></div>
      </div>
      <section className="section">
        <div className="section-heading"><div><span className="eyebrow">BROWSE THE COLLECTION</span><h2>{t.library}</h2></div><Link className="dark-link" href={`/${raw}/library`}>{t.explore} <ArrowUpRight size={14}/></Link></div>
        <div className="category-grid">{categorySeed.map((category,index)=><Link className="category-card" href={`/${raw}/library?category=${category.slug}`} key={category.slug}><small>PROPVERSE INDEX / {String(index+1).padStart(2,"0")}</small><strong>{category.names[raw]}</strong><span style={{fontSize:11,color:"var(--muted)"}}>Explore <ArrowUpRight size={13}/></span></Link>)}</div>
      </section>
    </section>
    <footer className="site-footer" id="about"><strong>propverse.</strong><span>Find what you imagine. Describe it with confidence.</span><span>© 2026 PROPVERSE</span></footer>
  </main>;
}
