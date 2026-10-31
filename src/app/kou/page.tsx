import { Catalog } from "@/components/catalog";
export const metadata = { title: "Kou yo" };
export default function Courses() {
  return (
    <div className="container section">
      <div className="page-heading">
        <div className="eyebrow">KATALÒG AKADEMI AN</div>
        <h1>Chwazi pwochen konpetans ou.</h1>
        <p>
          Premye pwogram nan an preparasyon. Ou ka deja dekouvri plan 10 modil
          yo.
        </p>
      </div>
      <Catalog />
    </div>
  );
}
