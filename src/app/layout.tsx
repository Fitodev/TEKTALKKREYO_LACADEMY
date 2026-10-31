import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "TEKTALKKREYÒL ACADEMY — Aprann an kreyòl",
    template: "%s | TEKTALKKREYÒL ACADEMY",
  },
  description:
    "Kou pratik an kreyòl ayisyen sou Google Workspace, entèlijans atifisyèl ak automatisation pou biznis.",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ht">
      <body>
        <a href="#kontni" className="skip">
          Ale nan kontni an
        </a>
        <header className="site-header">
          <div className="container header-inner">
            <Link
              href="/"
              className="brand"
              aria-label="TEKTALKKREYÒL ACADEMY — Akèy"
            >
              <span className="brand-icon">
                <BookOpen size={23} />
              </span>
              <span>
                TEKTALKKREYÒL<small>ACADEMY</small>
              </span>
            </Link>
            <nav aria-label="Navigasyon prensipal" className="nav">
              <Link href="/kou">Kou yo</Link>
              <Link href="/zouti">Zouti</Link>
              <Link href="/sou-nou">Sou nou</Link>
            </nav>
            <div className="actions">
              <Link href="/konekte">Konekte</Link>
              <Button asChild size="sm">
                <Link href="/enskri">Kreye yon kont</Link>
              </Button>
            </div>
          </div>
        </header>
        <main id="kontni">{children}</main>
        <footer className="site-footer">
          <div className="container footer-inner">
            <div>
              <strong>TEKTALKKREYÒL ACADEMY</strong>
              <p>Teknoloji pou tout moun. Aprantisaj nan lang ou.</p>
            </div>
            <nav aria-label="Enfòmasyon legal" className="footer-links">
              <Link href="/konfidansyalite">Konfidansyalite</Link>
              <Link href="/kondisyon">Kondisyon</Link>
              <Link href="/afilyasyon">Afilyasyon</Link>
              <Link href="/kontak">Kontak</Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
