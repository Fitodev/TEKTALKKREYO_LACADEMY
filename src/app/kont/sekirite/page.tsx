export const dynamic = "force-dynamic";
import { requireUser } from "@/lib/auth";
import { MFAForm } from "@/components/mfa-form";
export default async function Security() {
  const { supabase } = await requireUser();
  const { data } = await supabase.auth.mfa.listFactors();
  const factor = data?.totp.find((f) => f.status === "verified");
  return (
    <div className="container">
      <section className="form-panel">
        <h1>Pwoteje kont ou</h1>
        <p>
          Sèvi ak yon aplikasyon otantifikasyon pou ajoute yon dezyèm etap. Etap
          sa a obligatwa pou administratè yo.
        </p>
        <MFAForm verifiedFactor={factor?.id} />
      </section>
    </div>
  );
}
