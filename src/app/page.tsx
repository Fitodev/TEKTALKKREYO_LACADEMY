import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Check,
  Globe,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseCard } from "@/components/course-card";
export default function Home() {
  return (
    <>
      <section className="container hero">
        <div>
          <div className="eyebrow">
            <span className="dot" /> APRANN NAN LANG OU. AVANSE NAN RIT OU.
          </div>
          <h1>
            Aprann teknoloji pou <em>devlope biznis ou.</em>
          </h1>
          <p className="hero-copy">
            Kou pratik an kreyòl ayisyen sou Google Workspace, entèlijans
            atifisyèl, pwogramasyon ak automatisation.
          </p>
          <div className="actions">
            <Button asChild>
              <Link href="/kou">
                Gade kou yo <ArrowRight size={17} />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/sou-nou">Dekouvri akademi an</Link>
            </Button>
          </div>
          <p className="micro">
            <Check size={15} /> Yon pwogram pratik, soti nan fondasyon rive nan
            pwojè.
          </p>
        </div>
        <div className="hero-visual" aria-label="Apèsi pwogram aprantisaj la">
          <div className="grid-pattern" />
          <div className="learning-card">
            <div className="card-top">
              <span>YON NOUVO KONPETANS, CHAK JOU</span>
              <BookOpen size={18} />
            </div>
            <div className="course-art" aria-hidden="true">
              <span className="app-tile">W</span>
              <span className="app-tile">
                <Sparkles />
              </span>
              <span className="app-tile">{"{ }"}</span>
            </div>
            <span className="tag">PWOGRAM AN PREPARASYON</span>
            <h3>
              Soti nan lide.
              <br />
              Rive nan aksyon.
            </h3>
            <p>Google Workspace · IA · Automatisation</p>
            <div className="card-bottom">
              <span>10 modil nan plan an</span>
              <span>100% an kreyòl</span>
            </div>
          </div>
          <div className="floating-note">
            <Globe size={25} />
            <span>
              Gwo lide yo kòmanse
              <br />
              <strong>nan lang pa w.</strong>
            </span>
          </div>
        </div>
      </section>
      <div className="container">
        <div className="stats">
          <div className="stat">
            <strong>10</strong>
            <span>modil ki planifye</span>
          </div>
          <div className="stat">
            <strong>40</strong>
            <span>leson nan pwogram nan</span>
          </div>
          <div className="stat">
            <strong>1</strong>
            <span>pwojè final pratik</span>
          </div>
          <div className="stat">
            <strong>Kreyòl</strong>
            <span>lang aprantisaj la</span>
          </div>
        </div>
      </div>
      <section className="container section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">KONPETANS POU LAVI REYÈL</div>
            <h2>Yon chemen klè pou aprann.</h2>
            <p>Dekouvri premye pwogram akademi an.</p>
          </div>
          <Button asChild variant="ghost">
            <Link href="/kou">
              Gade pwogram nan <ArrowRight size={16} />
            </Link>
          </Button>
        </div>
        <CourseCard />
      </section>
      <section className="container section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">APRANN. PRATIKE. KONSTWI.</div>
            <h2>Konesans ou ka mete an pratik.</h2>
          </div>
        </div>
        <div className="feature-grid">
          <article className="feature">
            <Globe />
            <h3>Nan lang ou konprann</h3>
            <p>
              Eksplikasyon an kreyòl ayisyen, ak egzanp ki soti nan lavi yon ti
              biznis.
            </p>
          </article>
          <article className="feature">
            <BookOpen />
            <h3>Yon etap apre lòt</h3>
            <p>
              Yon pwogram ki konekte zouti yo, bon pratik yo ak yon pwojè
              konkrè.
            </p>
          </article>
          <article className="feature">
            <ShieldCheck />
            <h3>Sekirite depi nan kòmansman</h3>
            <p>
              Pratike ak done fiktif epi aprann pwoteje enfòmasyon kliyan yo.
            </p>
          </article>
        </div>
      </section>
    </>
  );
}
