import Link from "next/link";
import { Aperture, Globe2 } from "lucide-react";
import { LanguageSwitcher } from "./language-switcher";
import { homeCopy } from "@/lib/home-copy";
import type { Locale } from "@/lib/i18n";
import styles from "@/app/[locale]/home.module.css";

export function PublicHeader({ locale, active }: { locale: Locale; active: "home" | "library" }) {
  const t = homeCopy[locale];
  return (
    <header className={styles.header}>
      <Link className={styles.brand} href={`/${locale}`} aria-label={`PropVerse · ${t.home}`}>
        <Aperture aria-hidden="true" />PropVerse
      </Link>
      <nav className={styles.nav}>
        <Link href={`/${locale}`} aria-current={active === "home" ? "page" : undefined}>{t.home}</Link>
        <Link href={`/${locale}/library`} aria-current={active === "library" ? "page" : undefined}>{t.library}</Link>
      </nav>
      <div className={styles.language}><Globe2 size={16} aria-hidden="true"/><LanguageSwitcher locale={locale}/></div>
    </header>
  );
}
