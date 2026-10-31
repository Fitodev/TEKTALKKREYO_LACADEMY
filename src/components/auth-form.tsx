"use client";
import { useActionState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { credentialsSchema, emailSchema } from "@/lib/validation";
import { authenticate, type AuthState } from "@/app/auth/actions";
import { Button } from "@/components/ui/button";
const labels = {
  login: "Konekte",
  signup: "Kreye kont mwen",
  reset: "Voye lyen an",
};
export function AuthForm({
  mode,
  configured,
}: {
  mode: "login" | "signup" | "reset";
  configured: boolean;
}) {
  const [state, action, pending] = useActionState<AuthState, FormData>(
    authenticate.bind(null, mode),
    {},
  );
  const schema = z
    .object({
      email: emailSchema.shape.email,
      password: z.string().optional(),
      displayName: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (
        mode !== "reset" &&
        !credentialsSchema.shape.password.safeParse(data.password).success
      )
        ctx.addIssue({
          code: "custom",
          path: ["password"],
          message: "Modpas la dwe gen omwen 12 karaktè.",
        });
      if (
        mode === "signup" &&
        (!data.displayName || data.displayName.trim().length < 2)
      )
        ctx.addIssue({
          code: "custom",
          path: ["displayName"],
          message: "Antre non ou.",
        });
    });
  const {
    register,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema), mode: "onBlur" });
  return (
    <>
      <form action={action}>
        {mode === "signup" && (
          <div className="field">
            <label htmlFor="displayName">Non ou</label>
            <input
              id="displayName"
              autoComplete="name"
              required
              minLength={2}
              maxLength={80}
              {...register("displayName")}
            />
            {errors.displayName && (
              <p className="error">{String(errors.displayName.message)}</p>
            )}
          </div>
        )}
        <div className="field">
          <label htmlFor="email">Adrès imèl</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
            {...register("email")}
          />
          {errors.email && (
            <p className="error">{String(errors.email.message)}</p>
          )}
        </div>
        {mode !== "reset" && (
          <div className="field">
            <label htmlFor="password">Modpas</label>
            <input
              id="password"
              type="password"
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              required
              minLength={12}
              maxLength={128}
              aria-describedby="password-help"
              {...register("password")}
            />
            <small id="password-help">
              Omwen 12 karaktè. Chwazi yon modpas ou pa itilize lòt kote.
            </small>
            {errors.password && (
              <p className="error">{String(errors.password.message)}</p>
            )}
          </div>
        )}
        {mode === "signup" && (
          <label className="check-label">
            <input type="checkbox" name="acceptTerms" required />
            <span>
              Mwen aksepte{" "}
              <Link href="/kondisyon" style={{ textDecoration: "underline" }}>
                kondisyon itilizasyon yo
              </Link>{" "}
              epi mwen li{" "}
              <Link
                href="/konfidansyalite"
                style={{ textDecoration: "underline" }}
              >
                règleman konfidansyalite a
              </Link>
              .
            </span>
          </label>
        )}
        {state.error && (
          <p role="alert" className="error">
            {state.error}
          </p>
        )}
        {state.message && (
          <p role="status" className="notice">
            {state.message}
          </p>
        )}
        {!configured && (
          <p className="notice">
            Sèvis kont lan poko disponib. Ou ka dekouvri pwogram nan pandan n ap
            prepare lansman an.
          </p>
        )}
        <Button disabled={pending || !configured} type="submit">
          {pending ? "Tanpri tann…" : labels[mode]}
        </Button>
      </form>
      <div className="form-links">
        {mode !== "login" ? (
          <Link href="/konekte">Mwen deja gen yon kont</Link>
        ) : (
          <Link href="/enskri">Kreye yon kont</Link>
        )}
        <Link href={mode === "reset" ? "/kou" : "/bliye-modpas"}>
          {mode === "reset" ? "Gade kou yo" : "Bliye modpas ou?"}
        </Link>
      </div>
    </>
  );
}
