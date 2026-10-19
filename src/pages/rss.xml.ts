import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getPosts } from "../lib/posts";
import { profile } from "../data/profile";

export async function GET(context: APIContext) {
  const posts = await getPosts();
  return rss({
    title: `${profile.name} — Blog`,
    description: "Notes on embedded systems, race-car electronics, AI evaluation, and what I'm building.",
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.id}/`,
    })),
  });
}
