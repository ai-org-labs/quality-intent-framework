# QIF v0.8.16 Skill Supply Chain Manifest and Dependency Trust

## Purpose

An Agent Skill is not one prompt. It can include instructions, code, tool
declarations, resources, runtimes, packages, services, models, and operational
tools. v0.8.16 makes those dependencies inspectable and makes hidden dependency
risk visible before a Skill is treated as ready for review.

This package answers five questions:

1. What components make up the Skill?
2. Which typed dependencies does it require or use?
3. Which exact dependency identities were resolved and locked?
4. Where do direct risks occur, and which dependents inherit exposure?
5. Is the package structurally ready for human review, or must governance act?

## Model

```text
Skill Artifact
  -> Skill Components (instruction, code, tool declaration, resource)
  -> Dependency Manifest
       -> Dependency Nodes (skill, package, runtime, service, tool, model)
       -> Typed Edges
       -> Lock Records
       -> Risk Signals
            -> upstream propagation to dependent nodes
  -> Supply Chain Assessment
       -> readiness or Governance Triggers
```

Edges point from a dependent to what it depends on. A risk on a dependency
therefore propagates in the reverse direction to all nodes that depend on it.
The verifier also detects cycles, unresolved required nodes, stale locks,
manifest gaps, and non-reproducible assessment fields.

## Trust Boundary

A digest answers, "Is this the declared byte identity?" A lock answers, "Was
this exact version selected?" Neither answers whether the dependency is safe,
authentic, behaviorally equivalent, trustworthy, permitted, or authorized.
Those conclusions require independent source review, behavioral and security
evaluation, operational evidence, and accountable governance.

The committed example intentionally contains an example-only privileged-tool
risk. Its result is `governance-required`; local verification cannot promote it
to trusted or safe.

## Use

```bash
node tools/qif.mjs new skill-supply-chain
node tools/qif.mjs validate examples/skill-supply-chain-package.json
node tools/validate-skill-supply-chain.mjs my-package.json
```

The package is domain-general and local. It does not scan networks, install
packages, access credentials, integrate a marketplace, elevate trust, grant
permissions, or execute governance decisions.
