import type { APIRoute, GetStaticPaths } from "astro";
import { renderOg, type OgCard } from "../../lib/og";
import { getPosts, formatDate } from "../../lib/posts";
import { profile, blogDescription } from "../../data/profile";

export const getStaticPaths = (async () => {
  const posts = await getPosts();
  const cards: { slug: string; card: OgCard }[] = [
    { slug: "index", card: { eyebrow: profile.role, title: profile.name, subtitle: profile.seeking } },
    { slug: "blog", card: { eyebrow: "Blog", title: "Writing", subtitle: blogDescription } },
    { slug: "blog/activity", card: { eyebrow: "Blog", title: "GitHub activity", subtitle: "Automated weekly roundups of what I've been shipping." } },
    ...posts.map((p) => ({ slug: `blog/${p.id}`, card: { eyebrow: formatDate(p.data.date), title: p.data.title, subtitle: p.data.description } })),
  ];
  return cards.map(({ slug, card }) => ({ params: { slug }, props: card }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) =>
  new Response(await renderOg(props as OgCard), { headers: { "Content-Type": "image/png" } });
