# QIF Quality Aspect Taxonomy

## Purpose

Quality Aspects are discovery lenses.

They help humans and AI agents avoid blind spots when discovering Quality Intents. They are not mandatory checklist items, and their presence does not prove that quality has been achieved.

Each aspect must be converted into:

```text
Quality Aspect
-> discovery questions
-> concerns
-> loss boundaries
-> Quality Intents
-> evidence
-> verdict
```

If an aspect cannot be tied to a concern, loss boundary, or evidence need, it should not be used as release evidence.

## Canonical Aspects

| Aspect | Discovery question | Typical concern | Loss boundary example | Evidence example | Anti-pattern |
| --- | --- | --- | --- | --- | --- |
| functional suitability | What must work for the target to be acceptable? | Intended behavior fails. | Required behavior must not fail on protected cases. | Scenario result. | Treating feature presence as proof of outcome protection. |
| business fit | Which business outcome would be harmed even if the mechanism works? | Goal misalignment or unfair tradeoff. | The process must not create unacceptable stakeholder harm. | Stakeholder impact analysis. | Treating revenue or throughput as quality itself. |
| usability | What would a trained but non-expert user misunderstand or miss? | Avoidable user error. | Users must not be led into materially incorrect action. | Task walkthrough. | Treating attractive layout as usability evidence. |
| ux design | Where could the experience create false confidence or hide an important boundary? | Misleading flow or hidden state. | The experience must not obscure important consequences. | Journey review. | Treating visual polish as proof of safe experience. |
| accessibility | Who cannot perceive, understand, navigate, or act on this target? | Excluded user group. | Eligible users must not be excluded from critical action or information. | Accessibility review. | Treating accessibility as optional decoration. |
| performance efficiency | What delay or resource use would make the target unacceptable? | Slow response or excessive effort. | Critical work must not exceed delay or effort tolerance. | Response-time or effort measurement. | Treating average speed as proof that critical cases are protected. |
| scalability | What breaks first if volume doubles? | Capacity limit or manual bottleneck. | Expected growth must not make the process unsafe or unusable. | Load scenario or capacity analysis. | Assuming today's low volume proves tomorrow's adequacy. |
| availability | When must this be available, and what outage is unacceptable? | Unavailable service or missing fallback. | Critical users must not lose access during protected operating windows. | Availability plan or fallback rehearsal. | Treating uptime percentage alone as quality. |
| reliability | Which repeated use would expose inconsistency or drift? | Intermittent failure or state drift. | Repeated protected actions must not produce materially inconsistent outcomes. | Repeatability run. | Treating one successful run as reliability proof. |
| recoverability | How do we return to a known safe state if this goes wrong? | Irreversible state or unclear owner. | Unsafe state must not persist without a demonstrated recovery path. | Rollback rehearsal. | Treating an unrehearsed rollback plan as proof for high risk. |
| security | What authority or data boundary could be crossed? | Unauthorized access or tampering. | Unauthorized parties must not gain access or authority. | Control test or threat review. | Treating authentication presence as proof of authorization safety. |
| privacy | What sensitive information could be exposed or used beyond expectation? | Over-collection or unintended disclosure. | Sensitive information must not be exposed or retained beyond approved purpose. | Data handling review. | Treating consent text as proof that actual data handling is acceptable. |
| data quality | Which decision fails if data is wrong, stale, or incomplete? | Stale data or ambiguous source of truth. | Decisions must not rely on materially incorrect or stale data. | Source reconciliation. | Treating data existence as proof that data is fit for use. |
| operational quality | Who operates this, and what would they need during an abnormal state? | Missing monitoring or runbook gap. | Operators must not be unable to detect or contain harmful states. | Operations rehearsal. | Treating launch completion as operational readiness. |
| maintainability | What would a future maintainer be unable to understand or safely change? | Hidden rationale or fragile dependency. | Future maintenance must not require hidden expert-only knowledge. | Maintainer review. | Treating low defect count as maintainability proof. |
| changeability | Which likely change would be expensive or risky to make? | Coupled process or hard-coded assumption. | Expected changes must not require unsafe workarounds. | Change scenario review. | Treating current correctness as future adaptability. |
| auditability | Can an auditor reconstruct why this was accepted? | Missing rationale or unretained evidence. | Governed decisions must not become impossible to reconstruct. | Traceability link or approval record. | Treating verifier success as semantic truth. |
| compliance | Which rule, contract, or policy would be violated if this passes? | Policy breach or regulatory exposure. | The target must not violate governing obligations. | Obligation mapping. | Treating policy acknowledgement as compliance evidence. |
| safety | What physical, operational, or severe harm could this enable? | Unsafe state or harmful ambiguity. | The target must not enable unacceptable safety exposure. | Hazard analysis. | Treating lack of past incidents as proof of safety. |
| cost efficiency | What cost or rework would make this unacceptable? | Waste or expensive recovery. | The target must not impose disproportionate avoidable cost. | Cost-of-recovery estimate. | Treating low implementation cost as quality. |
| customer impact | Which customer would be harmed or treated unfairly if this passes? | Wrong denial or confusing outcome. | Customers must not absorb unacceptable avoidable harm. | Customer scenario sample. | Treating internal process completion as customer acceptability. |
| brand trust | What would make stakeholders lose trust even if the action is technically allowed? | Opaque decision or perceived unfairness. | The organization must not create unjustifiable trust loss. | Communication review. | Treating legal permissibility as trust acceptability. |
| organizational operability | What depends on expert-only knowledge or unclear ownership? | Training gap or single expert dependency. | The organization must not depend on hidden knowledge for governed operation. | Handoff test. | Treating veteran approval as reproducible organizational knowledge. |

## Usage Rules

- Use aspects to discover concerns, not to declare quality coverage.
- Record why an aspect applies through an `evaluationPerspective`.
- Convert applicable aspects into Quality Intents only when they reveal a concern and loss boundary.
- Link verdicts to evidence. Aspect names alone are not evidence.
- Do not require every aspect for every target. Unused aspects should be omitted from a package.
- For broad reviews, include a coverage perspective that explains which aspect lenses were explored and why.

## Verifier Boundary

The verifier can check that:

- quality aspects use canonical names;
- aspects are explicitly marked `discovery-lens-only`;
- each aspect includes discovery questions, concerns, loss boundaries, evidence examples, and anti-patterns;
- evaluation perspectives reference defined aspects;
- defined aspects are not left unused.

The verifier cannot prove that all relevant risks were semantically discovered. That requires expert review, stakeholder feedback, operational evidence, unseen-case tests, and governance.
