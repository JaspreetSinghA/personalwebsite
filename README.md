# personalwebsite

Source for [jaspreetahluwalia.com](https://www.jaspreetahluwalia.com) — an [Astro](https://astro.build) static site styled with Tailwind CSS v4.

## Develop

```sh
npm install
npm run dev      # http://localhost:4321
npm run build    # type-check + build to dist/
```

## Content

- **Profile, experience, projects, skills:** `src/data/profile.ts`
- **Blog posts:** add a Markdown file to `src/content/blog/`:

  ```md
  ---
  title: "Post title"
  description: "One-line summary"
  date: 2026-10-19
  tags: ["embedded"]
  draft: false
  ---
  ```

  Posts are served at `/blog/<file-name>/` and included in `/rss.xml`.

## Automation

- `.github/workflows/deploy.yml` — builds on every PR; builds and deploys to GitHub Pages on pushes to `main`. Requires **Settings → Pages → Source: GitHub Actions**.
- `.github/workflows/sync-activity.yml` — runs once a day (14:17 UTC) and can be triggered manually (with a dry-run option). It runs `scripts/sync-activity.mjs`, which collects public commits, PRs, releases, and new repos since the last activity post and writes `src/content/blog/activity-YYYY-MM-DD.md`. It writes at most one post per UTC day, skips days with no activity, verifies the site builds, commits the post, and deploys.

Preview a sync locally without writing anything:

```sh
DRY_RUN=true npm run sync:activity
```
