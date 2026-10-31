import Link from "next/link";
import { AuthForm } from "@/components/auth-form";
import { getSupabaseConfig, getAuthSiteOrigin, safeNext } from "@/lib/config";
export const metadata = { title: "Kont ou, chemen ou." };
export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ eta?: string; next?: string }>;
}) {
  const { eta, next } = await searchParams;
  return (
    <div className="container">
      <section className="form-panel">
        <div className="eyebrow">TEKTALKKREYÒL ACADEMY</div>
        <h1>Kont ou, chemen ou.</h1>
        <p>Konekte pou jwenn espas aprantisaj ou.</p>
        {eta === "lyen" && (
          <p role="alert" className="error">
            Lyen sa a pa valab oswa li ekspire.{" "}
            <Link href="/bliye-modpas" style={{ textDecoration: "underline" }}>
              Mande yon nouvo lyen rekiperasyon
            </Link>{" "}
            oswa{" "}
            <Link href="/konfime-kont" style={{ textDecoration: "underline" }}>
              yon nouvo imèl konfimasyon
            </Link>
            .
          </p>
        )}
        {eta === "google" && (
          <p role="alert" className="error">
            Koneksyon Google la pa reyisi oswa ou anile li. Ou ka eseye ankò.
          </p>
        )}
        {eta === "dekonekte" && <p role="status">Ou dekonekte.</p>}
        <AuthForm
          mode="login"
          returnTo={safeNext(next ?? null)}
          configured={!!getSupabaseConfig()}
          googleConfigured={!!getSupabaseConfig() && !!getAuthSiteOrigin()}
        />
      </section>
    </div>
  );
}
