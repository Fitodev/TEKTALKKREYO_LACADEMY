import { notFound } from "next/navigation";
import { curriculum } from "@/lib/curriculum";
export const metadata = { title: "Google Workspace, IA ak automatisation" };
export default async function Course({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (slug !== "workspace-ia-automatisation") notFound();
  return (
    <div className="container section">
      <div className="page-heading">
        <div className="eyebrow">PLAN PWOGRAM NAN · AN PREPARASYON</div>
        <h1>Google Workspace, IA ak automatisation pou biznis</h1>
        <p>
          Yon chemen ki soti nan premye kont pwofesyonèl ou rive nan pwojè
          AutoBiz Workspace.
        </p>
      </div>
      <p className="notice">
        Leson yo poko pibliye. Plan sa a prezante sijè yo; li pa bay aksè ak
        kou, egzamen oswa sètifika ki deja disponib.
      </p>
      <div className="module-list">
        {curriculum.map((m) => (
          <details className="module" key={m.position}>
            <summary>
              Modil {m.position} — {m.title}
            </summary>
            <ol>
              {m.lessons.map((l) => (
                <li key={l.slug}>
                  {l.title} <span className="tag">An preparasyon</span>
                </li>
              ))}
            </ol>
          </details>
        ))}
      </div>
      <h2>Pwojè final: AutoBiz Workspace</h2>
      <p>
        Sèvi ak yon biznis fiktif pou prepare yon fòm kòmann, òganize done nan
        Sheets, verifye yo epi prezante rezilta yo.
      </p>
    </div>
  );
}
