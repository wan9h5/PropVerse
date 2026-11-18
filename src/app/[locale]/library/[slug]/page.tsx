import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyPrompt } from "@/components/copy-prompt";
import { ModelViewer } from "@/components/model-viewer";
import { isLocale, messages } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AssetPage({params}:{params:Promise<{locale:string;slug:string}>}){
  const {locale:raw,slug}=await params;
  if(!isLocale(raw)) notFound();
  const t=messages[raw];
  const asset=await prisma.asset.findFirst({
    where:{slug,status:"PUBLISHED"},
    include:{translations:{where:{locale:raw}},media:{orderBy:{sortOrder:"asc"}},category:{include:{translations:{where:{locale:raw}}}}}
  }).catch(()=>null);
  if(!asset) notFound();
  const translation=asset.translations[0];
  if(!translation) notFound();
  const cover=asset.media.find((item)=>item.role==="COVER"&&item.mediaType==="IMAGE");
  const model=asset.media.find((item)=>item.mediaType==="MODEL_3D");
  return <main>
    <header className="site-header"><Link href={`/${raw}`} className="wordmark"><span className="wordmark-mark">p.</span><span>propverse<span className="wordmark-dot">.</span></span></Link><nav className="site-nav"><Link href={`/${raw}/library`}>{t.library}</Link></nav></header>
    <div className="asset-detail">
      <div className="asset-visual">{model?<ModelViewer src={model.publicUrl}/>:cover?<img src={cover.publicUrl} alt={translation.name}/>:<span className="eyebrow">VISUAL REFERENCE PENDING</span>}</div>
      <section className="asset-copy"><span className="eyebrow">{asset.category.translations[0]?.name} / {asset.subcategory}</span><h1>{translation.name}</h1><p style={{color:"var(--muted)",lineHeight:1.8,fontSize:13}}>{translation.description}</p><h3>{t.prompt}</h3><div className="prompt-box"><p>{translation.prompt}</p><CopyPrompt text={translation.prompt??""} label={t.copy} copiedLabel={t.copied}/></div><p style={{fontSize:10,color:"var(--muted)",marginTop:18}}>AI-generated visual reference · Preview only</p></section>
    </div>
    <footer className="site-footer"><strong>propverse.</strong><span>{translation.name}</span></footer>
  </main>;
}
