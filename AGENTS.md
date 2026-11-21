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
- **True is required, not enough.** A title can be accurate and still give nobody a reason to click. It needs at least one of:
  - **Stakes:** who gets hurt, or what was on the line, including your own credibility.
  - **A personal angle:** why this mattered to *you*.
  - **Personality:** a dry joke or a self-own.
  - **A contradiction** the reader wants resolved.
- Name things readers already know (GPT-4, a race car, "my religion") and put the key words first.
- A curiosity gap is fine if the post pays it off early. Withholding something trivial just to force a click is clickbait.
- Write 10+ options before picking. Test each one: would a recruiter scrolling past 20 posts stop on it? Would Jaspreet say it out loud?
- Accurate but flat: "LLaMA got a Sikh dietary rule exactly backwards". Also flat: "I made three AI models take a test on my religion. Nobody aced it." That one has a personal angle, but the punchline would be just as true at 99%, so it carries no weight.

**Hook (the first 1–3 sentences)**
- Open with the moment: the strange observation, the thing that broke, or the number that didn't make sense. Background comes after.
- Never start with "In this post", a definition, a broad statement about the field, or a rhetorical question.
- No fake suspense. Skip one-word paragraphs, "But there was a catch", and "Little did I know".
- **Never drop the reader in cold.** Within the first two or three sentences, a stranger should know who you are, what the project is, and why it matters. Journalists call this the nut graf: the anecdote first, the context right behind it.
- **Hold tension by withholding the *how*, not the *what*.** Say what went wrong and leave the mechanism for later.
- **No jargon, statistics, or mechanisms in the opening.** Things like "Krippendorff's alpha 0.49" or "row-order fallback" belong in the body. If a sentence needs a term defined, it's too early for it.
- Test: read the first paragraph to someone with no technical background. They should be able to say what the post is about, and they should want to know what happens next.
- Too far in the weeds: "The highest agreement score in my study was 0.49. It came from comparing two raters' scores on two different questions, 22 times." Better: "Last month I posted results from my research here. One number made the whole study look more trustworthy than it was. The data was fine. The problem was a space where my code expected an underscore."

**Process: iterate on the title and opening together**
Don't present the first idea. Work in rounds:

1. **Find the angles.** Write down three to five different reasons someone would care. For example: the stakes (who gets hurt), the personal reason, the most specific failure, a contradiction, or something funny. Each angle is a different post opening, not a rewording of the same one.
2. **Draft combos.** Write 10+ title and opening pairs across those angles. Draft each title and its first two sentences together, because a title that only works with a different opening is a different post.
3. **Critique each one honestly.** Note what works and what doesn't. Kill anything that fails one of these tests:
   - **The "who cares" test.** Would the line still read the same if the result were very different? "Nobody aced it" fits 60% and 99% equally, so it says nothing. The punchline should only be true of *this* story.
   - **Stakes.** Is it clear why this matters to someone besides me?
   - **Cold reader.** Can a non-technical stranger follow it without a definition?
   - **Truth.** Is every word backed by the data? No rounding up, no paraphrase passed off as a quote, and no "I graded" when raters graded.
   - **Voice.** Would Jaspreet actually say it?
4. **Iterate.** Take the two or three strongest and push them. Make them more specific, raise the stakes, cut words, or try a different verb.
5. **Present finalists.** Give Jaspreet 3–4 title and opening combos. Put your favorite first and explain why in one line each, and mention which angles you dropped and why. He picks, or asks for another round.

Show the shortlist and the reasoning, not every draft.

**Who reads this**
Recruiters, engineers and admissions readers skim. Many read only the title and the first paragraph, so those two have to work for a non-technical reader. Each post should also show judgment: what you decided, what you got wrong, and what you did about it.

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
- For Sikh and Punjabi concepts, use the real term and explain it plainly. Don't swap in a softer English word. For example, the bajjar kurahits are not "vows"; they're the four things a Sikh must never do. If you're unsure of a term or its weight, ask Jaspreet.

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
