"use client";
import { useActionState } from "react";
import { updatePassword } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
export function PasswordForm() {
  const [state, action, pending] = useActionState(updatePassword, {});
  return (
    <form action={action}>
      <div className="field">
        <label htmlFor="password">Nouvo modpas</label>
        <input
          name="password"
          id="password"
          type="password"
          minLength={12}
          maxLength={128}
          required
          autoComplete="new-password"
        />
      </div>
      {state.error && (
        <p className="error" role="alert">
          {state.error}
        </p>
      )}
      {state.message && <p role="status">{state.message}</p>}
      <Button disabled={pending}>Sove modpas la</Button>
    </form>
  );
}
