export const dynamic = "force-dynamic";
import { requireUser } from "@/lib/auth";
import { PasswordForm } from "@/components/password-form";
export default async function Password() {
  await requireUser();
  return (
    <div className="container">
      <section className="form-panel">
        <h1>Chanje modpas ou</h1>
        <PasswordForm />
      </section>
    </div>
  );
}
