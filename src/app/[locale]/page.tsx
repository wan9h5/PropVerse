import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { isLocale, messages, locales } from "@/lib/i18n";
import { categorySeed } from "@/lib/categories";

const tiles = [
  { label: "OBJECTS / EVERYDAY THINGS", style: "tile-a" },
  { label: "ARCHITECTURE / BUILT HERITAGE", style: "tile-b" },
  { label: "CULTURE / LIVING TRADITIONS", style: "tile-c" },
  { label: "LANDSCAPES / NATURAL FORMS", style: "tile-d" },
  { label: "SPECIAL / IMAGINED WORLDS", style: "tile-e" },
  { label: "MATERIAL / FORM STUDIES", style: "tile-f" },
  { label: "VISUAL REFERENCES / 2D + 3D", style: "tile-g" }
];

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const t = messages[raw];
  return <main>
    <header className="site-header">
      <Link href={`/${raw}`} className="wordmark"><span className="wordmark-mark">p.</span><span>propverse<span className="wordmark-dot">.</span></span></Link>
      <nav className="site-nav"><Link href={`/${raw}`}>{t.home}</Link><Link href={`/${raw}/library`}>{t.library}</Link><a href="#about">{t.about}</a></nav>
      <div className="site-tools"><LanguageSwitcher locale={raw}/><Link className="header-cta" href={`/${raw}/library`}>{t.explore} <ArrowUpRight size={12}/></Link></div>
    </header>
    <section className="page-wrap">
      <div className="home-masthead">
        <div><div className="home-wordmark">Prop<span>Verse</span></div><div className="home-kicker"><span>THE VISUAL REFERENCE INDEX</span><span>VOL. 001 — STORY MATERIALS</span></div></div>
        <div className="home-statement"><span className="eyebrow">FOR AI FILMMAKERS & STORYTELLERS</span><h1>{t.tagline}</h1><p style={{color:"var(--muted)",fontSize:13,lineHeight:1.7}}>{t.intro}</p><Link className="dark-link" href={`/${raw}/library`}>{t.explore} <ArrowUpRight size={14}/></Link></div>
      </div>
      <div className="visual-board">
        <div className="board-label">A VISUAL INDEX OF STORY MATERIALS · AI-GENERATED REFERENCES</div>
        {tiles.map((tile) => <div className={`board-tile ${tile.style}`} key={tile.label}><span>{tile.label}</span></div>)}
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
