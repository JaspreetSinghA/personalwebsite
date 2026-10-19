import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getWriting } from "../lib/posts";
import { profile, blogDescription } from "../data/profile";

export async function GET(context: APIContext) {
  const posts = await getWriting();
  return rss({
    title: `${profile.name} — Blog`,
    description: blogDescription,
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: `/blog/${post.id}/`,
    })),
  });
}
