#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";

const examplePackages = [
  "examples/qif-sample-package.json",
  "examples/expert-judgment-sample-package.json",
  "examples/discovery-session-package.json",
  "examples/organizational-quality-culture-package.json",
  "examples/evaluation-target-package.json",
  "examples/review-run-package.json",
  "examples/quality-gate-package.json",
  "examples/qif-ledger-package.json",
  "examples/world-model-review-package.json",
  "examples/world-model-calibration-package.json",
  "examples/world-model-pilot-corpus-package.json",
  "examples/guided-elicitation-package.json",
  "examples/world-model-elicitation-package.json",
  "examples/action-quality-contract-package.json",
  "examples/authoring-template-package.json"
];

const runtimeTypes = new Set([
  "discovery-session",
  "organizational-quality-culture",
  "evaluation-target",
  "review-run",
  "quality-gate"
]);

const validatorsByType = new Map([
  ["qif-package", "tools/validate-qif.mjs"],
  ["expert-judgment", "tools/validate-expert-judgment.mjs"],
  ["qif-ledger", "tools/validate-qif-ledger.mjs"],
  ["world-model-review", "tools/validate-world-model-review.mjs"],
  ["world-model-calibration", "tools/validate-world-model-calibration.mjs"],
  ["world-model-pilot-corpus", "tools/validate-world-model-pilot-corpus.mjs"],
  ["guided-elicitation", "tools/validate-guided-elicitation.mjs"],
  ["world-model-elicitation", "tools/validate-world-model-elicitation.mjs"],
  ["action-quality-contract", "tools/validate-action-quality-contract.mjs"],
  ["authoring-template", "tools/validate-authoring-template.mjs"]
]);

function usage() {
  return `Usage:
  qif validate <package.json...>
  qif validate --all
  qif validate --fixtures
  qif new <package-type> [--out package.json]
  qif trace <entity-id> [package.json...]
  qif trace <entity-id> --all
  qif open-risks [package.json...]
  qif open-risks --all
  qif release-ready <quality-gate-package.json>
  qif doctor [--release-gate quality-gate-package.json]
  qif commands
  qif package-types
  qif status

Options:
  --all       Validate, trace, or list open risks across all committed example packages.
  --fixtures  Run the retained negative fixture regression suite.
`;
}

