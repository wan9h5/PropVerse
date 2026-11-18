import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PropVerse — Find what you imagine",
  description: "A visual reference library for AI storytellers."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
