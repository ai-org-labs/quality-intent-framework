# QIF v0.6.36: Escalation Resolution and Timeliness

QIF can now show what happened after a governed escalation route was selected.

This release adds:

- route-complete resolution policies with allowed dispositions, response-time limits, availability requirements, timeout actions, and valid redirects;
- accepted, rejected, redirected, and timed-out resolution records;
- deterministic elapsed-time and response-window verification;
- availability and resolution-evidence checks;
- aggregate resolution assessments and mandatory governance routing;
- 32 retained negative cases, bringing the suite to 813 negative cases across 16 positive package types.

The boundary remains explicit: response time, resolution count, disposition,
and reviewer availability are operational evidence. They do not prove quality,
competence, causality, blame, authority, or semantic truth.
