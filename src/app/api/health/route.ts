import { getAuthSiteOrigin, getSupabaseConfig } from "@/lib/config";
export const dynamic = "force-dynamic";
export function GET() {
  return Response.json(
    {
      status: "ok",
      service: "tektalkkreyol-academy",
      revision: process.env.VERCEL_GIT_COMMIT_SHA || null,
      auth: {
        configured: !!getSupabaseConfig(),
        callbackConfigured: !!getAuthSiteOrigin(),
      },
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
