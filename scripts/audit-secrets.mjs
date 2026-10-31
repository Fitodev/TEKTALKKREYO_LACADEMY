import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { findSecretKinds } from "./security-lib.mjs";
const findings = [];
const seen = new Set();
const knownSecrets = Object.entries(process.env).filter(
  ([name, value]) =>
    !name.startsWith("NEXT_PUBLIC_") &&
    /(?:TOKEN|SECRET|PASSWORD|PRIVATE_KEY|SERVICE_ROLE)/i.test(name) &&
    value?.length >= 16,
);
function inspect(label, text) {
  const kinds = findSecretKinds(text);
  for (const [name, value] of knownSecrets)
    if (text.includes(value)) kinds.push(`environment secret ${name}`);
  for (const kind of kinds) {
    const id = label + ":" + kind;
    if (!seen.has(id)) {
      findings.push({ location: label, kind });
      seen.add(id);
    }
  }
}
// Ignore rules do not untrack files: explicitly reject credential paths already in Git.
const tracked = execFileSync("git", ["ls-files", "-z"], { encoding: "utf8" })
  .split("\0")
  .filter(Boolean);
for (const file of tracked) {
  const base = file.split("/").pop() ?? "";
  const sensitive =
    (/^\.env(?:$|[.-])/.test(base) && base !== ".env.example") ||
    /(?:^|\/)(?:\.vercel|\.secrets|secrets)(?:\/|$)/.test(file) ||
    /\.(?:pem|key|p12|pfx|jks|keystore)$/i.test(base) ||
    /^(?:credentials\.json|.*-credentials\.json|service-account.*\.json|.*-service-account\.json|\.npmrc|\.pypirc|\.netrc)$/i.test(
      base,
    );
  if (sensitive)
    findings.push({
      location: `tracked file: ${file}`,
      kind: "credential file tracked despite ignore policy",
    });
}
const files = execFileSync(
  "git",
  ["ls-files", "-z", "--cached", "--others", "--exclude-standard"],
  { encoding: "utf8" },
)
  .split("\0")
  .filter(Boolean);
for (const file of files)
  if (existsSync(file))
    inspect(`working tree: ${file}`, readFileSync(file, "utf8"));
// Inspect every reachable historical blob, including files deleted from the latest revision.
const objects = execFileSync("git", ["rev-list", "--objects", "--all"], {
  encoding: "utf8",
})
  .trim()
  .split("\n")
  .filter(Boolean);
let blobs = 0;
for (const row of objects) {
  const space = row.indexOf(" ");
  if (space < 0) continue;
  const oid = row.slice(0, space),
    name = row.slice(space + 1);
  const type = execFileSync("git", ["cat-file", "-t", oid], {
    encoding: "utf8",
  }).trim();
  if (type !== "blob") continue;
  blobs++;
  inspect(
    `history ${oid.slice(0, 12)}: ${name}`,
    execFileSync("git", ["cat-file", "blob", oid], {
      encoding: "utf8",
      maxBuffer: 16 * 1024 * 1024,
    }),
  );
}
let chunks = 0;
function visit(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) visit(path);
    else if (/\.(js|json|html|map|txt|css)$/.test(entry.name)) {
      chunks++;
      inspect(`browser artifact: ${path}`, readFileSync(path, "utf8"));
    }
  }
}
visit(".next/static");
console.log(
  JSON.stringify(
    {
      workingTreeFiles: files.length,
      historicalBlobs: blobs,
      browserArtifacts: chunks,
      findings,
    },
    null,
    2,
  ),
);
console.log(
  "Scope: local files, reachable Git history and local browser artifacts; patterns and configured secret values only. No hosted deployment or provider settings are verified by this scan.",
);
if (findings.length) process.exitCode = 1;
