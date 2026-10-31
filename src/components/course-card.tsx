import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
export function CourseCard() {
  return (
    <article className="course-panel">
      <div className="course-cover">
        <div className="eyebrow">PREMYE PWOGRAM NOU AN</div>
        <strong>
          Pi bon zouti.
          <br />
          Pi bon fason
          <br />
          pou travay.
        </strong>
        <span>WORKSPACE + IA + AUTOMATISATION</span>
      </div>
      <div className="course-details">
        <span className="tag">An preparasyon · Pou debutan</span>
        <h3>
          Google Workspace, entèlijans atifisyèl ak automatisation pou biznis
        </h3>
        <p>
          Aprann òganize travay ou, kolabore ak ekip ou epi prepare pwòp sistèm
          biznis ou.
        </p>
        <div className="course-meta">
          <span>10 modil</span>
          <span>40 leson planifye</span>
          <span>Pwojè AutoBiz Workspace</span>
        </div>
        <Button asChild variant="outline">
          <Link href="/kou/workspace-ia-automatisation">
            Gade detay pwogram nan <ArrowRight size={16} />
          </Link>
        </Button>
      </div>
    </article>
  );
}
