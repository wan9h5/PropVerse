import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowDown, ArrowRight, ArrowUpRight, Focus } from "lucide-react";
import { PublicHeader } from "@/components/public-header";
import { homeCopy } from "@/lib/home-copy";
import { isLocale } from "@/lib/i18n";
import styles from "./home.module.css";

const categories = ["objects", "architecture", "culture", "landscapes", "special"] as const;
type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return { title: `PropVerse — ${homeCopy[locale].eyebrow}`, description: homeCopy[locale].intro };
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = homeCopy[locale];
  const library = `/${locale}/library`;
  return (
    <main className={styles.home}>
      <PublicHeader locale={locale} active="home" />
      <section className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.heroText}>
          <p className={styles.eyebrow}>{t.eyebrow}</p>
          <h1 id="hero-title">{t.lead}<span>{t.accent}</span></h1>
          <p className={styles.intro}>{t.intro}</p>
          <div className={styles.actions}>
            <Link href={library} className={styles.primary}>{t.explore}<ArrowUpRight size={18}/></Link>
            <a href="#categories" className={styles.secondary}>{t.browse}<ArrowDown size={16}/></a>
          </div>
        </div>
        <div className={styles.caption}><Focus size={20} aria-hidden="true"/><div><small>{t.scene}</small><strong>{t.sceneTitle}</strong></div></div>
      </section>
      <section id="categories" className={styles.collection} aria-labelledby="category-title">
        <div className={styles.sectionHead}><h2 id="category-title">{t.categories}</h2><Link href={library}>{t.all}<ArrowRight size={16}/></Link></div>
        <div className={styles.cards}>
          {categories.map(slug => (
            <Link href={`${library}?category=${slug}`} key={slug} className={styles.card}>
              <img src={`/home/${slug}.webp`} alt="" width="428" height="724" />
              <span className={styles.cardTitle}>{t[slug]}<ArrowUpRight size={17}/></span>
            </Link>
          ))}
        </div>
      </section>
      <footer className={styles.footer}><span>PropVerse</span><span>{t.eyebrow}</span></footer>
    </main>
  );
}
