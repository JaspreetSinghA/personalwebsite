---
title: "My bias detector was biased against my own religion"
description: "How BiasLens went from regex rules calibrated on 276 human ratings to a structured LLM-as-judge, what the inter-rater numbers actually said, and which mitigation strategy worked best."
date: 2026-10-19
tags: ["biaslens", "ai-evaluation", "python", "case-study"]
draft: false
---

I gave my bias detector a respectful paragraph about *seva*, the Sikh idea of selfless service. It flagged it as high risk.

That detector was the first version of [BiasLens](https://github.com/JaspreetSinghA/biaslense), an open-source toolkit I built to catch and reduce bias in how language models write about Sikhs. It's backed by United Sikhs, a UN-partnered NGO, and I presented it at the United Sikhs Summit 2025. Rebuilding it took human ratings and an LLM judge. The best fix I tested raised the bias score from 2.83 to 4.13 out of 5.

## The problem

LLMs often get Sikh identity wrong. They mix Sikhism up with Islam, reduce it to an ethnic Punjabi identity, or get basic terms wrong (for example, calling the congregation a "Gurdwara", which is actually the place of worship). Sikhs were largely missing from existing bias benchmarks, so I couldn't measure the problem with off-the-shelf tools.

## Building a human baseline

I wrote **54 prompts** across knowledge, linguistic and representation bias, and collected responses from **GPT-4, LLaMA-3.3-70B and Claude 3 Haiku**. Raters then scored each response from 1 to 5 on five dimensions: **accuracy, relevance, fairness, neutrality and representation**. In total that gave **276 rated responses from 6 raters**.

Before tuning anything against those ratings, I checked whether the raters agreed with each other, using **Krippendorff's alpha** (ordinal):

| Model | Accuracy | Fairness | Neutrality | Representation |
|---|---:|---:|---:|---:|
| GPT-4 | −0.12 | 0.02 | −0.05 | −0.03 |
| LLaMA-3.3-70B | 0.33 | 0.20 | 0.23 | 0.20 |
| Claude 3 Haiku | 0.49 | 0.03 | 0.07 | −0.16 |

These numbers are low. Only one value gets to "moderate" (Claude accuracy, 0.49), and GPT-4 sits around zero, which means about the same as chance. The likely causes:

- only two raters per model,
- rubric definitions loose enough to read differently,
- a task that is partly subjective.

Each of these is a limitation I report, not something to hide. It also changed how I used the data. Instead of treating any single rating as ground truth, I used the **distribution** of ratings.

## Version 1: rules, calibrated against people

The first scorer started each dimension at a baseline and subtracted penalties when regex patterns fired (conflation with Islam, "all Sikhs…" generalizations, terrorism associations, and so on). The original baselines (a perfect 5.0) and penalties were numbers I had picked by hand. I replaced them with values taken from the ratings:

- **Baselines** became the raters' mean scores (fairness 3.49, neutrality 3.55, representation 3.60).
- **Penalties** became the average score drop raters actually gave when a pattern was present. My hand-picked −4.5 for terrorism-related language turned out to be about **3× too harsh**: raters docked an average of **1.49** points. Religious conflation dropped from −3.5 to −1.47.

The full method is in [ALGORITHM.md](https://github.com/JaspreetSinghA/biaslense/blob/main/ALGORITHM.md).

Calibration fixed the scale of the penalties, but rules still had a basic problem: they can't read. That's how the *seva* paragraph from the top of this post came back as high risk. It simply mentioned the same topics as the biased examples. An embedding-similarity check made this worse, because any text about Sikhism sits close to every other text about Sikhism.

## Version 2: a structured LLM-as-judge

So I replaced the regex scorer with one model call per response. That call returns a 1–5 integer **and a one-sentence reason** for each of the same five dimensions the human raters used. The prompt includes the rubric exactly as written for raters, plus four rated responses as examples. Each reason has to quote or paraphrase the phrase that drove the score. That makes a wrong score easy to spot: you can see exactly what the judge reacted to.

For validation, I split the rated responses with a fixed seed into a **dev set**, used for prompt iteration, and an **8-response held-out test set** that is scored only once, when the prompt is final. The four few-shot examples are excluded from both sets, so the judge is never graded on its own examples. Agreement is reported per dimension as exact match, within-1-point rate, and mean absolute error against the human scores.

<!-- TODO: add the held-out test-set numbers (Exact %, Within-1 %, MAE per dimension) from tasks/validate_scorer.py --test. They aren't in the repo, so I left them out instead of guessing. -->

## Which fixes actually reduce bias?

Detection is only half the project. I also tested three prompt-engineering strategies for getting better answers from the same models:

- **instructional**: tell the model to avoid stereotypes,
- **contextual**: give it background framing,
- **retrieval-based**: give it facts to ground the answer.

I re-rated the results on the same rubric. For this comparison, *bias composite* is the mean of the five dimension scores, from 1 to 5, higher is better:

| Strategy | Accuracy | Fairness | Neutrality | Representation | Bias composite |
|---|---:|---:|---:|---:|---:|
| Baseline (no mitigation) | 3.36 | 2.27 | 2.42 | 2.50 | 2.83 |
| Instructional | 3.87 | 3.80 | 3.80 | 3.60 | 3.77 |
| Contextual | 4.07 | 3.53 | 4.13 | 3.33 | 3.76 |
| **Retrieval-based** | **4.40** | **4.07** | 3.93 | **4.00** | **4.13** |

<img src="/blog/biaslens-mitigation.svg" alt="Dot plot comparing baseline and retrieval-based prompting on each rubric dimension. Retrieval-based scores higher on all six, with the biggest gains in Fairness (2.27 to 4.07) and Neutrality (2.42 to 3.93)." width="660" height="328" loading="lazy" />

Retrieval-based prompting did best on almost every dimension. It raised the composite from 2.83 to 4.13, an average **+58% per response** over baseline. Simply telling the model to "be unbiased" helped about as much as adding context, but less than grounding it in facts. This is a small test: **5 prompts × 3 models**. Treat it as a direction, not a final result. Based on this, BiasLens's mitigation step now tries retrieval grounding first for most bias types.

## Shipping it

Researchers, developers and community advocates use different tools, so BiasLens ships four ways:

- a **Python SDK** on [PyPI](https://pypi.org/project/biaslense/) (`pip install biaslense`),
- a rate-limited **FastAPI** REST API with structured request logging,
- a **Streamlit** app where non-programmers can paste text and get scores with reasons,
- an **MCP server**, so AI assistants can call the scorer directly. There's a local version for fully offline use.

## What I learned

- **Measure agreement before trusting a metric.** I nearly calibrated a scorer against labels that agreed with each other about as well as chance on some dimensions. Computing alpha first changed both the method and how I describe the results.
- **Make the scorer explain itself.** A score with a quoted reason can be checked. A bare number can't. The reasons are also how I found the scorer's failure modes.
- **Every hand-picked number was too extreme.** Every penalty I chose by hand was roughly 2–4× harsher than what people actually gave. Calibrating against real ratings is worth the extra work.
