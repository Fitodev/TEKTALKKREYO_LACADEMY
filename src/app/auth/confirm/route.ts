import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { safeNext } from "@/lib/config";
export async function GET(request: NextRequest) {
  // Codes and token hashes must never be cached or sent to third-party referrers.
  function finish(path: string) {
    // A relative Location preserves the browser origin behind Vercel/proxies.
    const response = new NextResponse(null, {
      status: 303,
      headers: { Location: path },
    });
    response.headers.set("Cache-Control", "private, no-store");
    response.headers.set("Referrer-Policy", "no-referrer");
    return response;
  }
  const params = request.nextUrl.searchParams;
  if (params.has("error")) return finish("/konekte?eta=google");
  const next = safeNext(params.get("next"));
  const supabase = await createClient();
  const code = params.get("code"),
    tokenHash = params.get("token_hash"),
    type = params.get("type");
  if (supabase) {
    if (code) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error)
        return finish(
          data && "redirectType" in data && data.redirectType === "recovery"
            ? "/kont/modpas"
            : next,
        );
    }
    if (
      tokenHash &&
      (type === "email" || type === "recovery" || type === "signup")
    ) {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type,
      });
      if (!error) return finish(type === "recovery" ? "/kont/modpas" : next);
    }
  }
  return finish("/konekte?eta=lyen");
}