function commandManifest() {
  return [
    {
      name: "validate",
      usage: "qif validate <package.json...> | qif validate --all | qif validate --fixtures",
      purpose: "Validate QIF package structure through the correct local verifier.",
      arguments: [
        { name: "package.json", required: false, repeatable: true, description: "One or more QIF package files." },
        { name: "--all", required: false, repeatable: false, description: "Validate all committed example packages." },
        { name: "--fixtures", required: false, repeatable: false, description: "Run retained negative fixture regression." }
      ],
      blocking: true,
      output: "Verifier JSON or fixture-suite JSON.",
      verifierBoundary: "validation proves structural integrity only; it does not prove semantic quality truth."
    },
    {
      name: "new",
      usage: "qif new <package-type> [--out package.json]",
      purpose: "Emit a validated starter package shape from committed examples.",
      arguments: [
        { name: "package-type", required: true, repeatable: false, description: "Supported QIF package type." },
        { name: "--out", required: false, repeatable: false, description: "Write output to a new file without overwriting an existing file." }
      ],
      blocking: false,
      output: "Starter package JSON or write confirmation JSON.",
      verifierBoundary: "starter generation preserves shape only; users must replace sample content and validate before relying on it."
    },
    {
      name: "trace",
      usage: "qif trace <entity-id> [package.json...] | qif trace <entity-id> --all",
      purpose: "Find matching entities plus outbound and inbound references.",
      arguments: [
        { name: "entity-id", required: true, repeatable: false, description: "Entity id to inspect." },
        { name: "package.json", required: false, repeatable: true, description: "Packages to search." },
        { name: "--all", required: false, repeatable: false, description: "Search all committed example packages." }
      ],
      blocking: false,
      output: "Trace result JSON.",
      verifierBoundary: "trace visibility is not semantic truth."
    },
    {
      name: "open-risks",
      usage: "qif open-risks [package.json...] | qif open-risks --all",
      purpose: "List unresolved governance triggers, residual-risk carriers, and low-confidence entities.",
      arguments: [
        { name: "package.json", required: false, repeatable: true, description: "Packages to search." },
        { name: "--all", required: false, repeatable: false, description: "Search all committed example packages." }
      ],
      blocking: false,
      output: "Open-risk visibility JSON.",
      verifierBoundary: "open-risks reports structural risk carriers only; it does not prove semantic risk truth, business priority, or remediation sufficiency."
    },
    {
      name: "release-ready",
      usage: "qif release-ready <quality-gate-package.json>",
      purpose: "Run the local release-ready gate through the canonical QIF CLI.",
      arguments: [
        { name: "quality-gate-package.json", required: true, repeatable: false, description: "Quality-gate package to validate and evaluate for release-ready status." }
      ],
      blocking: true,
      output: "Release-ready gate JSON.",
      verifierBoundary: "release-ready checks structural gate readiness only; it does not prove semantic quality truth, business approval correctness, or operational safety."
    },
    {
      name: "doctor",
      usage: "qif doctor [--release-gate quality-gate-package.json]",
      purpose: "Run one repository health check over validation, retained fixtures, release readiness, and open-risk visibility.",
      arguments: [
        { name: "--release-gate", required: false, repeatable: false, description: "Quality-gate package used for release-ready evaluation." }
      ],
      blocking: true,
      output: "Aggregated doctor JSON.",
      verifierBoundary: "doctor aggregates structural QIF checks only; it does not prove semantic quality truth, business approval correctness, operational safety, or risk remediation sufficiency."
    },
    {
      name: "commands",
      usage: "qif commands",
      purpose: "Return the canonical QIF CLI command manifest as machine-readable JSON.",
      arguments: [],
      blocking: false,
      output: "Command manifest JSON.",
      verifierBoundary: "commands describes available local command surfaces only; it does not execute validation or prove repository health."
    },
    {
      name: "package-types",
      usage: "qif package-types",
      purpose: "Return the supported QIF package type catalog as machine-readable JSON.",
      arguments: [],
      blocking: false,
      output: "Package type catalog JSON.",
      verifierBoundary: "package-types describes supported package shapes only; it does not validate a concrete package or prove semantic quality truth."
    },
    {
      name: "status",
      usage: "qif status",
      purpose: "Return one current-state packet for humans and AI agents before acting in this repository.",
      arguments: [],
      blocking: false,
      output: "Runtime status JSON with version, command surface, package catalog, structural health, open-risk summary, roadmap frontier, trend rationale, and verifier boundary.",
      verifierBoundary: "status summarizes local structural signals only; it does not prove semantic quality truth, business approval correctness, operational safety, or roadmap correctness."
    }
  ];
}

function commands() {
  console.log(JSON.stringify({
    ok: true,
    commandSurfaceVersion: 1,
    packageVersion: readJson("package.json").version || "unknown",
    commands: commandManifest(),
    examples: [
      "node tools/qif.mjs validate --all",
      "node tools/qif.mjs trace ACT-AQC-001 --all",
      "node tools/qif.mjs open-risks --all",
      "node tools/qif.mjs release-ready examples/quality-gate-package.json",
      "node tools/qif.mjs doctor",
      "node tools/qif.mjs package-types",
      "node tools/qif.mjs status"
    ],
    verifierBoundary: "command manifest discovery does not execute checks, prove semantic quality truth, or authorize release."
  }, null, 2));
  return 0;
}

