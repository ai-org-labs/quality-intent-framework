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
  qif trace <entity-id> [package.json...]
  qif trace <entity-id> --all

Options:
  --all       Validate or trace across all committed example packages.
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
  if (command === "trace") {
    const [query, ...traceArgs] = args.filter((arg) => !arg.startsWith("--"));
    if (!query) {
      process.stderr.write(`Missing entity id.
${usage()}`);
      return 1;
    }
    return traceEntity(query, traceFiles(traceArgs.concat(args.filter((arg) => arg.startsWith("--")))));
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
