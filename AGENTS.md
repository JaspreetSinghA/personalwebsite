# Writing a blog post for jaspreetahluwalia.com

This repo is Jaspreet Ahluwalia's personal site (Astro + Tailwind, deployed to GitHub Pages on every push to `main`). If you're asked to "write a blog post about this session/project", follow this guide. If you're working in another repo, clone `https://github.com/JaspreetSinghA/personalwebsite` and do it there.

## Where posts go

One Markdown file per post: `src/content/blog/<slug>.md`. The slug is short, lowercase, and hyphenated (e.g. `can-driver-for-vcu.md`). It becomes the URL: `/blog/<slug>/`.

Frontmatter (schema in `src/content.config.ts`, the build fails if it doesn't match):

```md
---
title: "Plain, specific title"
description: "One sentence on what the reader learns. Used in link previews and RSS."
date: 2026-10-20
tags: ["embedded", "python"]
draft: true
---
```

- Always start with `draft: true`. Jaspreet flips it to `false` after reviewing. Drafts show up in `npm run dev` but not on the live site.
- Never use the `activity` tag. It's reserved for the automated weekly GitHub summaries (`scripts/sync-activity.mjs`), and posts with that tag are hidden from the main blog.
- Images or charts go in `public/blog/` and are referenced as `/blog/<file>`. Give every image real alt text. Prefer SVG or compressed PNG/JPG, and strip EXIF from photos.

## What to write

Write it like an engineer explaining the work to another engineer, not like a changelog:

1. **The problem.** What wasn't working, or what question you were trying to answer.
2. **What you tried.** Approach, key decisions, what didn't work.
3. **Results.** Real numbers, plots, or before/after only. Never invent or round up figures. If a number isn't in the code, data, or session, leave a `<!-- TODO: ... -->` instead.
4. **What I learned.** Short and honest.

Aim for 400–1000 words. Use code snippets only where they explain something.

## Voice

- First person, in Jaspreet's voice: short, plain, and casual.
- No AI-sounding filler: avoid phrases like "delve", "in today's world", "it's worth noting", "a testament to", "journey", "unlock", "seamless", dramatic one-line reveals, and rhetorical setups.
- Short sentences and concrete details beat polish. If a sentence could appear in anyone's post, cut it.

## Privacy and permissions

- Never include secrets, API keys, tokens, internal URLs, phone numbers, or home address.
- Spartan Racing (SJSU Formula SAE) and Rayfield Systems work is team/company work. Don't publish their code, schematics, data, or photos unless Jaspreet confirms he has permission. Keep the post as a draft and flag it.
- Don't paste large chunks of proprietary code. Link to public repos instead.

## Before you finish

```sh
npm ci            # first time only; needs Node >= 22.22
npm run build     # runs astro check and fails on frontmatter errors
node scripts/check-site-urls.mjs dist
```

Then commit on a new branch and open a pull request. Don't push straight to `main`, because that publishes immediately. In the PR description, list anything you weren't sure about (numbers, permissions, wording).

Never delete `public/googlea7477a0b1b1b83e1.html` (Google Search Console verification) or `public/CNAME`.
