"use client";
import { useActionState } from "react";
import Link from "next/link";
import { signInWithGoogle } from "@/app/auth/google/actions";
import { Button } from "@/components/ui/button";
export function GoogleAuthForm({
  mode,
  configured,
}: {
  mode: "login" | "signup";
  configured: boolean;
}) {
  const [state, action, pending] = useActionState(
    signInWithGoogle.bind(null, mode),
    {},
  );
  return (
    <form
      action={action}
      className="google-auth-form"
      aria-label="Koneksyon avèk Google"
    >
      <label className="check-label">
        <input type="checkbox" name="acceptTerms" required />
        <span>
          Pou kontinye avèk Google, mwen aksepte{" "}
          <Link href="/kondisyon" style={{ textDecoration: "underline" }}>
            kondisyon yo
          </Link>{" "}
          epi mwen li{" "}
          <Link href="/konfidansyalite" style={{ textDecoration: "underline" }}>
            règleman konfidansyalite a
          </Link>
          .
        </span>
      </label>
      {state.error && (
        <p className="error" role="alert">
          {state.error}
        </p>
      )}
      <Button type="submit" variant="outline" disabled={pending || !configured}>
        <svg
          aria-hidden="true"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.33 2.98-7.36ZM12 22c2.7 0 4.96-.9 6.61-2.41l-3.24-2.51c-.9.6-2.05.96-3.37.96-2.6 0-4.8-1.76-5.59-4.12H3.06v2.59A10 10 0 0 0 12 22ZM6.41 13.92a6 6 0 0 1 0-3.84V7.49H3.06a10 10 0 0 0 0 9.02l3.35-2.59ZM12 5.96c1.47 0 2.79.51 3.83 1.51l2.87-2.87A9.6 9.6 0 0 0 12 2a10 10 0 0 0-8.94 5.49l3.35 2.59C7.2 7.72 9.4 5.96 12 5.96Z" />
        </svg>
        {pending ? "Tanpri tann…" : "Kontinye avèk Google"}
      </Button>
    </form>
  );
}
