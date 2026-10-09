# Decision Record: DEC-MV1KDAER-JPKB4S

- Record Format Version: 1.0.0
- Created At: 2026-10-09T22:55:41.043Z
- Canonical Markdown Path: .aof/decisions/DEC-MV1KDAER-JPKB4S.md

## Scope
- Record Format Version: 1.0.0
- Created At: 2026-10-09T22:55:41.043Z
- Canonical Markdown Path: .aof/decisions/DEC-MV1KDAER-JPKB4S.md
- Scope: concept-approval
- Stage: clarification
- Organization: Civic Studio

## Input
- Request: QIFをGemini、Claude、Codexその他のAIへ単独配布できる、版番号付きのポータブルAIパッケージとして生成する。START_HERE、システム指示、中核QIF規約、用途別入口、出力テンプレート、必要schema/example、manifestとhashを含み、リポジトリの正本から決定論的に再生成・検証できること。以後npm testとリリース工程で常に現行versionのpackageを出力し、文書だけで完全なQIF Runtimeや意味的真実が得られるとは主張しない。
- Need: 対象はQIFリポジトリの正本から生成するポータブルAIパッケージ、生成器、検証器、npm test統合、README、AI Authoring Guide、roadmap、release artifactである。Google Drive等へ展開してAIへ読ませられるvendor-neutralな文書・schema・exampleを含める。UI、外部クラウド連携、Gemini固有API、完全なQIF Runtime、意味的真実の保証は対象外。
- Intent: 成功は、package.jsonのversionに同期したdist/qif-portable-currentと版付きzipを決定論的に生成し、manifestの収録元とSHA-256を検証でき、npm testがstale・欠落・改変を失敗させ、初見のAIがSTART_HEREから評価または品質項目定義を開始でき、リリースに最新zipが添付されること。
- Context: context: 対象はQIFリポジトリの正本から生成するポータブルAIパッケージ、生成器、検証器、npm test統合、README、AI Authoring Guide、roadmap、release artifactである。Google Drive等へ展開してAIへ読ませられるvendor-neutralな文書・schema・exampleを含める。UI、外部クラウド連携、Gemini固有API、完全なQIF Runtime、意味的真実の保証は対象外。 | success: 成功は、package.jsonのversionに同期したdist/qif-portable-currentと版付きzipを決定論的に生成し、manifestの収録元とSHA-256を検証でき、npm testがstale・欠落・改変を失敗させ、初見のAIがSTART_HEREから評価または品質項目定義を開始でき、リリースに最新zipが添付されること。
- Existing Artifacts Reviewed: none
- Background or Prior Decisions: clarification completed in session SESS-MV1KCAQI-OQO7KY
- Clarifications or Assumptions: Which service touchpoint or environment should this redesign cover, and what should stay out of scope? => 対象はQIFリポジトリの正本から生成するポータブルAIパッケージ、生成器、検証器、npm test統合、README、AI Authoring Guide、roadmap、release artifactである。Google Drive等へ展開してAIへ読ませられるvendor-neutralな文書・schema・exampleを含める。UI、外部クラウド連携、Gemini固有API、完全なQIF Runtime、意味的真実の保証は対象外。 / How should improvement success be judged: which metric or end state matters most? => 成功は、package.jsonのversionに同期したdist/qif-portable-currentと版付きzipを決定論的に生成し、manifestの収録元とSHA-256を検証でき、npm testがstale・欠落・改変を失敗させ、初見のAIがSTART_HEREから評価または品質項目定義を開始でき、リリースに最新zipが添付されること。
- Clarification Summary Optional: runtime captured first-round clarification answers and can proceed to need validation
- Unresolved Ambiguity Optional: 

## Options Considered
- Option A: Create need validation artifacts before planning
- Option B: Advance directly to planning
- Option C: Stop until more evidence exists

## Decision
- Selected Option: Create need validation artifacts before planning
- Decision Summary: Clarification has produced a usable frame, but planning must wait for need validation and project charter evidence.

## Governance
- Governance Model: council-of-three
- Decision Makers: strategy-lead-01 (Visionary), risk-reviewer-01 (Guardian)
- Governance Rule Applied: majority-with-guardian-veto
- Veto Used: No

## Rationale
- Why this option: A framed request is not yet a validated need, so project creation and planning remain gated.
- Why other options were not selected: Direct planning would bypass the need validation policy, and stopping completely would discard a usable frame.
- Policy priorities applied: value > safety > quality > speed > cost
- Policy tradeoffs accepted: speed is deferred until the underlying problem and value claim are validated

## Execution
- Actions: write problem statement and value hypothesis artifacts
- Actions: record alternatives and any required experiment
- Actions: produce a need validation record and project charter before planning
- Expected Artifact: need validation artifact set and project charter
- Expected Outcome: planning only starts after a validated need exists
- Completion Criteria: approved need validation record and project charter are linked into the session
- Success Criteria: the next planning step is grounded in a validated need rather than a raw request
- Completion Approval Scope: concept-approval
- Success Evaluation Scope: need validation gate review

## Forecast Optional
- Forecast Required: false
- Forecast Summary: not required before need validation completes
- Uncertainty Notes: the stated request may still be reframed, deferred, or rejected

## Actor Notes Optional
- Actor Performance Notes: not evaluated yet
- Capacity Notes: not evaluated yet
- Fit Notes: Visionary and Guardian judgment is required before Builder-led planning begins
- Protocol Thread ID: SESS-MV1KCAQI-OQO7KY

## Routing Optional
- Routing Mode: deep-path
- Max Retries: 2
- Escalation Target: human-maintainer
- Context Snapshot ID: CTX-MV1KDAEM-YBD12Q

## Review
- Change Trigger: clarification answers completed the initial frame
- Review Trigger: when a need validation record and project charter are produced
- Review Date or Condition: before planning starts
- Re-open Conditions: weak evidence, invalid value hypothesis, missing alternatives, or rejected project recommendation

## Escalation Optional
- Escalation Status: none
- Escalation Summary: none
- Approval Outcome Status: none
- Guardian Veto Used Optional: none
- Escalation Resolution: none
- Escalation Resolution Note: none

---

Project Note:
This generic starter keeps the same runtime shell but uses a non-AIDLC workflow.
