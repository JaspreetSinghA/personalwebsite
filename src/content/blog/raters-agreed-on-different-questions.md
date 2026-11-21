---
title: "My raters agreed most when they were rating different questions"
description: "A one-character bug made my bias study look more reliable than it was. Finding it made me rebuild every number, and some of my findings didn't survive."
date: 2026-11-20
tags: ["biaslens", "debugging", "research", "python"]
draft: false
---

Last month I posted results from my research on how AI models talk about Sikhs. One number in that post made the whole study look more trustworthy than it was.

It was wrong. The data was fine, and so was the math. The problem was a space where my code expected an underscore.

The research is [BiasLens](https://github.com/JaspreetSinghA/biaslense). Six people rated 162 AI answers about Sikhs, and that one number was supposed to tell me whether their ratings meant anything. Here's how a space broke it, and what else fell over once I started checking.

## Why agreement matters

If two people score the same answer and one gives it a 5 while the other gives it a 1, their scores are mostly noise. So before trusting any ratings, you check how much raters agree. I used Krippendorff's alpha, where 1 means perfect agreement and 0 means no better than chance.

My numbers were bad. Most sat near zero. One stood out: on accuracy, the two raters scoring Claude's answers hit 0.49. In the [October post](/blog/biaslens-llm-as-judge/) I called it the only value that reached "moderate."

Those were the raters who agreed most. They were also, it turns out, never rating the same question.

## The bug

Each rater filled out a spreadsheet with a "Prompt ID" column, so my loader could line up their scores by question. The loader cleaned up the column names first:

```python
df.columns = df.columns.str.strip().str.lower()   # "Prompt ID" -> "prompt id"

if 'prompt_id' in df.columns:                      # never true: space, not underscore
    extracted['prompt_id'] = df['prompt_id']
elif 'prompt' in df.columns and ...:
    ...
else:
    extracted['prompt_id'] = range(len(df))        # silently use row numbers
```

"Prompt ID" became "prompt id" with a space. The check looked for "prompt_id" with an underscore. It never matched, so every file fell back to row numbers without a warning, and row 1 of one rater got compared with row 1 of the other.

For GPT-4 and LLaMA, that happened to work: their raters listed the questions in the same order. Claude's two raters didn't. They covered 38 and 22 questions, in different orders. My code made 22 pairs and called them agreement. **Zero of the 22 were the same question.**

The fix was one line to turn spaces into underscores, plus one I care about more: if there's no question ID, the loader now stops with an error instead of guessing.

```python
df.columns = df.columns.str.strip().str.lower().str.replace(r"\s+", "_", regex=True)
...
else:
    raise ValueError(f"{filename}: no prompt identifier column ('Prompt ID' or 'prompt')")
```

## What the real numbers look like

Matched by question, Claude's raters shared 16 questions, not 22.

<img src="/blog/biaslens-claude-alpha.svg" alt="Dot plot of agreement between the two Claude raters, with the bug versus fixed. Accuracy: 0.49 with the bug, −0.05 fixed. Fairness: 0.03 to 0.38. Neutrality: 0.07 to 0.25. Representation: −0.16 to 0.08. No value reaches the 0.667 minimum for drawing conclusions either way." width="660" height="290" loading="lazy" />

Accuracy dropped from 0.49 to −0.05. The other three went up. Either way, nothing came close to 0.667, the usual minimum for drawing even tentative conclusions. The averages didn't change at all, only the agreement.

So the bug didn't hide good news or bad news. It hid the *real* news, which was that my raters didn't share a standard for what fair representation of Sikhs looks like. That's a finding in itself, and I'd been covering it with a number from mismatched rows.

## Then I checked everything else

If one number could be wrong that quietly, others could too. So I rebuilt every table in my paper draft from the raw ratings, using scripts I committed to the repo, and compared.

**What didn't survive:**
- **Two of my model comparisons.** The draft mixed results from an older analysis with the final 276 ratings. "Claude was strongest overall" and "LLaMA had the lowest fairness" both disappeared. The final data shows no significant difference between models overall.
- **My mitigation gains.** An earlier draft said the best fix improved fairness by 127%, neutrality by 134% and representation by 83%. Recomputed from the source sheets, the gains were 63%, 46% and 46%, about half.
- **My own blog post.** The October post said the best fix raised the bias score from 2.83 to 4.13. The real numbers are 2.66 to 4.00. I've corrected that post and added a note at the top.

**What held up:**
- Adding a short, trusted fact to the prompt still helped most.
- My hand-picked penalties in the first scorer were still about 3× too harsh.
- Questions about wording and framing still scored lowest for two of the three models.

The core story survived. The parts that made it sound stronger mostly didn't.

## What I learned

- **Never fall back silently.** The row-number fallback was meant to be helpful. It turned a missing column into confident, wrong output. An error would have caught it on the first run.
- **Check that an ID is really an ID.** Before joining on a key, print a few values. Real question IDs look like `COMP_DIRECT_01`. Mine were `0, 1, 2`.
- **Every number should come from a script you can rerun.** The mitigation percentages had no script behind them, and they were off by about half.
- **Running isn't the same as right.** The pipeline ran without errors for months. It was also wrong.

I'd rather find this myself than have a reviewer find it. If you're reading the [paper](https://github.com/JaspreetSinghA/biaslense/blob/main/docs/paper/biaslense_paper.pdf), every number in it now comes from code in the repo. What the study actually found is in [the companion post](/blog/ai-got-a-sikh-rule-backwards/).
