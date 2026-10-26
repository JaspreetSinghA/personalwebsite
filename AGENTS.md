# Writing a blog post for jaspreetahluwalia.com

This repo is Jaspreet Ahluwalia's personal site (Astro + Tailwind, deployed to GitHub Pages on every push to `main`). If you're asked to "write a blog post about this session/project", follow this guide. If you're working in another repo, clone `https://github.com/JaspreetSinghA/personalwebsite` and do it there.

## Where posts go

This repo is public, so anything committed (including drafts, and every past version in git history) can be read by anyone. Drafts therefore never get committed:

- **Drafts** go in `src/content/blog/drafts/<slug>.md`. That folder is gitignored, so nothing in it is pushed. Preview it with `npm run dev` at `/blog/drafts/<slug>/`.
- **Publishing:** once Jaspreet approves a draft (and, for team or company work, has permission), move it to `src/content/blog/<slug>.md`, set `draft: false`, and open a PR.

The slug is short, lowercase, and hyphenated (e.g. `can-driver-for-vcu.md`). A published post's URL is `/blog/<slug>/`.

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

- Always start with `draft: true` in the drafts folder. It's a second safeguard: even if a draft is committed by mistake, it won't appear on the live site (but it will still be readable on GitHub).
- Never use the `activity` tag. It's reserved for the automated weekly GitHub summaries (`scripts/sync-activity.mjs`), and posts with that tag are hidden from the main blog.
- Images or charts go in `public/blog/` and are referenced as `/blog/<file>`. Give every image real alt text. Prefer SVG or compressed PNG/JPG, and strip EXIF from photos.

## Title and hook

The title and first two sentences decide whether anyone reads the rest. Spend real effort on them, but keep them plain and true.

**Title**
- Name the specific, surprising thing: a result, a failure, or an odd detail from the work. Make a reader want to know how or why.
- Keep it short (under ~70 characters) and concrete. Real nouns and numbers, no buzzwords.
- Avoid generic patterns: "How I built X", "Lessons from X", "A deep dive into X", "X: a journey", and "Title: Subtitle" colons.
- It must be literally true. No clickbait and no exaggeration.
- Good: "Our hottest cells weren't our hottest cells". Bad: "Exploring thermal modeling for electric race cars".

**Hook (the first 1–2 sentences)**
- Open with the moment: the strange observation, the thing that broke, or the number that didn't make sense. Background comes after.
- Never start with "In this post", a definition, a broad statement about the field, or a rhetorical question.
- No fake suspense. Skip one-word paragraphs, "But there was a catch", and "Little did I know".
- Then explain within a few sentences what the project was and why it mattered.

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
- Spartan Racing (SJSU Formula SAE) and Rayfield Systems work is team/company work. Don't publish their code, schematics, data, or photos unless Jaspreet confirms he has permission. Keep the post in the local drafts folder and flag it. This also covers figures that would help a rival team (thermal margins, control strategy, limits, unpublished test results), and it applies to commit messages and PR descriptions too.
- Don't paste large chunks of proprietary code. Link to public repos instead.

## Before you finish

```sh
npm ci            # first time only; needs Node >= 22.22
npm run build     # runs astro check and fails on frontmatter errors
node scripts/check-site-urls.mjs dist
```

For a draft, stop here: leave it in `src/content/blog/drafts/` and tell Jaspreet where it is. Don't commit it.

For an approved post (moved out of drafts, `draft: false`), commit on a new branch and open a pull request. Don't push straight to `main`, because that publishes immediately. In the PR description, list anything you weren't sure about (numbers, permissions, wording).

Never delete `public/googlea7477a0b1b1b83e1.html` (Google Search Console verification) or `public/CNAME`.
