"use client";
import { useActionState } from "react";
import { resendConfirmation } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
export function ConfirmationForm() {
  const [state, action, pending] = useActionState(resendConfirmation, {});
  return (
    <form action={action} aria-label="Voye konfimasyon ankò">
      <div className="field">
        <label htmlFor="confirmation-email">Adrès imèl</label>
        <input
          id="confirmation-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={254}
        />
      </div>
      {state.error && (
        <p role="alert" className="error">
          {state.error}
        </p>
      )}
      {state.message && <p role="status">{state.message}</p>}
      <Button variant="outline" disabled={pending}>
        {pending ? "Tanpri tann…" : "Voye imèl konfimasyon an ankò"}
      </Button>
    </form>
  );
}
