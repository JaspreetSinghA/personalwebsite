---
title: "Our hottest cells weren't our hottest cells"
description: "How a derating-model error on Spartan Racing's electric race car traced back to thermistors reading fuselink heat, and the telemetry checks that came out of it."
date: 2026-10-19
tags: ["spartan-racing", "bms", "embedded", "case-study"]
draft: true
---

<!-- DRAFT: built from resume bullets. Before publishing, confirm with the team what's OK to share, swap in real numbers/plots, and flip draft to false. -->

I work on electronics and software for [Spartan Racing](https://www.sjsuformulasae.com/), San José State's Formula SAE Electric team. Most of my time goes into the vehicle control unit (VCU) and the battery management system (BMS). This post covers one investigation from that work.

## The problem

The VCU derates motor power as the battery pack heats up. On hard runs the derating model's peak-temperature error was much larger than we assumed.

<!-- TODO: plot of peak cell temp vs. time for a hard run, with the derating threshold marked. -->

## Investigation

- **Find the outliers.** A few sensors consistently read hotter than the rest of the pack. That pattern pointed to something about where those sensors were, not the cells themselves.
- **Check the physical layout.** Those thermistors sat next to fuselinks. Under high current the fuselinks heat up, so those sensors were measuring fuselink heating, not cell temperature.
- **Measure what the model was missing.** Once we separated fuselink heat from cell heat, the gap was obvious: the model predicted about half the real warming. When the pack rose 8–10 °C, it said about 4 °C.
- **Then fix it.** A retrained two-node thermal model ([more on that here](/blog/power-limit-simulator/)) cut the mean peak-temperature miss from **3.76 °C to 1.05 °C**.

<!-- TODO: photo or diagram of the segment showing thermistor and fuselink placement (if shareable). -->

## What changed

- **Post-run telemetry checks.** I wrote checks that run in **under 1 second per log** and flag BMS logging failures, dead sensors, and throttle cuts. They're now part of the team's data pipeline, so problems like this come up after every run instead of weeks later.
- **A derating test plan.** I used what we learned to write the derating test plan for the next event.

## What I learned

<!-- TODO: 2–3 sentences in your own words, e.g. why it pays to check sensor placement before you trust a model, what you'd do differently. -->

## Next

I'm now writing SPI and CAN bus drivers for the team's custom VCU, and studying the BMS slave board: ADBMS6830B cell monitoring, balancing, thermistors, and isoSPI.
