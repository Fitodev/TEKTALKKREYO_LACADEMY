export const dynamic = "force-dynamic";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { signOut } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
export default async function Dashboard() {
  const { supabase, user } = await requireUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user.id)
    .single();
  return (
    <div className="container section">
      <div className="page-heading">
        <div className="eyebrow">ESPAS ELÈV OU</div>
        <h1>
          Byenveni{profile?.display_name ? `, ${profile.display_name}` : ""}.
        </h1>
        <p>La a ou pral jwenn kou ou yo ak pwogrè ou lè leson yo pibliye.</p>
      </div>
      <div className="dashboard-grid">
        <article className="feature">
          <h2>Kou ou yo</h2>
          <p>Premye pwogram nan toujou an preparasyon.</p>
          <Button asChild variant="outline">
            <Link href="/kou">Dekouvri pwogram nan</Link>
          </Button>
        </article>
        <article className="feature">
          <h2>Kont ou</h2>
          <p>Ou konekte avèk kont pèsonèl ou.</p>
          <Button asChild variant="outline">
            <Link href="/kont/sekirite">Sekirite kont lan</Link>
          </Button>
          <form action={signOut} style={{ marginTop: 16 }}>
            <Button variant="ghost">Dekonekte</Button>
          </form>
        </article>
      </div>
    </div>
  );
}
