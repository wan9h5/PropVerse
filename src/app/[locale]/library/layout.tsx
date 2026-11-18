import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PublicHeader } from "@/components/public-header";
import { homeCopy } from "@/lib/home-copy";
import { isLocale } from "@/lib/i18n";
import { libraryCopy } from "@/lib/library-copy";
import home from "../home.module.css";
import styles from "./library.module.css";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;
  if (!isLocale(locale)) notFound();
  return {title: homeCopy[locale].library + " · PropVerse", description: libraryCopy[locale].intro};
}

export default async function LibraryLayout({children, params}: Props & {children: React.ReactNode}) {
  const {locale} = await params;
  if (!isLocale(locale)) notFound();
  return (
    <div className={home.home}>
      <PublicHeader locale={locale} active="library" />
      <main className={styles.wrap}>{children}</main>
      <footer className={home.footer}><Link href={`/${locale}`}>PropVerse</Link><span>{homeCopy[locale].eyebrow}</span></footer>
    </div>
  );
}
