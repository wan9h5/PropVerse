"use client";
import { usePathname, useRouter } from "next/navigation";
import { locales } from "@/lib/i18n";
export function LanguageSwitcher({locale}:{locale:string}){
  const router=useRouter();
  const pathname=usePathname();
  return <select className="locale-select" aria-label="Language" value={locale} onChange={(event)=>{const rest=pathname.replace(/^\/(zh-CN|zh-TW|en|ko|ja|fr)(?=\/|$)/,"");router.push("/"+event.target.value+(rest||""));}}>
    {locales.map((item)=><option key={item} value={item}>{item}</option>)}
  </select>;
}