const packageTypeDescriptions = new Map([
  ["qif-package", {
    purpose: "Represent core discovered quality intents, risks, evidence, evaluations, governance events, and acceptance gates.",
    lifecycleRole: "core-quality-intent-record"
  }],
  ["expert-judgment", {
    purpose: "Capture expert judgment from concrete cases and derive reusable decision patterns.",
    lifecycleRole: "tacit-knowledge-extraction"
  }],
  ["discovery-session", {
    purpose: "Record raw expert answers, questions, extraction steps, cues, concerns, loss boundaries, and derived quality knowledge.",
    lifecycleRole: "quality-intent-discovery"
  }],
  ["organizational-quality-culture", {
    purpose: "Aggregate repeated decision patterns, loss boundaries, waiver practices, escalation norms, and tradeoffs as context.",
    lifecycleRole: "quality-culture-context"
  }],
  ["evaluation-target", {
    purpose: "Describe the domain-general object being evaluated, including context, stakeholders, impact, and risk summary.",
    lifecycleRole: "target-definition"
  }],
  ["review-run", {
    purpose: "Record application of selected quality intents and decision patterns to a concrete evaluation target.",
    lifecycleRole: "quality-evaluation-run"
  }],
  ["quality-gate", {
    purpose: "Make release or acceptance gate decisions traceable to quality intents, evidence, timing, retention, reports, and governance.",
    lifecycleRole: "release-or-acceptance-gate"
  }],
  ["qif-ledger", {
    purpose: "Link QIF packages across time, package boundaries, lifecycle records, missed intents, and agent outcomes.",
    lifecycleRole: "cross-package-quality-memory"
  }],
  ["world-model-review", {
    purpose: "Check conceptual model, domain model, boundaries, relationships, state, events, invariants, assumptions, and coordinate systems before verdicts.",
    lifecycleRole: "world-model-gap-review"
  }],
  ["world-model-calibration", {
    purpose: "Measure AI and expert agreement on unseen world-model gap findings and route weak calibration to governance.",
    lifecycleRole: "world-model-evaluator-calibration"
  }],
  ["world-model-pilot-corpus", {
    purpose: "Prepare privacy-screened, representative pilot cases for world-model calibration.",
    lifecycleRole: "calibration-corpus-preparation"
  }],
  ["guided-elicitation", {
    purpose: "Guide non-expert users through plain-language, stepwise, anti-checklist discovery questions and comprehension checks.",
    lifecycleRole: "human-centered-quality-discovery"
  }],
  ["world-model-elicitation", {
    purpose: "Converge Level 4 requirements through model hypotheses, discriminating questions, counterexamples, invariants, and closure.",
    lifecycleRole: "level-4-requirements-elicitation"
  }],
  ["action-quality-contract", {
    purpose: "Govern AI agent actions through permissions, approvals, traces, guardrails, context memory, containment, handoff, rollback, and outcome evidence.",
    lifecycleRole: "agent-action-quality-control"
  }],
  ["authoring-template", {
    purpose: "Define machine-readable templates for AI-generated QIF artifacts with input/output contracts, validation, golden cases, and scoring.",
    lifecycleRole: "ai-authoring-control"
  }]
]);

function packageTypes() {
  const templates = templateFilesByType();
  const packageTypes = Array.from(templates.entries()).map(([packageType, template]) => {
    const metadata = packageTypeDescriptions.get(packageType) || {};
    const validator = runtimeTypes.has(packageType) ? "tools/validate-qif-runtime.mjs" : validatorsByType.get(packageType);
    return {
      packageType,
      purpose: metadata.purpose || "Supported QIF package type.",
      lifecycleRole: metadata.lifecycleRole || "unspecified",
      template: displayPath(template),
      validator,
      createCommand: `node tools/qif.mjs new ${packageType}`,
      validateCommand: `node tools/qif.mjs validate ${displayPath(template)}`,
      verifierBoundary: "package type support means the shape has a local validator and starter template; it does not prove that generated content is semantically correct."
    };
  }).sort((a, b) => a.packageType.localeCompare(b.packageType));
  console.log(JSON.stringify({
    ok: true,
    packageTypeCatalogVersion: 1,
    packageVersion: readJson("package.json").version || "unknown",
    packageTypes,
    verifierBoundary: "package type catalog discovery does not validate concrete package content, prove semantic quality truth, or authorize release."
  }, null, 2));
  return 0;
}

