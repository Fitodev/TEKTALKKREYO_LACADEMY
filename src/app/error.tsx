"use client";
import { Button } from "@/components/ui/button";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="container section">
      <h1>Gen yon pwoblèm.</h1>
      <p>Nou pa rive chaje paj la. Tanpri eseye ankò.</p>
      <Button onClick={reset}>Eseye ankò</Button>
    </div>
  );
}
