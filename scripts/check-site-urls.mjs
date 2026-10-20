#!/usr/bin/env node
// Verifies that same-site absolute URLs in <meta>/<link> tags (canonical, og:url, og:image, twitter:image)
// resolve to files in dist/. Link checkers don't follow meta content, so broken social cards would slip through.
import { readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const DIST = path.resolve(process.argv[2] || "dist");
const SITE = new URL(process.env.SITE_URL || "https://www.jaspreetahluwalia.com");

async function* htmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(full);
    else if (entry.name.endsWith(".html")) yield full;
  }
}

const tagRe = /<(?:meta|link)\b[^>]*>/gi;
const attrRe = /\b(content|href)="([^"]+)"/i;
let checked = 0;
const broken = [];
for await (const file of htmlFiles(DIST)) {
  for (const tag of (await readFile(file, "utf8")).match(tagRe) ?? []) {
    const value = tag.match(attrRe)?.[2];
    if (!value?.startsWith(SITE.origin)) continue;
    const { pathname } = new URL(value);
    const target = path.join(DIST, decodeURIComponent(pathname));
    const ok = pathname.endsWith("/") ? existsSync(path.join(target, "index.html")) : existsSync(target) || existsSync(`${target}.html`);
    checked++;
    if (!ok) broken.push(`${path.relative(DIST, file)}: ${value}`);
  }
}
console.log(`Checked ${checked} same-site meta/link URLs.`);
if (broken.length) {
  console.error(`Missing in ${path.relative(process.cwd(), DIST)}/:\n  ${broken.join("\n  ")}`);
  process.exit(1);
}
