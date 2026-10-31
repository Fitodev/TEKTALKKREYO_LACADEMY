import { AuthForm } from "@/components/auth-form";
import { getSupabaseConfig, getAuthSiteOrigin } from "@/lib/config";
export const metadata = { title: "Premye etap la kòmanse la a." };
export default async function AuthPage({
  searchParams,
}: {
  searchParams: Promise<{ eta?: string }>;
}) {
  const { eta } = await searchParams;
  return (
    <div className="container">
      <section className="form-panel">
        <div className="eyebrow">TEKTALKKREYÒL ACADEMY</div>
        <h1>Premye etap la kòmanse la a.</h1>
        <p>Kreye yon kont gratis. Leson yo toujou an preparasyon.</p>
        {eta === "lyen" && (
          <p role="alert" className="error">
            Lyen sa a pa valab oswa li ekspire. Mande yon nouvo lyen.
          </p>
        )}
        <AuthForm
          mode="signup"
          configured={!!getSupabaseConfig()}
          googleConfigured={!!getSupabaseConfig() && !!getAuthSiteOrigin()}
        />
      </section>
    </div>
  );
}
