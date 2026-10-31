import { ConfirmationForm } from "@/components/confirmation-form";
import Link from "next/link";
export const metadata = { title: "Konfime kont ou" };
export default function ConfirmationPage() {
  return (
    <div className="container">
      <section className="form-panel">
        <h1>Konfime adrès imèl ou</h1>
        <p>
          Si ou poko resevwa imèl la, mande yon nouvo lyen. Louvri li nan menm
          navigatè ou te itilize pou kreye kont lan.
        </p>
        <ConfirmationForm />
        <div className="form-links">
          <Link href="/konekte">Retounen konekte</Link>
          <Link href="/bliye-modpas">Bliye modpas ou?</Link>
        </div>
      </section>
    </div>
  );
}
