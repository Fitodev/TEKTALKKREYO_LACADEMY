"use client";
import { useActionState, useState, useTransition } from "react";
import {
  enrollMfa,
  verifyMfa,
  type MFAState,
} from "@/app/kont/sekirite/actions";
import { Button } from "@/components/ui/button";
export function MFAForm({ verifiedFactor }: { verifiedFactor?: string }) {
  const [enrollment, setEnrollment] = useState<MFAState>({});
  const [enrolling, startTransition] = useTransition();
  const [state, action, pending] = useActionState(verifyMfa, {});
  const factor = verifiedFactor ?? enrollment.factorId;
  return (
    <>
      {!factor && (
        <Button
          disabled={enrolling}
          onClick={() =>
            startTransition(async () => setEnrollment(await enrollMfa()))
          }
        >
          Ajoute yon aplikasyon otantifikasyon
        </Button>
      )}
      {enrollment.error && (
        <p className="error" role="alert">
          {enrollment.error}
        </p>
      )}
      {enrollment.message && <p role="status">{enrollment.message}</p>}
      {enrollment.qr && (
        <div>
          <p>Eskane kòd sa a ak aplikasyon otantifikasyon ou. Pa pataje li.</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={enrollment.qr}
            alt="Kòd QR pou konekte aplikasyon otantifikasyon ou"
            width={220}
            height={220}
          />
        </div>
      )}
      {factor && (
        <form action={action}>
          <input type="hidden" name="factorId" value={factor} />
          <div className="field">
            <label htmlFor="code">Kòd verifikasyon</label>
            <input
              id="code"
              name="code"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              required
              autoComplete="one-time-code"
            />
          </div>
          <Button disabled={pending}>Verifye kòd la</Button>
        </form>
      )}
      {state.error && (
        <p className="error" role="alert">
          {state.error}
        </p>
      )}
      {state.message && <p role="status">{state.message}</p>}
    </>
  );
}
