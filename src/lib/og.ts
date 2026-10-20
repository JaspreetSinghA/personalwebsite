import { readFile } from "node:fs/promises";
import path from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { profile } from "../data/profile";

export type OgCard = { eyebrow: string; title: string; subtitle?: string };

type Node = { type: string; props: Record<string, unknown> };
const el = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}): Node => ({
  type,
  props: { style: { display: "flex", ...style }, children, ...extra },
});

let assets: Promise<[Buffer, Buffer, string]> | undefined;
function loadAssets() {
  const root = process.cwd();
  const fonts = path.join(root, "node_modules/@fontsource/inter/files");
  assets ??= Promise.all([
    readFile(path.join(fonts, "inter-latin-400-normal.woff")),
    readFile(path.join(fonts, "inter-latin-600-normal.woff")),
    readFile(path.join(root, "public", profile.photo)).then((b) => `data:image/jpeg;base64,${b.toString("base64")}`),
  ]);
  return assets;
}

export async function renderOg({ eyebrow, title, subtitle }: OgCard): Promise<Uint8Array<ArrayBuffer>> {
  const [regular, semibold, photo] = await loadAssets();
  const tree = el(
    "div",
    { width: "100%", height: "100%", boxSizing: "border-box", flexDirection: "column", justifyContent: "space-between", padding: 80, background: "#09090b", color: "#fafafa", fontFamily: "Inter" },
    [
      el("div", { flexDirection: "column", gap: 24 }, [
        el("div", { fontSize: 26, color: "#a1a1aa" }, eyebrow),
        el("div", { fontSize: title.length > 48 ? 60 : 76, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.1 }, title),
        subtitle ? el("div", { fontSize: 28, color: "#a1a1aa", lineHeight: 1.4, maxWidth: 960 }, subtitle) : null,
      ]),
      el("div", { alignItems: "center", gap: 24 }, [
        el("img", { width: 72, height: 72, borderRadius: 9999, objectFit: "cover" }, undefined, { src: photo, width: 72, height: 72 }),
        el("div", { flexDirection: "column" }, [
          el("div", { fontSize: 26, fontWeight: 600 }, profile.name),
          el("div", { fontSize: 22, color: "#a1a1aa" }, new URL(import.meta.env.SITE).host.replace(/^www\./, "")),
        ]),
      ]),
    ],
  );
  const svg = await satori(tree as unknown as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts: [
      { name: "Inter", data: regular, weight: 400, style: "normal" },
      { name: "Inter", data: semibold, weight: 600, style: "normal" },
    ],
  });
  return new Uint8Array(new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng());
}
