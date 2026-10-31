"use client";
import { useActionState, useState } from "react";
import { updatePassword } from "@/app/auth/actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export function PasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [state, action, pending] = useActionState(updatePassword, {});
  if (state.success)
    return (
      <div>
        <p role="status">{state.message}</p>
        <Button asChild>
          <Link href="/tablo-bod">Ale nan espas mwen</Link>
        </Button>
      </div>
    );
  return (
    <form action={action} aria-label="Chanje modpas">
      <div className="field">
        <label htmlFor="password">Nouvo modpas</label>
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          name="password"
          id="password"
          type="password"
          minLength={12}
          maxLength={128}
          required
          autoComplete="new-password"
        />
      </div>
      <div className="field">
        <label htmlFor="confirmPassword">Konfime nouvo modpas la</label>
        <input
          id="confirmPassword"
          value={confirmation}
          onChange={(event) => setConfirmation(event.target.value)}
          name="confirmPassword"
          type="password"
          required
          minLength={12}
          maxLength={128}
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
