#!/usr/bin/env node

// Fixture-based test runner for the QIF verifiers (Roadmap Phase 1).
//
// It proves three things on every `npm test`:
//   1. Positive: the retained valid example packages pass their verifier.
//   2. Negative: each retained invalid fixture under tests/fixtures/ is rejected
//      by its verifier with the expected error. This is the standing evidence
//      that each covered verifier rule actually fires; a rule that is silently
//      weakened or deleted is caught here rather than in production.
//   3. No drift: the committed fixtures are byte-for-byte what the generating
//      source of truth (tools/fixtures/quality-gate-cases.mjs) produces, so the
//      retained corpus can never rot out of sync with the rules it encodes.
//
// The committed JSON corpus is a build artifact: it exists so a second,
// independent verifier implementation (Roadmap Phase 6 conformance) can be
// checked against portable files. Regenerate it with `npm run build-fixtures`.
//
// Usage:
//   node tools/run-fixture-tests.mjs                 # positives + negatives + drift
//   node tools/run-fixture-tests.mjs --emit <dir>    # (re)generate the corpus

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { execFileSync } from "node:child_process";

import { cases as qifPackageCases, spec as qifPackageSpec } from "./fixtures/qif-package-cases.mjs";
import {
  cases as expertJudgmentCases,
  spec as expertJudgmentSpec,
  warningRulesRescoped as expertJudgmentWarningRulesRescoped
} from "./fixtures/expert-judgment-cases.mjs";
import { cases as qualityGateCases, spec as qualityGateSpec } from "./fixtures/quality-gate-cases.mjs";

const projectRoot = process.cwd();
const args = process.argv.slice(2);
const emitIndex = args.indexOf("--emit");
const emitMode = emitIndex >= 0;
const emitDir = emitMode ? args[emitIndex + 1] : null;

const REBUILD_HINT = "run `npm run build-fixtures` to regenerate the committed corpus.";
const fixtureSuites = [
  { ...qifPackageSpec, cases: qifPackageCases },
  {
    ...expertJudgmentSpec,
    cases: expertJudgmentCases,
    rescopedRules: expertJudgmentWarningRulesRescoped
  },
  { ...qualityGateSpec, cases: qualityGateCases }
];

// Positive packages: valid examples that must pass their verifier.
const positivePackages = [
  { validator: "tools/validate-qif.mjs", package: "examples/qif-sample-package.json" },
  { validator: "tools/validate-expert-judgment.mjs", package: "examples/expert-judgment-sample-package.json" },
  { validator: "tools/validate-qif-runtime.mjs", package: "examples/quality-gate-package.json" }
];

