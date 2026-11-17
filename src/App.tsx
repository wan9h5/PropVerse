import { useMemo, useState } from 'react'
import { ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Bookmark, Check, ChevronDown, Copy, Grid2X2, Heart, Menu, Search, SlidersHorizontal, Sparkles, X } from 'lucide-react'
import { assets, categories, type Asset } from './data'

type Page = 'home' | 'components'
export default function App() {
  const [page, setPage] = useState<Page>('home')
  const [category, setCategory] = useState('All objects')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Asset | null>(null)
  const [saved, setSaved] = useState<number[]>([])
  const [copied, setCopied] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const filtered = useMemo(() => assets.filter(a => (category === 'All objects' || a.category === category) && (a.name + a.type + a.origin + a.era).toLowerCase().includes(query.toLowerCase())), [category, query])
  const heroTiles = [
    { asset: assets[8], className: 'tile-paper', number: '01' },
    { asset: assets[6], className: 'tile-tv', number: '02' },
    { asset: assets[0], className: 'tile-stool', number: '03' },
    { asset: assets[7], className: 'tile-phone', number: '04' },
    { asset: assets[4], className: 'tile-chair', number: '05' },
    { asset: assets[12], className: 'tile-tools', number: '06' },
    { asset: assets[13], className: 'tile-bike', number: '07' },
    { asset: assets[5], className: 'tile-table', number: '08' },
  ]
  const go = (p: Page) => { setPage(p); setSelected(null); window.scrollTo(0,0) }
  const toggleSave = (id:number) => setSaved(s => s.includes(id) ? s.filter(x=>x!==id) : [...s,id])
  const copyPrompt = async (prompt:string) => { await navigator.clipboard?.writeText(prompt); setCopied(true); window.setTimeout(()=>setCopied(false),1600) }
  const card = (a:Asset, i:number) => <article className="asset-card" key={a.id} style={{animationDelay:`${i*35}ms`}}>
    <button className="asset-image" onClick={()=>setSelected(a)} aria-label={`View ${a.name}`}><img src={a.image} alt={a.name} loading="lazy"/><span className="image-index">{String(a.id).padStart(2,'0')}</span><span className="view-chip">View object <ArrowUpRight size={13}/></span></button>
    <div className="asset-meta"><div><span className="eyebrow">{a.type} <i>·</i> {a.era}</span><h3>{a.name}</h3><p>{a.origin}</p></div><button className={`save-btn ${saved.includes(a.id)?'active':''}`} onClick={()=>toggleSave(a.id)} aria-label="Save item"><Heart size={17} fill={saved.includes(a.id)?'currentColor':'none'}/></button></div>
  </article>
  return <div className="app-shell">
    <header className="topbar topbar-art">
      <button className="brand" onClick={()=>go('home')}><span className="brand-mark">p.</span><span>propverse<span className="brand-dot">.</span></span></button>
      <nav className="main-nav"><button className={page==='home'?'nav-active':''} onClick={()=>go('home')}>Home</button><button className={page==='components'?'nav-active':''} onClick={()=>go('components')}>Components</button><a href="#about">About</a></nav>
      <div className="top-actions"><span className="edition">A VISUAL INDEX FOR STORYTELLERS</span><button className="icon-btn mobile-toggle" onClick={()=>setMobileMenu(!mobileMenu)}><Menu size={19}/></button><button className="header-cta" onClick={()=>go('components')}>Explore library <ArrowUpRight size={14}/></button><span className="header-status" aria-label="Online"/></div>
    </header>
    {mobileMenu && <div className="mobile-nav"><button onClick={()=>go('home')}>Home</button><button onClick={()=>go('components')}>Components</button></div>}
    {page==='home' ? <main className="home-page">
      <section className="hero-art">
        <div className="hero-masthead">
          <div className="hero-wordmark-wrap">
            <div className="hero-wordmark">Prop<span>Verse</span><i>®</i></div>
            <div className="hero-wordmark-caption"><span>THE OBJECT INDEX</span><span>VOL. 001 — EVERYDAY THINGS</span></div>
          </div>
          <div className="hero-statement">
            <span className="eyebrow">FOR AI FILMMAKERS & STORYTELLERS</span>
            <h1>The creative sidekick<br/>for things you can't quite <em>name.</em></h1>
            <button className="hero-discover" onClick={()=>go('components')}>DISCOVER THE COLLECTION <ArrowUpRight size={15}/></button>
          </div>
        </div>
        <div className="hero-canvas">
          <div className="canvas-index"><span className="canvas-index-dot"/> A VISUAL INDEX OF OBJECTS <span>— 001 / 128</span></div>
          {heroTiles.map(({asset, className, number})=><button key={asset.id} className={`mood-tile ${className}`} onClick={()=>setSelected(asset)} aria-label={`View ${asset.name}`}>
            <img src={asset.image} alt={asset.name}/>
            <span className="mood-tile-caption"><span>{number} / {asset.type.toUpperCase()}</span><ArrowUpRight size={13}/></span>
          </button>)}
          <form className="hero-search" onSubmit={e=>{e.preventDefault();go('components')}}>
            <span className="hero-search-label">START WITH WHAT YOU SEE</span>
            <div className="hero-search-control"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="A wooden stool, an old television, a folded letter..." aria-label="Search objects"/><button type="submit">SEARCH <ArrowUpRight size={15}/></button></div>
          </form>
          <div className="canvas-note canvas-note-left">DISCOVER BY LOOKING,<br/>NOT BY NAMING.</div>
          <div className="canvas-note canvas-note-right">OBJECTS HAVE STORIES.<br/>FIND THE ONE YOU IMAGINE. <span>✳</span></div>
        </div>
      </section>
      <footer className="footer home-footer" id="about"><span className="footer-brand">propverse.</span><span>Find what you imagine. Describe it with confidence.</span><span>© 2026 PROPVERSE</span></footer>
    </main> : <main className="library-page">
      <div className="library-heading"><div><span className="eyebrow">THE VISUAL INDEX / 001—128</span><h1>Components<span className="heading-period">.</span></h1><p>Explore objects by looking. Find the one that feels right.</p></div><div className="library-count"><strong>{filtered.length.toString().padStart(2,'0')}</strong><span>OBJECTS SHOWN</span></div></div>
      <div className="library-layout"><aside className={`sidebar ${mobileMenu?'sidebar-open':''}`}><div className="sidebar-head"><span className="eyebrow">BROWSE BY CATEGORY</span><button className="icon-btn mobile-toggle" onClick={()=>setMobileMenu(false)}><X size={17}/></button></div><div className="category-list">{categories.map(c=><button key={c.name} className={`category-btn ${category===c.name?'category-active':''}`} onClick={()=>{setCategory(c.name);setMobileMenu(false)}}><span className="category-symbol">{c.icon}</span><span>{c.name}</span><small>{c.count}</small></button>)}</div><div className="sidebar-note"><Sparkles size={15}/><p>Don't know the name?<br/><strong>That's what we're here for.</strong></p></div><div className="sidebar-bottom">A GROWING INDEX OF EVERYDAY THINGS</div></aside>
      <section className="catalog"><div className="catalog-toolbar"><div className="breadcrumbs">INDEX <span>/</span> {category.toUpperCase()}</div><div className="catalog-tools"><label className="search-box"><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search objects..."/>{query && <button onClick={()=>setQuery('')}><X size={14}/></button>}</label><button className="filter-btn"><SlidersHorizontal size={15}/><span>Filters</span><ChevronDown size={14}/></button></div></div><div className="catalog-title"><div><span className="eyebrow">COLLECTED FOR YOUR IMAGINATION</span><h2>{category==='All objects'?'All objects':category}</h2></div><span className="result-count">{filtered.length} RESULTS</span></div>{filtered.length ? <div className="asset-grid">{filtered.map(card)}</div> : <div className="empty-state"><Search size={25}/><h3>No objects found</h3><p>Try another word or browse a different category.</p><button className="text-link" onClick={()=>{setQuery('');setCategory('All objects')}}>Clear filters <ArrowRight size={15}/></button></div>}</section></div>
      <footer className="footer"><span className="footer-brand">propverse.</span><span>Find what you imagine. Describe it with confidence.</span><span>© 2026 PROPVERSE</span></footer>
    </main>}
    {selected && <div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setSelected(null)}}><section className="detail-modal"><button className="modal-close" onClick={()=>setSelected(null)}><X size={19}/></button><div className="detail-image"><img src={selected.image.replace('w=900','w=1200')} alt={selected.name}/><span className="photo-caption">PROPVERSE OBJECT INDEX / {String(selected.id).padStart(3,'0')}</span></div><div className="detail-content"><span className="eyebrow">{selected.category} / {selected.type}</span><h2>{selected.name}</h2><div className="detail-tags"><span>{selected.era}</span><span>{selected.origin}</span></div><p className="detail-description">{selected.description}</p><div className="prompt-panel"><div className="prompt-head"><span className="eyebrow">VISUAL DESCRIPTION / PROMPT</span><button onClick={()=>copyPrompt(selected.prompt)}>{copied?<Check size={14}/>:<Copy size={14}/>} {copied?'Copied':'Copy prompt'}</button></div><p>{selected.prompt}</p></div><div className="detail-actions"><button className="primary-btn" onClick={()=>copyPrompt(selected.prompt)}>Use this description <Copy size={15}/></button><button className={`save-detail ${saved.includes(selected.id)?'active':''}`} onClick={()=>toggleSave(selected.id)}><Heart size={16} fill={saved.includes(selected.id)?'currentColor':'none'}/> {saved.includes(selected.id)?'Saved':'Save object'}</button></div><div className="detail-footnote">Use the image as a visual reference alongside this description in your AI image or video tool.</div></div></section></div>}
  </div>
}