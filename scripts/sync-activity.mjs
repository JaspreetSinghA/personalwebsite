#!/usr/bin/env node
// Builds a Markdown blog post summarizing recent public GitHub activity.
// Writes at most one post per MIN_DAYS_BETWEEN_POSTS (and never two on the same UTC day);
// exits without writing if there's nothing new.
import { readdir, readFile, writeFile, appendFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";

const USER = process.env.GH_USER || "JaspreetSinghA";
const TOKEN = process.env.GITHUB_TOKEN;
const BLOG_DIR = path.resolve(process.env.BLOG_DIR || "src/content/blog");
const DRY_RUN = process.env.DRY_RUN === "true";
const DEFAULT_LOOKBACK_DAYS = 7;
const MAX_LOOKBACK_DAYS = 30;
const MAX_COMMITS_PER_REPO = 10;
const MIN_DAYS_BETWEEN_POSTS = Math.max(1, Number(process.env.MIN_DAYS_BETWEEN_POSTS) || 6);
const PREFIX = "activity-";

const now = new Date();
const today = now.toISOString().slice(0, 10);
const outFile = path.join(BLOG_DIR, `${PREFIX}${today}.md`);

async function setOutput(key, value) {
  if (process.env.GITHUB_OUTPUT) await appendFile(process.env.GITHUB_OUTPUT, `${key}=${value}\n`);
}

async function gh(pathname) {
  const res = await fetch(`https://api.github.com${pathname}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": `${USER}-portfolio-sync`,
      ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
    },
  });
  if (res.status === 409) return []; // empty repository
  if (!res.ok) throw new Error(`GitHub API ${res.status} for ${pathname}: ${await res.text()}`);
  return res.json();
}

// Commit messages and titles are untrusted text rendered as Markdown; neutralize HTML and link syntax.
const esc = (s) => String(s).replace(/[\\`*_[\]<>|#]/g, (c) => `\\${c}`).replace(/\s+/g, " ").trim();
const firstLine = (s) => String(s).split("\n")[0].slice(0, 140);

async function lastSyncDate() {
  const files = (await readdir(BLOG_DIR)).filter((f) => f.startsWith(PREFIX) && f.endsWith(".md")).sort();
  const latest = files.at(-1);
  if (!latest) return null;
  const match = (await readFile(path.join(BLOG_DIR, latest), "utf8")).match(/^syncedAt:\s*"?([^"\n]+)"?/m);
  return match ? new Date(match[1]) : new Date(latest.slice(PREFIX.length, -3));
}

async function main() {
  if (existsSync(outFile)) {
    console.log(`Already synced today (${path.relative(process.cwd(), outFile)}). Skipping.`);
    return setOutput("created", "false");
  }

  const last = await lastSyncDate();
  if (last && now.getTime() - last.getTime() < MIN_DAYS_BETWEEN_POSTS * 864e5) {
    console.log(`Last activity post was ${last.toISOString()}; posts are at least ${MIN_DAYS_BETWEEN_POSTS} days apart. Skipping.`);
    return setOutput("created", "false");
  }

  const floor = new Date(now.getTime() - MAX_LOOKBACK_DAYS * 864e5);
  let since = last ?? new Date(now.getTime() - DEFAULT_LOOKBACK_DAYS * 864e5);
  if (Number.isNaN(since.getTime()) || since < floor) since = floor;
  console.log(`Collecting activity for ${USER} since ${since.toISOString()}`);

  const repos = (await gh(`/users/${USER}/repos?type=owner&sort=pushed&per_page=100`)).filter(
    (r) => !r.fork && !r.private && new Date(r.pushed_at) > since,
  );

  const commitsByRepo = [];
  for (const repo of repos) {
    const commits = await gh(
      `/repos/${repo.full_name}/commits?author=${USER}&since=${since.toISOString()}&per_page=100`,
    );
    const own = commits.filter((c) => c.parents.length < 2 && !/^chore\(blog\): activity/i.test(c.commit.message));
    if (own.length) commitsByRepo.push({ repo, commits: own });
  }

  const events = [];
  for (let page = 1; page <= 3; page++) {
    const batch = await gh(`/users/${USER}/events/public?per_page=100&page=${page}`);
    events.push(...batch);
    if (batch.length < 100 || new Date(batch.at(-1).created_at) < since) break;
  }
  const recent = events.filter((e) => new Date(e.created_at) > since);
  const prEvents = recent.filter((e) => e.type === "PullRequestEvent" && ["opened", "closed"].includes(e.payload.action));
  // Event payloads only carry a trimmed PR object, so fetch title/merge state directly.
  const prs = [];
  for (const e of prEvents.slice(0, 20)) {
    const pr = await gh(`/repos/${e.repo.name}/pulls/${e.payload.number ?? e.payload.pull_request.number}`);
    prs.push({ action: e.payload.action, repo: e.repo.name, pr });
  }
  const releases = recent.filter((e) => e.type === "ReleaseEvent" && e.payload.action === "published");
  const newRepos = recent.filter((e) => e.type === "CreateEvent" && e.payload.ref_type === "repository");

  const totalCommits = commitsByRepo.reduce((n, r) => n + r.commits.length, 0);
  if (!totalCommits && !prs.length && !releases.length && !newRepos.length) {
    console.log("No new public activity. Skipping.");
    return setOutput("created", "false");
  }

  const parts = [];
  if (totalCommits) parts.push(`${totalCommits} commit${totalCommits === 1 ? "" : "s"} across ${commitsByRepo.length} repo${commitsByRepo.length === 1 ? "" : "s"}`);
  if (prs.length) parts.push(`${prs.length} pull request update${prs.length === 1 ? "" : "s"}`);
  if (releases.length) parts.push(`${releases.length} release${releases.length === 1 ? "" : "s"}`);
  if (newRepos.length) parts.push(`${newRepos.length} new repo${newRepos.length === 1 ? "" : "s"}`);
  const summary = parts.join(", ");

  const body = [];
  body.push(`An automated roundup of what I've shipped on [GitHub](https://github.com/${USER}) since ${since.toISOString().slice(0, 10)}: ${summary}.`);

  if (newRepos.length) {
    body.push("", "## New repositories", "");
    for (const e of newRepos) body.push(`- [${esc(e.repo.name)}](https://github.com/${e.repo.name})`);
  }
  if (releases.length) {
    body.push("", "## Releases", "");
    for (const e of releases) {
      const r = e.payload.release;
      body.push(`- **${esc(e.repo.name.split("/")[1])}** — [${esc(r.name || r.tag_name)}](${r.html_url})`);
    }
  }
  for (const { repo, commits } of commitsByRepo) {
    body.push("", `## [${esc(repo.name)}](${repo.html_url})`, "");
    if (repo.description) body.push(`_${esc(repo.description)}_`, "");
    for (const c of commits.slice(0, MAX_COMMITS_PER_REPO)) {
      body.push(`- ${esc(firstLine(c.commit.message))} ([\`${c.sha.slice(0, 7)}\`](${c.html_url}))`);
    }
    if (commits.length > MAX_COMMITS_PER_REPO) {
      body.push(`- …and ${commits.length - MAX_COMMITS_PER_REPO} more ([history](${repo.html_url}/commits?author=${USER}))`);
    }
  }
  if (prs.length) {
    body.push("", "## Pull requests", "");
    for (const { action, repo, pr } of prs) {
      const state = action === "opened" ? "Opened" : pr.merged ? "Merged" : "Closed";
      body.push(`- ${state} [${esc(pr.title)}](${pr.html_url}) in ${esc(repo)}`);
    }
  }

  const frontmatter = [
    "---",
    `title: ${JSON.stringify(`GitHub activity: week of ${now.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })}`)}`,
    `description: ${JSON.stringify(`Automated GitHub roundup — ${summary}.`)}`,
    `date: ${today}`,
    `syncedAt: ${JSON.stringify(now.toISOString())}`,
    `tags: ["activity", "github"]`,
    "---",
  ].join("\n");

  const content = `${frontmatter}\n\n${body.join("\n")}\n`;
  if (DRY_RUN) {
    console.log(content);
    return setOutput("created", "false");
  }
  await writeFile(outFile, content);
  console.log(`Wrote ${path.relative(process.cwd(), outFile)} (${summary})`);
  await setOutput("created", "true");
  await setOutput("path", path.relative(process.cwd(), outFile));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