function parsedCapturedJson(result) {
  const text = result.stdout || result.stderr;
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function firstMeaningfulLine(text) {
  if (typeof text !== "string") return null;
  return text.split(/\r?\n/).map((line) => line.trim()).find((line) => line.length > 0) || null;
}

function readRoadmapFrontier() {
  const roadmapPath = "docs/qif-roadmap.md";
  if (!fs.existsSync(roadmapPath)) {
    return {
      source: roadmapPath,
      available: false,
      summary: "Roadmap file is missing.",
      nextRecommendedAction: "Restore or author docs/qif-roadmap.md before making roadmap claims."
    };
  }
  const roadmap = fs.readFileSync(roadmapPath, "utf8");
  const currentPosition = roadmap.match(/## Current Position[\s\S]*?(?=\n## )/);
  const phaseMatches = Array.from(roadmap.matchAll(/## Phase [^\n]+/g)).map((match) => match[0].replace(/^## /, ""));
  const nextPhase = phaseMatches.find((phase) => /v0\.7|calibration/i.test(phase)) || phaseMatches[0] || null;
  const weaknessLine = firstMeaningfulLine((currentPosition?.[0] || "").split("Weaknesses:")[1] || "");
  return {
    source: roadmapPath,
    available: true,
    currentPositionVersion: readJson("package.json").version || "unknown",
    nextPhase,
    knownWeakness: weaknessLine,
    futureRoadmapCount: phaseMatches.length,
    nextRecommendedAction: "Use the roadmap frontier and qif open-risks output to select the next smallest release-quality slice."
  };
}

function status() {
  const packageVersion = readJson("package.json").version || "unknown";
  const commandSurface = commandManifest();
  const packageCatalog = Array.from(templateFilesByType().keys()).sort();
  const validation = summarizeCaptured(runNodeCaptured(["tools/qif.mjs", "validate", "--all"]));
  const doctorResult = summarizeCaptured(runNodeCaptured(["tools/qif.mjs", "doctor"]));
  const openRiskResult = runNodeCaptured(["tools/qif.mjs", "open-risks", "--all"]);
  const openRisksParsed = parsedCapturedJson(openRiskResult);
  const releaseGateResult = summarizeCaptured(runNodeCaptured(["tools/qif.mjs", "release-ready", "examples/quality-gate-package.json"]));
  const blockingSignals = [
    validation.ok ? null : "validate-all failed",
    doctorResult.ok ? null : "doctor failed",
    releaseGateResult.ok ? null : "release-ready failed"
  ].filter(Boolean);
  const openRiskCount = typeof openRisksParsed?.riskCount === "number" ? openRisksParsed.riskCount : null;
  const roadmapFrontier = readRoadmapFrontier();
  console.log(JSON.stringify({
    ok: blockingSignals.length === 0,
    statusSurfaceVersion: 1,
    packageVersion,
    generatedAt: new Date().toISOString(),
    commandSurface: {
      count: commandSurface.length,
      commands: commandSurface.map((command) => ({
        name: command.name,
        usage: command.usage,
        blocking: command.blocking,
        verifierBoundary: command.verifierBoundary
      }))
    },
    packageTypes: {
      count: packageCatalog.length,
      packageTypes: packageCatalog
    },
    structuralHealth: {
      validation,
      doctor: doctorResult,
      releaseReady: releaseGateResult,
      blockingSignals
    },
    openRisks: {
      command: openRiskResult.command,
      status: openRiskResult.status,
      ok: openRiskResult.status === 0,
      riskCount: openRiskCount,
      governanceTriggerCount: openRisksParsed?.governanceTriggers?.length ?? null,
      residualRiskCount: openRisksParsed?.residualRisks?.length ?? null,
      lowConfidenceCount: openRisksParsed?.lowConfidence?.length ?? null,
      verifierBoundary: openRisksParsed?.verifierBoundary || "open-risk visibility is structural only."
    },
    roadmapFrontier,
    trendRationale: [
      {
        signal: "Agent frameworks expose tracing, guardrails, sessions, and memory as operational surfaces.",
        qifResponse: "QIF should expose compact machine-readable status before AI agents act."
      },
      {
        signal: "Agent evaluation is moving toward multi-turn traces, tool trajectories, and outcome evidence.",
        qifResponse: "QIF status should summarize validation, release readiness, open risks, and roadmap context together."
      },
      {
        signal: "MCP-style ecosystems emphasize discoverable capabilities and stateless tool surfaces.",
        qifResponse: "QIF commands, package-types, and status make local capability discovery explicit."
      }
    ],
    nextRecommendedAction: blockingSignals.length > 0
      ? "Resolve blocking structural signals before release or pilot use."
      : roadmapFrontier.nextRecommendedAction,
    verifierBoundary: "qif status aggregates local structural evidence and roadmap context only; it does not prove semantic quality truth, business approval correctness, operational safety, or future roadmap correctness."
  }, null, 2));
  return 0;
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new Error(`cannot read JSON at ${filePath}: ${error.message}`);
  }
}

function inferPackageType(pkg, filePath) {
  if (typeof pkg.packageType === "string" && pkg.packageType.trim()) return pkg.packageType;
  if (typeof pkg.qifVersion === "string" && Array.isArray(pkg.missions) && Array.isArray(pkg.qualityIntents)) return "qif-package";
  if (typeof pkg.frameworkVersion === "string" && Array.isArray(pkg.expertJudgments) && Array.isArray(pkg.decisionPatterns)) return "expert-judgment";
  throw new Error(`${filePath} has no supported packageType and did not match a legacy QIF package shape.`);
}

function validatorFor(pkg, filePath) {
  const type = inferPackageType(pkg, filePath);
  const validator = runtimeTypes.has(type) ? "tools/validate-qif-runtime.mjs" : validatorsByType.get(type);
  if (!validator) throw new Error(`${filePath} has unsupported packageType ${type}.`);
  return { type, validator };
}

function runNode(args) {
  const result = spawnSync(process.execPath, args, { stdio: "inherit", cwd: process.cwd() });
  if (result.error) throw result.error;
  return result.status ?? 1;
}

function runNodeCaptured(args) {
  const result = spawnSync(process.execPath, args, {
    cwd: process.cwd(),
    encoding: "utf8"
  });
  if (result.error) throw result.error;
  return {
    command: ["node", ...args].join(" "),
    status: result.status ?? 1,
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim()
  };
}

function validateFile(filePath) {
  const pkg = readJson(filePath);
  const { type, validator } = validatorFor(pkg, filePath);
  const status = runNode([validator, filePath]);
  return { filePath, type, validator, status };
}

function validate(files) {
  const results = [];
  for (const filePath of files) {
    results.push(validateFile(filePath));
  }
  const failures = results.filter((result) => result.status !== 0);
  if (failures.length > 0) return 1;
  console.log(JSON.stringify({
    ok: true,
    message: "QIF CLI validation passed.",
    packages: results.map(({ filePath, type, validator }) => ({ package: filePath, packageType: type, validator }))
  }, null, 2));
  return 0;
}

function optionValue(args, optionName) {
  const index = args.indexOf(optionName);
  if (index === -1) return null;
  const value = args[index + 1];
  if (!value || value.startsWith("--")) throw new Error(`Missing value after ${optionName}.`);
  return value;
}

function templateFilesByType() {
  const templates = new Map();
  for (const filePath of examplePackages) {
    const pkg = readJson(filePath);
    templates.set(inferPackageType(pkg, filePath), filePath);
  }
  return templates;
}

function newPackage(packageType, args) {
  if (!packageType || packageType.startsWith("--")) {
    process.stderr.write(`Missing package type.
${usage()}`);
    return 1;
  }
  const templates = templateFilesByType();
  const source = templates.get(packageType);
  if (!source) {
    process.stderr.write(JSON.stringify({
      ok: false,
      errors: [`Unsupported package type ${packageType}.`],
      supportedPackageTypes: Array.from(templates.keys()).sort()
    }, null, 2));
    process.stderr.write("\n");
    return 1;
  }
  const template = readJson(source);
  const rendered = `${JSON.stringify(template, null, 2)}\n`;
  const outPath = optionValue(args, "--out");
  if (!outPath) {
    process.stdout.write(rendered);
    return 0;
  }
  if (fs.existsSync(outPath)) {
    process.stderr.write(JSON.stringify({
      ok: false,
      errors: [`Refusing to overwrite existing file ${outPath}.`],
      sourceTemplate: displayPath(source)
    }, null, 2));
    process.stderr.write("\n");
    return 1;
  }
  fs.writeFileSync(outPath, rendered);
  console.log(JSON.stringify({
    ok: true,
    message: "QIF starter package written.",
    packageType,
    sourceTemplate: displayPath(source),
    output: displayPath(outPath),
    verifierBoundary: "new emits a validated starter shape from examples; users must still replace sample content and run qif validate before relying on it."
  }, null, 2));
  return 0;
}

function commandFiles(args, options = {}) {
  const files = args.filter((arg) => !arg.startsWith("--"));
  if (args.includes("--all") || (options.defaultToExamples && files.length === 0)) return examplePackages;
  return files;
}

function traceFiles(args) {
  const files = args.filter((arg) => !arg.startsWith("--"));
  if (args.includes("--all") || files.length === 0) return examplePackages;
  return files;
}

function isRefField(key, value) {
  return /Ref$/.test(key) && typeof value === "string" && value.trim().length > 0;
}

function isRefsField(key, value) {
  return /Refs$/.test(key) && Array.isArray(value) && value.some((item) => typeof item === "string" && item.trim().length > 0);
}

function findOutboundRefs(value, prefix = "") {
  const refs = [];
  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      refs.push(...findOutboundRefs(item, `${prefix}[${index}]`));
    });
    return refs;
  }
  if (!value || typeof value !== "object") return refs;
  for (const [key, child] of Object.entries(value)) {
    const field = prefix ? `${prefix}.${key}` : key;
    if (isRefField(key, child)) refs.push({ field, refs: [child] });
    if (isRefsField(key, child)) refs.push({ field, refs: child.filter((item) => typeof item === "string" && item.trim().length > 0) });
    refs.push(...findOutboundRefs(child, field));
  }
  return refs;
}

