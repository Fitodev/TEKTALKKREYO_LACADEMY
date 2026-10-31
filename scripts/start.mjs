import { cp } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
await cp(".next/static", ".next/standalone/.next/static", { recursive: true });
process.env.HOSTNAME = "0.0.0.0";
await import(pathToFileURL(resolve(".next/standalone/server.js")).href);
