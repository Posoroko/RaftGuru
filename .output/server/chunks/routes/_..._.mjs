import { d as defineEventHandler, c as createError, s as setResponseHeader } from '../_/nitro.mjs';
import { join } from 'path';
import { existsSync, readFileSync } from 'fs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'web-push';
import 'node:fs';
import 'node:url';
import 'node:path';
import 'node:crypto';

let indexHtml = null;
const _____ = defineEventHandler((event) => {
  const path = event.path || "";
  if (path.startsWith("/api/")) {
    return;
  }
  if (path.startsWith("/assets/") || path.match(/\.(js|css|png|jpg|jpeg|svg|ico|woff|woff2|ttf|json|webmanifest|map)$/)) {
    return;
  }
  if (!indexHtml) {
    const candidates = [
      join(process.cwd(), ".output", "public", "index.html"),
      join(process.cwd(), "dist", "index.html"),
      join(process.cwd(), "public", "index.html"),
      join(process.cwd(), "index.html")
    ];
    for (const path2 of candidates) {
      if (existsSync(path2)) {
        console.log("[SPA] Serving index.html from:", path2);
        indexHtml = readFileSync(path2, "utf-8");
        break;
      }
    }
    if (!indexHtml) {
      console.error("[SPA] index.html not found. Tried:", candidates);
      console.error("[SPA] cwd:", process.cwd());
      throw createError({ statusCode: 500, message: "index.html not found" });
    }
  }
  setResponseHeader(event, "Content-Type", "text/html");
  return indexHtml;
});

export { _____ as default };
//# sourceMappingURL=_..._.mjs.map
