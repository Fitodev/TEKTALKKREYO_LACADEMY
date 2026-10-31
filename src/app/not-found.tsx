import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function NotFound() {
  return (
    <div className="container section">
      <h1>Nou pa jwenn paj sa a.</h1>
      <p>Lyen an ka chanje oswa paj la poko disponib.</p>
      <Button asChild>
        <Link href="/">Retounen nan akèy la</Link>
      </Button>
    </div>
  );
}
