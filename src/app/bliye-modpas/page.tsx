import { AuthForm } from "@/components/auth-form";
import { getSupabaseConfig } from "@/lib/config";
export const metadata = { title: "Reprann aksè ak kont ou." };
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
        <h1>Reprann aksè ak kont ou.</h1>
        <p>Antre adrès imèl ou pou mande yon lyen rekiperasyon.</p>
        {eta === "lyen" && (
          <p role="alert" className="error">
            Lyen sa a pa valab oswa li ekspire. Mande yon nouvo lyen.
          </p>
        )}
        <AuthForm mode="reset" configured={!!getSupabaseConfig()} />
      </section>
    </div>
  );
}