function displayPath(filePath) {
  const relative = path.relative(process.cwd(), path.resolve(filePath));
  return relative.startsWith("..") ? filePath : relative;
}

function collectEntities(pkg, filePath) {
  const packageType = inferPackageType(pkg, filePath);
  const packagePath = displayPath(filePath);
  const entities = [];
  if (typeof pkg.id === "string") {
    entities.push({
      package: packagePath,
      packageType,
      collection: "$package",
      id: pkg.id,
      entity: pkg,
      outboundRefs: findOutboundRefs(pkg)
    });
  }
  for (const [collection, value] of Object.entries(pkg)) {
    if (!Array.isArray(value)) continue;
    value.forEach((item, index) => {
      if (!item || typeof item !== "object" || typeof item.id !== "string" || !item.id.trim()) return;
      entities.push({
        package: packagePath,
        packageType,
        collection,
        index,
        id: item.id,
        entity: item,
        outboundRefs: findOutboundRefs(item)
      });
    });
  }
  return entities;
}

function traceEntity(query, files) {
  const entities = [];
  const warnings = [];
  for (const filePath of files) {
    try {
      entities.push(...collectEntities(readJson(filePath), filePath));
    } catch (error) {
      warnings.push({ package: filePath, warning: error.message });
    }
  }
  const matches = entities.filter((entity) => entity.id === query);
  if (matches.length === 0) {
    process.stderr.write(JSON.stringify({
      ok: false,
      query,
      errors: [`No entity with id ${query} was found in the provided QIF packages.`],
      searchedPackages: files.map(displayPath),
      warnings
    }, null, 2));
    process.stderr.write("\n");
    return 1;
  }
  const inboundRefs = entities.flatMap((source) => source.outboundRefs.flatMap((outboundRef) => {
    if (!outboundRef.refs.includes(query)) return [];
    return [{
      package: source.package,
      packageType: source.packageType,
      collection: source.collection,
      id: source.id,
      field: outboundRef.field
    }];
  }));
  console.log(JSON.stringify({
    ok: true,
    query,
    matches: matches.map((match) => ({
      package: match.package,
      packageType: match.packageType,
      collection: match.collection,
      id: match.id,
      entity: match.entity,
      outboundRefs: match.outboundRefs,
      inboundRefs
    })),
    warnings
  }, null, 2));
  return warnings.length > 0 ? 1 : 0;
}

