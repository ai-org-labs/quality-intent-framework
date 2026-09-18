#!/usr/bin/env node
import process from "node:process";
import { spawnSync } from "node:child_process";

const result = spawnSync(process.execPath, ["tools/qif.mjs", "calibration-readiness"], {
  cwd: process.cwd(),
  encoding: "utf8"
});
const invalidInputResult = spawnSync(process.execPath, [
  "tools/qif.mjs",
  "calibration-readiness",
  "--ledger",
  "examples/quality-gate-package.json"
], {
  cwd: process.cwd(),
  encoding: "utf8"
});

if (result.status !== 0) {
  process.stderr.write(result.stderr || result.stdout);
  process.exitCode = 1;
} else {
  const report = JSON.parse(result.stdout);
  const blockerIds = new Set((report.readiness?.blockers || []).map((item) => item.id));
  const requiredBlockers = ["CRD-ORIGIN", "CRD-SUITE-HEALTH", "CRD-UNCERTAINTY", "CRD-LEARNING"];
  const errors = [];
  if (report.ok !== true) errors.push("expected structurally valid calibration-readiness inputs");
  if (report.evidenceOrigin?.status !== "example-only") errors.push("expected committed examples to remain example-only evidence");
  if (report.readiness?.empiricalCalibrationReady !== false) errors.push("expected example baseline not to claim empirical calibration readiness");
  if (invalidInputResult.status === 0) errors.push("expected package-type mismatch to fail closed");
  for (const blockerId of requiredBlockers) {
    if (!blockerIds.has(blockerId)) errors.push(`expected blocker ${blockerId}`);
  }
  if (!report.readiness?.checks?.find((item) => item.id === "CRD-PAIRS")?.met) {
    errors.push("expected existing gate decision/post-release review pair to be visible");
  }
  if (!report.readiness?.checks?.find((item) => item.id === "CRD-DOMAINS")?.met) {
    errors.push("expected current examples to demonstrate cross-domain structure");
  }
  if (errors.length > 0) {
    process.stderr.write(`${errors.join("\n")}\n`);
    process.exitCode = 1;
  } else {
    console.log(JSON.stringify({
      ok: true,
      message: "Calibration readiness regression passed.",
      evidenceOrigin: report.evidenceOrigin.status,
      empiricalCalibrationReady: report.readiness.empiricalCalibrationReady,
      invalidInputFailsClosed: invalidInputResult.status !== 0,
      blockerIds: Array.from(blockerIds).sort()
    }, null, 2));
  }
}
