"use client";
import { useState } from "react";
import { Check, Copy } from "lucide-react";
export function CopyPrompt({ text, label, copiedLabel }: { text: string; label: string; copiedLabel: string }) {
  const [copied,setCopied]=useState(false);
  async function copy(){await navigator.clipboard.writeText(text);setCopied(true);window.setTimeout(()=>setCopied(false),1500);}
  return <button className="copy-button" onClick={copy}>{copied?<Check size={13}/>:<Copy size={13}/>} {copied?copiedLabel:label}</button>;
}
