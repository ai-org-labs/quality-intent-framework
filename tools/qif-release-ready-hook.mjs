#!/usr/bin/env node
import fs from "node:fs";
import process from "node:process";
import { spawnSync } from "node:child_process";

function usage() {
  return `Usage:
  node tools/qif-release-ready-hook.mjs <quality-gate-package.json>

This local reference hook exits 0 only when the package validates and contains
at least one accountable Go or Conditional Go quality-gate decision.
`;
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new Error(`cannot read JSON at ${filePath}: ${error.message}`);
  }
}

function validatePackage(filePath) {
  const result = spawnSync(process.execPath, ["tools/qif.mjs", "validate", filePath], {
    cwd: process.cwd(),
    encoding: "utf8"
  });
  return {
    ok: result.status === 0,
    status: result.status ?? 1,
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim()
  };
}

function nonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function hasItems(value) {
  return Array.isArray(value) && value.length > 0;
}

function normalizeDecision(value) {
  return typeof value === "string" ? value.toLowerCase().replace(/\s+/g, "-") : "";
}

function decisionReadiness(decision) {
  const normalized = normalizeDecision(decision.decision);
  const errors = [];
  if (!["go", "conditional-go"].includes(normalized)) {
    errors.push(`decision must be Go or Conditional Go, got ${decision.decision || "missing"}.`);
  }
  if (!nonEmptyString(decision.approvalOwner)) errors.push("approvalOwner is required.");
  if (!nonEmptyString(decision.rollbackPlan)) errors.push("rollbackPlan is required.");
  if (!nonEmptyString(decision.monitoringPlan)) errors.push("monitoringPlan is required.");
  if (!hasItems(decision.gateRuleRefs)) errors.push("gateRuleRefs are required.");
  if (!hasItems(decision.intentVerdicts)) errors.push("intentVerdicts are required.");
  if (normalized === "conditional-go" && !hasItems(decision.conditions)) {
    errors.push("Conditional Go requires at least one condition.");
  }
  if (normalized === "go" && hasItems(decision.residualRisks)) {
    errors.push("Go must not carry unresolved residualRisks; use Conditional Go or resolve them.");
  }
  return { decisionId: decision.id || "unknown", releaseReady: errors.length === 0, errors };
}

function evaluate(filePath) {
  const validation = validatePackage(filePath);
  const pkg = readJson(filePath);
  const errors = [];
  if (!validation.ok) errors.push("quality-gate package validation failed.");
  if (pkg.packageType !== "quality-gate") errors.push(`packageType must be quality-gate, got ${pkg.packageType || "missing"}.`);
  const decisions = Array.isArray(pkg.qualityGateDecisions) ? pkg.qualityGateDecisions : [];
  if (decisions.length === 0) errors.push("at least one qualityGateDecision is required.");
  const decisionResults = decisions.map(decisionReadiness);
  const readyDecisions = decisionResults.filter((result) => result.releaseReady);
  if (readyDecisions.length === 0) errors.push("no release-ready Go or Conditional Go qualityGateDecision was found.");
  return {
    ok: validation.ok && errors.length === 0,
    package: filePath,
    packageType: pkg.packageType || "missing",
    releaseReady: validation.ok && errors.length === 0,
    readyDecisionRefs: readyDecisions.map((result) => result.decisionId),
    decisionResults,
    validation: {
      ok: validation.ok,
      status: validation.status
    },
    errors,
    verifierBoundary: "release-ready hook checks structural gate readiness only; it does not prove semantic quality truth, business approval correctness, or operational safety."
  };
}

function main() {
  const [filePath] = process.argv.slice(2);
  if (!filePath || filePath.startsWith("--")) {
    process.stderr.write(usage());
    return 1;
  }
  const result = evaluate(filePath);
  const stream = result.ok ? process.stdout : process.stderr;
  stream.write(`${JSON.stringify(result, null, 2)}
`);
  return result.ok ? 0 : 1;
}

try {
  process.exitCode = main();
} catch (error) {
  process.stderr.write(`${error.message}
`);
  process.exitCode = 1;
}
