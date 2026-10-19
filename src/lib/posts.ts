import { getCollection, type CollectionEntry } from "astro:content";

export const ACTIVITY_TAG = "activity";

export async function getPosts() {
  const posts = await getCollection("blog", ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export const isActivity = (post: CollectionEntry<"blog">) => post.data.tags.includes(ACTIVITY_TAG);

/** Hand-written posts, excluding automated GitHub activity roundups. */
export async function getWriting() {
  return (await getPosts()).filter((p) => !isActivity(p));
}

export async function getActivity() {
  return (await getPosts()).filter(isActivity);
}

export function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}
