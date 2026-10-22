---
title: "The battery model that heated up a parked car"
description: "Building a power-limit simulator for Spartan Racing's battery, and why the data, the validation, and one physics symmetry mattered more than tuning the model."
date: 2026-10-22
tags: ["spartan-racing", "battery", "modeling", "validation"]
draft: true
---

<!-- DRAFT: needs Spartan Racing's OK before publishing. Kept to the general story on purpose: no VCU code details, parameter values, run IDs, raw temps/power figures, or pack specifics. -->

Our battery pack sat idle for 40 minutes and its temperature didn't move. Our thermal model said it should have climbed almost 40 °C.

I was building a tool on top of that model for Spartan Racing, and fixing it was only the first problem. Most of the rest were in the data.

## The question

Our car's battery management system (BMS) shuts the car down if the average cell temperature hits 60 °C. That ends the run. The main thing we control to stay under it is the power limit (PL), the cap on how much power the car can pull from the pack. Lower PL means less current, less heat, and slower laps.

My assignment was one question: *if we predict we'll hit 65 °C, what PL gets us to 59 °C?*

## The simulator

The idea is simple:

1. Take a real logged run and its current, second by second.
2. Pick a lower PL and cap the current at PL ÷ pack voltage at every moment.
3. Run that current through a thermal model to predict the temperature and its peak.
4. Bisect to find the highest PL whose predicted peak stays under the target.

The first version used the team's existing thermal model. It beat the naive "temperature stays the same" guess, but it under-predicted the peak on every run I checked, sometimes by close to 10 °C. That's the dangerous direction to be wrong in.

## The model had a fake heat source

The old model had a constant heat term that made up about 60% of all its heat, whether the car was moving or not. Two weird things came out of that:

- Cutting the PL barely changed the predicted peak, because most of the heat didn't depend on current.
- Slower laps made the run *hotter*, because the constant heat had more time to add up.

The idle test from the top of this post is what settled it: about 1 °C a minute of heating with no current flowing. Removing that term cut the idle error from 3.0 °C to 0.2 °C.

If a model can't get "nothing is happening" right, more tuning won't fix it.

## Then the data

This took longer than any modeling.

**Labels lied.** Some logs were filed under the wrong battery pack. Physics gave it away: divide pack voltage by cell voltage and you get a cell count, and for some logs it didn't match the pack the folder said. Voltage can't be mislabeled. Folder names can.

**One broken channel meant more.** When I found one sensor channel decoding wrong, the cause turned out to affect others too, including current and state of charge. A bad state-of-charge reading was quietly failing a validity check and chopping runs into pieces too short to use. Now when something changes upstream I check every channel, not just the one that looked off.

**Every dropped log got a reason.** I kept a manifest: one spreadsheet listing every log, whether it's used, and why not (wrong pack, duplicate, BMS not logging, throttle cut, logger dropout, not heating). Five "different" files turned out to be byte-identical copies.

<!-- TODO (needs team OK): add more of the data-cleanup detail here if the team is fine with it. -->

## Doing validation properly

I only had 18 usable runs, so it was easy to fool myself. The rules I used:

- **Lock a test set.** The competition data was held out the whole time and scored once at the end. The code refuses to score it without a saved model choice, and refuses to score it twice.
- **Hold out whole runs, not laps.** Lap 3 starts where lap 2 ended, so holding out one lap leaks the answer.
- **Also hold out whole days.** Runs on the same day share weather and setup.
- **Tune only on the practice scores.** Tweaking until the test looks good turns the test into training data.
- **Train the way it's used.** The simulator always knows the real current, so I trained the models to predict whole runs from it. The old training predicted 30–60 s ahead assuming current stayed constant, which punished any model that reacted quickly.
- **Pick the candidates ahead of time.** The old model, a one-node model without the fake heat, and a two-node model: a small, fast layer the sensors actually feel, sitting on top of the slow pack mass.

## The fit that "wouldn't converge"

The two-node fits kept failing to converge, and a bigger search budget made it *worse*. Searching on a log scale helped a little. Multiple restarts didn't. Then I switched to differential evolution, and every seed reached the same loss, with completely different parameters. One seed's heat capacities were twice another's.

The ratios between parameters matched to three digits. That was the clue. Multiply every heat capacity and every heat input by k, divide every thermal resistance by k, and the predicted temperatures don't change at all. The data can't tell the absolute scale, so no optimizer could have found "the" answer.

The fix was to pin the pack's heat capacity to its physical value, computed from cell mass and specific heat. After that every fit converged, and a unit test now checks the symmetry so nobody else spends weeks on it.

## Results

Predicting runs and days the model never saw:

| | Old model | One-node | **Two-node** |
|---|---:|---:|---:|
| Peak error, unseen runs | 3.76 °C | 2.95 °C | **1.05 °C** |
| Peak error, unseen days | 4.19 °C | 4.37 °C | **1.47 °C** |
| Worst under-prediction | −7.7 °C | −6.0 °C | **−2.0 °C** |
| Warming speed vs. real | 0.73 | 0.77 | **0.97** |

On the locked test set, scored once, the two-node model missed the peaks by under 1 °C on average. The old model missed by about 5 °C.

With the new model, lowering the PL actually lowers the peak, even after counting the slower laps. The extra time adds back less than half the heat the cut removes.

## Mistakes I made

- I modeled the power limit from an assumption instead of reading the control code. When I finally read it, the limit applied at a different point than I'd assumed, and fixing it doubled the predicted effect of a PL cut. I'd also asked the team a question that code I already had would have answered.
- My first filter for picking the right pack used a voltage cutoff that would have thrown out a real run at low charge.
- I found a few single-sample glitches in one day's data *after* the final test. I left them alone instead of refitting, so the test stayed honest.

## What I learned

1. Trust physics over labels.
2. If a model fails an idle test, the structure is wrong, not the tuning.
3. "Won't converge" can mean "can't be determined." Check whether your parameters are identifiable before blaming the optimizer.
4. Hold out whole runs, lock the test set, and tune only on practice scores.
5. Read the actual control code before you model the controller.

## Still open

No logged run has reached 60 °C yet, so predictions right at the fault limit are still an extrapolation, and I'd keep a 1–2 °C margin. Next is logging hot runs cleanly and testing the frozen model on them before any refit.