function serialize(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

// Single source of truth: mutate the valid base package once per case and
// produce the exact file contents plus the manifest. Both --emit and the
// drift check consume this, so they can never disagree.
function buildSuiteCorpus(suite) {
  const base = JSON.parse(fs.readFileSync(path.resolve(projectRoot, suite.basePackage), "utf8"));
  const files = new Map();
  const negatives = [];
  const seen = new Set();
  for (const testCase of suite.cases) {
    if (seen.has(testCase.id)) {
      throw new Error(`Duplicate fixture case id in ${suite.suiteId}: ${testCase.id}`);
    }
    seen.add(testCase.id);
    const mutated = structuredClone(base);
    testCase.mutate(mutated);
    const file = `${suite.filePrefix}-${testCase.id}.json`;
    files.set(file, serialize(mutated));
    negatives.push({
      file,
      validator: suite.validator,
      rule: testCase.rule,
      expect: "fail",
      errorIncludes: testCase.expect
    });
  }
  const manifest = {
    description: `QIF ${suite.suiteId} negative fixture corpus. Each file is an invalid package that a conformant verifier must reject with an error containing errorIncludes. Generated from tools/fixtures/${suite.filePrefix}-cases.mjs; do not edit by hand.`,
    positives: positivePackages,
    negatives,
    rescopedRules: suite.rescopedRules || []
  };
  files.set("manifest.json", serialize(manifest));
  return { files, negatives };
}

function selectedSuitesForEmit() {
  if (!emitDir) {
    return fixtureSuites;
  }
  const normalized = emitDir.replace(/\/$/, "");
  const exact = fixtureSuites.find((suite) => suite.corpusDir === normalized);
  if (exact) {
    return [exact];
  }
  return fixtureSuites;
}

function runValidator(validator, packagePath) {
  try {
    const stdout = execFileSync("node", [validator, packagePath], {
      cwd: projectRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"]
    });
    return { ok: true, output: stdout };
  } catch (error) {
    return { ok: false, output: `${error.stdout ?? ""}${error.stderr ?? ""}` };
  }
}

// ---- Emit mode: (re)generate the committed corpus and exit ----
if (emitMode) {
  const emitted = [];
  for (const suite of selectedSuitesForEmit()) {
    const { files } = buildSuiteCorpus(suite);
    const outDir = path.resolve(projectRoot, suite.corpusDir);
    fs.rmSync(outDir, { recursive: true, force: true });
    fs.mkdirSync(outDir, { recursive: true });
    for (const [file, content] of files.entries()) {
      fs.writeFileSync(path.join(outDir, file), content);
    }
    emitted.push({ suite: suite.suiteId, files: files.size, dir: suite.corpusDir });
  }
  console.log(JSON.stringify({
    ok: true,
    message: "Wrote fixture corpus files.",
    emitted
  }, null, 2));
  process.exit(0);
}

// ---- Default mode: positives + drift check + negatives against committed corpus ----
const failures = [];
let positivePass = 0;
let negativePass = 0;

for (const entry of positivePackages) {
  const result = runValidator(entry.validator, entry.package);
  if (result.ok) {
    positivePass += 1;
  } else {
    failures.push(`POSITIVE ${entry.package} was expected to pass ${entry.validator} but failed:\n${result.output}`);
  }
}

let totalNegatives = 0;

for (const suite of fixtureSuites) {
  const { files: expectedFiles, negatives } = buildSuiteCorpus(suite);
  totalNegatives += negatives.length;
  const corpusPath = path.resolve(projectRoot, suite.corpusDir);

  // Drift check: committed files must be exactly what the source of truth produces.
  if (!fs.existsSync(corpusPath)) {
    failures.push(`DRIFT committed corpus ${suite.corpusDir} is missing; ${REBUILD_HINT}`);
  } else {
    const onDisk = new Set(fs.readdirSync(corpusPath).filter((name) => name.endsWith(".json")));
    for (const [file, expected] of expectedFiles.entries()) {
      const filePath = path.join(corpusPath, file);
      if (!fs.existsSync(filePath)) {
        failures.push(`DRIFT committed fixture ${suite.corpusDir}/${file} is missing; ${REBUILD_HINT}`);
        continue;
      }
      onDisk.delete(file);
      if (fs.readFileSync(filePath, "utf8") !== expected) {
        failures.push(`DRIFT committed fixture ${suite.corpusDir}/${file} differs from the source of truth; ${REBUILD_HINT}`);
      }
    }
    for (const orphan of onDisk) {
      failures.push(`DRIFT committed corpus has an unexpected file ${suite.corpusDir}/${orphan}; ${REBUILD_HINT}`);
    }
  }

  // Negative checks: run the committed fixture and assert it is rejected as expected.
  for (const entry of negatives) {
    const filePath = path.join(suite.corpusDir, entry.file);
    if (!fs.existsSync(path.resolve(projectRoot, filePath))) {
      // Drift check above already reported the missing file.
      continue;
    }
    const result = runValidator(entry.validator, filePath);
    if (result.ok) {
      failures.push(`NEGATIVE ${suite.suiteId}/${entry.file} (${entry.rule}) was expected to FAIL but the verifier passed.`);
    } else if (!result.output.includes(entry.errorIncludes)) {
      failures.push(`NEGATIVE ${suite.suiteId}/${entry.file} (${entry.rule}) failed, but not with the expected error.\n  expected substring: ${entry.errorIncludes}\n  actual output:\n${result.output}`);
    } else {
      negativePass += 1;
    }
  }
}

const summary = {
  positiveChecks: `${positivePass}/${positivePackages.length}`,
  negativeChecks: `${negativePass}/${totalNegatives}`,
  rulesCovered: totalNegatives,
  failures
};

if (failures.length > 0) {
  console.error(JSON.stringify(summary, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({
  ok: true,
  message: "QIF fixture suite passed: valid packages accepted, committed corpus in sync, every negative fixture rejected with its expected error.",
  ...summary
}, null, 2));
