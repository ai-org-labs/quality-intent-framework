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

Options:
  --all       Validate all committed example packages through their routed validators.
  --fixtures  Run the retained negative fixture regression suite.
`;
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

function main() {
  const [command, ...args] = process.argv.slice(2);
  if (!command || command === "help" || command === "--help" || command === "-h") {
    process.stdout.write(usage());
    return 0;
  }
  if (command !== "validate") {
    process.stderr.write(`Unsupported command: ${command}
${usage()}`);
    return 1;
  }
  if (args.includes("--fixtures")) {
    return runNode(["tools/run-fixture-tests.mjs"]);
  }
  const files = args.includes("--all") ? examplePackages : args.filter((arg) => !arg.startsWith("--"));
  if (files.length === 0) {
    process.stderr.write(`Missing package path.
${usage()}`);
    return 1;
  }
  return validate(files);
}

try {
  process.exitCode = main();
} catch (error) {
  process.stderr.write(`${error.message}
`);
  process.exitCode = 1;
}