function issueText(entity) {
  return entity.reason || entity.triggerReason || entity.rationale || entity.summary || entity.description || entity.residualRisk || "";
}

function isClosedStatus(status) {
  if (typeof status !== "string") return false;
  return new Set(["closed", "resolved", "retired", "accepted", "rejected", "inactive", "obsolete", "superseded"]).has(status.toLowerCase());
}

function riskSeverity(entity) {
  return entity.severity || entity.riskSeverity || entity.riskClass || "unspecified";
}

function collectRiskCarriers(files) {
  const entities = [];
  const warnings = [];
  for (const filePath of files) {
    try {
      entities.push(...collectEntities(readJson(filePath), filePath));
    } catch (error) {
      warnings.push({ package: filePath, warning: error.message });
    }
  }
  return { entities, warnings };
}

function entitySummary(entity) {
  return {
    package: entity.package,
    packageType: entity.packageType,
    collection: entity.collection,
    id: entity.id,
    status: entity.entity.status || "unspecified"
  };
}

function openRisks(files) {
  const { entities, warnings } = collectRiskCarriers(files);
  const governanceTriggers = entities
    .filter((entity) => entity.collection === "governanceTriggers" && !isClosedStatus(entity.entity.status))
    .map((entity) => ({
      ...entitySummary(entity),
      triggerType: entity.entity.triggerType || entity.entity.type || "unspecified",
      severity: riskSeverity(entity.entity),
      reason: issueText(entity.entity),
      owner: entity.entity.owner || entity.entity.assignedOwner || "unspecified"
    }));
  const residualRisks = entities
    .filter((entity) => typeof entity.entity.residualRisk === "string" && entity.entity.residualRisk.trim().length > 0 && !isClosedStatus(entity.entity.status))
    .map((entity) => ({
      ...entitySummary(entity),
      severity: riskSeverity(entity.entity),
      residualRisk: entity.entity.residualRisk
    }));
  const lowConfidence = entities
    .filter((entity) => typeof entity.entity.confidence === "number" && entity.entity.confidence < 0.6 && !isClosedStatus(entity.entity.status))
    .map((entity) => ({
      ...entitySummary(entity),
      confidence: entity.entity.confidence,
      severity: riskSeverity(entity.entity),
      reason: issueText(entity.entity)
    }));
  const riskCount = governanceTriggers.length + residualRisks.length + lowConfidence.length;
  console.log(JSON.stringify({
    ok: true,
    message: "QIF open risk extraction completed.",
    riskCount,
    searchedPackages: files.map(displayPath),
    governanceTriggers,
    residualRisks,
    lowConfidence,
    verifierBoundary: "open-risks reports structural risk carriers only; it does not prove semantic risk truth, business priority, or remediation sufficiency.",
    warnings
  }, null, 2));
  return warnings.length > 0 ? 1 : 0;
}

