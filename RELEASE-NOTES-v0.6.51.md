# QIF v0.6.51

## Recovery Observation Windows and Delayed Side-Effect Reconciliation

QIF can now keep interrupted or retried work under a reviewed observation
window instead of treating one immediate check as proof that recovery ended.

This release adds:

- recovery observation policies and bounded observation windows;
- timestamped, full-coverage effect observations;
- reproducible delayed-completion, unresolved-state, and terminal-conflict reconciliation;
- fail-closed closure state and governance routing;
- 15 retained negative fixtures for the new verifier rules; and
- an updated portable AI package for Gemini, Claude, Codex, and other document-context AI systems.

QIF does not stop, resume, retry, compensate, or close operational work. A
valid package does not prove external effect truth, observation completeness,
causality, recovery safety, quality, authorization, or authority.
