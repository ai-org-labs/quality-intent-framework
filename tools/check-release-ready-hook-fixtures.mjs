#!/usr/bin/env node
import process from "node:process";
import { spawnSync } from "node:child_process";

function run(args) {
  const result = spawnSync(process.execPath, ["tools/qif.mjs", "release-ready", ...args], {
    cwd: process.cwd(),
    encoding: "utf8"
  });
  return {
    status: result.status ?? 1,
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim()
  };
}

function parseOutput(result) {
  const text = result.stdout || result.stderr;
  return JSON.parse(text);
}

const checks = [
  {
    name: "valid quality gate is release-ready",
    result: run(["examples/quality-gate-package.json"]),
    expectStatus: 0,
    expectReleaseReady: true
  },
  {
    name: "non quality-gate package fails closed",
    result: run(["examples/review-run-package.json"]),
    expectStatus: 1,
    expectReleaseReady: false
  }
];

const failures = [];
for (const check of checks) {
  let parsed;
  try {
    parsed = parseOutput(check.result);
  } catch (error) {
    failures.push(`${check.name}: output was not JSON: ${error.message}`);
    continue;
  }
  if (check.result.status !== check.expectStatus) {
    failures.push(`${check.name}: expected status ${check.expectStatus}, got ${check.result.status}.`);
  }
  if (parsed.releaseReady !== check.expectReleaseReady) {
    failures.push(`${check.name}: expected releaseReady ${check.expectReleaseReady}, got ${parsed.releaseReady}.`);
  }
}

if (failures.length > 0) {
  console.error(JSON.stringify({
    ok: false,
    message: "QIF release-ready hook fixture checks failed.",
    failures
  }, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({
    ok: true,
    message: "QIF release-ready hook fixture checks passed.",
    entrypoint: "qif release-ready",
    checks: checks.map((check) => check.name)
  }, null, 2));
}
