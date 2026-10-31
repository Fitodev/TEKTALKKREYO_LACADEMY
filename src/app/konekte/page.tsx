import { AuthForm } from "@/components/auth-form";
import { getSupabaseConfig } from "@/lib/config";
export const metadata = { title: "Kont ou, chemen ou." };
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
        <h1>Kont ou, chemen ou.</h1>
        <p>Konekte pou jwenn espas aprantisaj ou.</p>
        {eta === "lyen" && (
          <p role="alert" className="error">
            Lyen sa a pa valab oswa li ekspire. Mande yon nouvo lyen.
          </p>
        )}
        <AuthForm mode="login" configured={!!getSupabaseConfig()} />
      </section>
    </div>
  );
}
