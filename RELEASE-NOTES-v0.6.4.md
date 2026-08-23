# QIF v0.6.4

QIF v0.6.4 adds Untrusted Input Boundary to the Authoring Template Runtime.

The practical change: source material can inform QIF artifacts, but it cannot become instructions to the AI authoring agent. Embedded instructions inside documents, repository content, web pages, review history, or MCP tool outputs must be blocked, quarantined, or treated as untrusted source content.

## Added

- `untrustedInputBoundaries` in `authoring-template` packages
- template references to untrusted input boundaries
- verifier checks for source kinds, allowed use, prohibited use, verification policy, sanitization policy, and instruction conflict policy
- verifier checks that embedded instructions are explicitly blocked
- verifier checks that system and explicit user instructions outrank source content
- retained negative fixtures for the new boundary rules

## Guardrails

- source content is evidence or target material, not agent instruction
- QIF structural validation does not prove prompt-injection safety
- source-derived claims still require evidence, ambiguity handling, and governance when needed