function releaseReady(args) {
  const files = args.filter((arg) => !arg.startsWith("--"));
  const [filePath] = files;
  if (!filePath || files.length !== 1) {
    process.stderr.write(`release-ready requires exactly one quality-gate package path.
${usage()}`);
    return 1;
  }
  return runNode(["tools/qif-release-ready-hook.mjs", filePath]);
}

function summarizeCaptured(result) {
  const text = result.stdout || result.stderr;
  let parsed = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch {
    parsed = null;
  }
  return {
    command: result.command,
    status: result.status,
    ok: result.status === 0,
    parsed
  };
}

function doctor(args) {
  const releaseGatePath = optionValue(args, "--release-gate") || "examples/quality-gate-package.json";
  const checks = [
    {
      name: "validate-all",
      blocking: true,
      result: summarizeCaptured(runNodeCaptured(["tools/qif.mjs", "validate", "--all"]))
    },
    {
      name: "fixture-regression",
      blocking: true,
      result: summarizeCaptured(runNodeCaptured(["tools/qif.mjs", "validate", "--fixtures"]))
    },
    {
      name: "release-ready",
      blocking: true,
      result: summarizeCaptured(runNodeCaptured(["tools/qif.mjs", "release-ready", releaseGatePath]))
    },
    {
      name: "open-risk-visibility",
      blocking: false,
      result: summarizeCaptured(runNodeCaptured(["tools/qif.mjs", "open-risks", "--all"]))
    }
  ];
  const blockingFailures = checks.filter((check) => check.blocking && !check.result.ok);
  console.log(JSON.stringify({
    ok: blockingFailures.length === 0,
    message: blockingFailures.length === 0 ? "QIF doctor checks passed." : "QIF doctor found blocking structural failures.",
    releaseGatePackage: displayPath(releaseGatePath),
    checks,
    blockingFailures: blockingFailures.map((check) => check.name),
    verifierBoundary: "doctor aggregates structural QIF checks only; it does not prove semantic quality truth, business approval correctness, operational safety, or risk remediation sufficiency."
  }, null, 2));
  return blockingFailures.length === 0 ? 0 : 1;
}

