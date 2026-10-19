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

  Posts are served at `/blog/<file-name>/` and included in `/rss.xml`. Drafts (`draft: true`) show up in `npm run dev` but aren't built for production.
- **Case studies:** set `writeup: "<post-file-name>"` on an experience or project entry in `src/data/profile.ts`; the "Case study →" link appears once that post is published.
- **Headshot / resume:** `public/headshot.jpg` and `public/Jaspreet_Ahluwalia_Resume.pdf`.
- **Social previews:** a 1200×630 card is generated for every page at build time (`src/pages/og/[...slug].png.ts`).

## Automation

- `.github/workflows/deploy.yml` — builds on every PR; builds and deploys to GitHub Pages on pushes to `main`. Requires **Settings → Pages → Source: GitHub Actions**.
- `.github/workflows/sync-activity.yml` — runs weekly (Mondays 14:17 UTC) and can be triggered manually (with a dry-run option). It runs `scripts/sync-activity.mjs`, which collects public commits, PRs, releases, and new repos since the last activity post and writes `src/content/blog/activity-YYYY-MM-DD.md`. Posts are at least 6 days apart (never more than one per UTC day), weeks with no activity are skipped, and the site is verified to build before the post is committed and deployed. Activity posts are tagged `activity` and listed at `/blog/activity/`, separate from the main blog, homepage, and RSS feed.
- `.github/workflows/links.yml` — builds the site and checks every link with [lychee](https://github.com/lycheeverse/lychee) on PRs and weekly.

### Analytics (optional)

Cookie-free page-view stats via [GoatCounter](https://www.goatcounter.com): create a free site, then add a repository variable **Settings → Secrets and variables → Actions → Variables → `GOATCOUNTER_CODE`** set to your site code (e.g. `jaspreet` for `jaspreet.goatcounter.com`). The tracking script is only included when this is set.

Preview a sync locally without writing anything:

```sh
DRY_RUN=true npm run sync:activity
```
