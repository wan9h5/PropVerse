import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Image as ImageIcon, TextQuote } from "lucide-react";
import { CopyPrompt } from "@/components/copy-prompt";
import { ModelViewer } from "@/components/model-viewer";
import { homeCopy } from "@/lib/home-copy";
import { libraryCopy } from "@/lib/library-copy";
import { isLocale, messages } from "@/lib/i18n";
import { prisma } from "@/lib/prisma";
import styles from "../library.module.css";

export const dynamic = "force-dynamic";
export default async function AssetPage({params}: {params: Promise<{locale:string; slug:string}>}) {
  const {locale, slug} = await params;
  if (!isLocale(locale)) notFound();
  const asset = await prisma.asset.findFirst({
    where: {slug, status: "PUBLISHED"},
    include: {translations: {where: {locale}}, media: {orderBy: {sortOrder: "asc"}},
      category: {include: {translations: {where: {locale}}}}}
  });
  const tr = asset?.translations[0];
  if (!asset || !tr) notFound();
  const t = messages[locale], copy = libraryCopy[locale], path = `/${locale}/library`;
  const images = asset.media.filter(item => item.mediaType === "IMAGE");
  const cover = images.find(item => item.role === "COVER") ?? images[0];
  const model = asset.media.find(item => item.mediaType === "MODEL_3D");
  const gallery = images.filter(image => (model || image.id !== cover?.id) && image.role !== "THUMBNAIL");
  return (
    <article className={styles.detail}>
      <Link href={path} className={styles.back}><ArrowLeft size={16}/>{homeCopy[locale].library}</Link>
      <div className={styles.detailGrid}>
        <div className={styles.stage}>
          {model ? <ModelViewer src={model.publicUrl}/> : cover ? <img src={cover.publicUrl} alt={tr.name}/> :
            <div className={styles.placeholder}><ImageIcon/>{copy.pending}</div>}
        </div>
        <div className={styles.description}>
          <Link href={path + "?category=" + encodeURIComponent(asset.category.slug)} className={styles.kicker}>{[asset.category.translations[0]?.name || asset.category.slug, asset.subcategory].filter(Boolean).join(" / ")}</Link>
          <h1>{tr.name}</h1>
          {tr.summary && <p className={styles.lead}>{tr.summary}</p>}
          {tr.description && <p>{tr.description}</p>}
          {tr.visualDescription && <><h2>{copy.visual}</h2><p>{tr.visualDescription}</p></>}
          {tr.prompt && <section className={styles.prompt}>
            <h2><TextQuote size={18}/>{t.prompt}</h2><p>{tr.prompt}</p>
            <CopyPrompt text={tr.prompt} label={t.copy} copiedLabel={t.copied}/>
          </section>}
        </div>
      </div>
      {gallery.length > 0 && <section className={styles.gallery}><h2>{copy.gallery}</h2>
        <div>{gallery.map((item,i) => <img key={item.id} loading="lazy" src={item.publicUrl} alt={tr.name + " · " + (i+1)}/>)}</div>
      </section>}
    </article>
  );
}
