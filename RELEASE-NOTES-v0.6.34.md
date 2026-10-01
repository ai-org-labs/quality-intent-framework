# QIF v0.6.34

QIF v0.6.34 makes threshold sensitivity executable and auditable.

## Added

- Reviewed lower and upper threshold alternatives around a baseline policy.
- Deterministic replay of the same decision-outcome evidence under every alternative.
- Reproduced action flips, consequence classes, weighted errors, and boundary distances.
- Brittleness summaries and governance routing for insufficient or unstable evidence.
- 18 retained negative cases, bringing the suite to 753 checks across 16 positive package types.

## Boundary

Sensitivity evidence does not optimize, rank, select, or authorize policy.
Stability is not quality, and the tested alternatives do not prove future behavior.

## Verify

```sh
node tools/qif.mjs calibration-report
npm test
```