function main() {
  const [command, ...args] = process.argv.slice(2);
  if (!command || command === "help" || command === "--help" || command === "-h") {
    process.stdout.write(usage());
    return 0;
  }
  if (command === "validate") {
    if (args.includes("--fixtures")) return runNode(["tools/run-fixture-tests.mjs"]);
    const files = commandFiles(args);
    if (files.length === 0) {
      process.stderr.write(`Missing package path.
${usage()}`);
      return 1;
    }
    return validate(files);
  }
  if (command === "new") {
    const [packageType] = args.filter((arg) => !arg.startsWith("--"));
    return newPackage(packageType, args);
  }
  if (command === "trace") {
    const [query, ...traceArgs] = args.filter((arg) => !arg.startsWith("--"));
    if (!query) {
      process.stderr.write(`Missing entity id.
${usage()}`);
      return 1;
    }
    return traceEntity(query, traceFiles(traceArgs.concat(args.filter((arg) => arg.startsWith("--")))));
  }
  if (command === "open-risks") {
    return openRisks(commandFiles(args, { defaultToExamples: true }));
  }
  if (command === "release-ready") {
    return releaseReady(args);
  }
  if (command === "doctor") {
    return doctor(args);
  }
  if (command === "commands") {
    return commands();
  }
  if (command === "package-types") {
    return packageTypes();
  }
  if (command === "status") {
    return status();
  }
  process.stderr.write(`Unsupported command: ${command}
${usage()}`);
  return 1;
}

try {
  process.exitCode = main();
} catch (error) {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
}
