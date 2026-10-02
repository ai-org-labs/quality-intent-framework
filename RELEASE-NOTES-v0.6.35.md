# QIF v0.6.35

QIF v0.6.35 makes selective escalation explicit, executable, and auditable.

## Added

- Governed proceed, defer, human-review, and specialist-escalation routes.
- Contiguous rules that deterministically select one route from a declared forecast.
- Recommended-versus-actual route records with named authority and execution evidence.
- Route-specific held/failed outcomes and reproducible aggregate summaries.
- Governance for route mismatch, unresolved authority, unverified route evidence, failed escalated outcomes, unreviewed policy, and insufficient data.
- 28 retained negative cases, bringing the suite to 781 checks across 16 positive package types.

## Boundary

Route volume and escalation frequency are workload evidence, not quality.
A later outcome does not prove causality, reviewer competence, blame, or
authority. Verifier success proves declared structure and arithmetic only.

## Verify

~~~sh
node tools/qif.mjs calibration-report
npm test
~~~
