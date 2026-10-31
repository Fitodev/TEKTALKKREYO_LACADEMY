export const dynamic = "force-dynamic";
import { requireCapability } from "@/lib/auth";
export default async function Admin() {
  const { profile } = await requireCapability("edit");
  return (
    <div className="container section">
      <div className="eyebrow">ESPAS REDAKSYON</div>
      <h1>Byenveni, {profile?.display_name}.</h1>
      <p className="notice">
        Baz sekirite a pare pou konekte ak Supabase. Entèfas jesyon leson,
        videyo ak kesyon yo se pwochen etap devlopman an.
      </p>
    </div>
  );
}
