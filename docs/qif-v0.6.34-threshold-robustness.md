# QIF v0.6.34 Threshold Robustness

## Purpose

A decision can look certain only because one threshold was chosen. v0.6.34
shows whether the same evidence would produce a different action under nearby,
stakeholder-reviewed alternatives.

## Plain-Language Flow

```text
Same forecast and observed outcome
              |
              v
Baseline threshold plus reviewed lower and upper alternatives
              |
              v
Replay every pair without changing the evidence
              |
              v
Show action flips, consequence changes, and boundary distance
              |
              v
Stable or brittle? -> accountable governance
```

## What Is Recorded

- one consequence policy and its baseline Decision Consequences;
- at least two reviewed alternatives, including one below and one above the baseline;
- every pair-by-alternative replay;
- the distance between each forecast and tested threshold;
- action-flip count, flipped pairs, flip rate, and nearest boundary;
- reviewed brittleness limits, signal, and governance triggers.

## Boundary

The analysis does not discover an optimal threshold. It does not rank, select,
or authorize policy. A stable result is evidence about the tested alternatives,
not proof of quality, future stability, or correctness.

## Example

The example forecast is `0.70`. It proceeds at the baseline `0.65` and lower
alternative `0.60`, but defers at `0.75`. The action therefore flips in one of
two replays, and the nearest boundary is `0.05` away. Because the sample is also
insufficient, the signal is `insufficient-and-brittle` and governance remains open.

## Verify

```sh
node tools/qif.mjs calibration-report
npm test
```
