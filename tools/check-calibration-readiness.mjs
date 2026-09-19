#!/usr/bin/env node
import process from "node:process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
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

const empiricalDir = fs.mkdtempSync(path.join(os.tmpdir(), "qif-origin-"));
const empiricalInputs = [
  ["quality-gate", "examples/quality-gate-package.json", "observed-operational"],
  ["ledger", "examples/qif-ledger-package.json", "observed-operational"],
  ["calibration", "examples/world-model-calibration-package.json", "historical-record"],
  ["pilot-corpus", "examples/world-model-pilot-corpus-package.json", "historical-record"]
].map(([flag, source, originKind]) => {
  const pkg = JSON.parse(fs.readFileSync(source, "utf8"));
  for (const origin of pkg.evidenceOrigins) {
    origin.originKind = originKind;
    origin.sourceArtifact = `records/${pkg.packageId.toLowerCase()}.json`;
    origin.observationWindow = "2026-08-01/2026-08-31";
    origin.environment = "controlled-pilot";
    origin.generatedBy = "pilot recorder";
    origin.verifiedBy = ["independent reviewer"];
    origin.transformationSummary = "Identifiers removed; decision cues and observed outcome retained.";
    origin.status = "verified";
  }
  const target = path.join(empiricalDir, `${flag}.json`);
  fs.writeFileSync(target, `${JSON.stringify(pkg, null, 2)}\n`);
  return [`--${flag}`, target];
});
const empiricalResult = spawnSync(process.execPath, ["tools/qif.mjs", "calibration-readiness", ...empiricalInputs.flat()], {
  cwd: process.cwd(),
  encoding: "utf8"
});

if (result.status !== 0) {
  process.stderr.write(result.stderr || result.stdout);
  process.exitCode = 1;
} else {
  const report = JSON.parse(result.stdout);
  const empiricalReport = empiricalResult.status === 0 ? JSON.parse(empiricalResult.stdout) : null;
  const blockerIds = new Set((report.readiness?.blockers || []).map((item) => item.id));
  const requiredBlockers = ["CRD-ORIGIN", "CRD-SUITE-HEALTH", "CRD-UNCERTAINTY", "CRD-LEARNING"];
  const errors = [];
  if (report.ok !== true) errors.push("expected structurally valid calibration-readiness inputs");
  if (report.evidenceOrigin?.status !== "example-only") errors.push("expected committed examples to remain example-only evidence");
  if (report.readiness?.empiricalCalibrationReady !== false) errors.push("expected example baseline not to claim empirical calibration readiness");
  if (invalidInputResult.status === 0) errors.push("expected package-type mismatch to fail closed");
  if (empiricalResult.status !== 0) errors.push("expected schema-backed empirical Evidence Origins to validate");
  if (empiricalReport?.evidenceOrigin?.status !== "verified-empirical") errors.push("expected observed and historical Evidence Origins to be recognized as verified empirical provenance");
  if (!empiricalReport?.readiness?.checks?.find((item) => item.id === "CRD-ORIGIN")?.met) errors.push("expected CRD-ORIGIN to be structurally satisfiable");
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
      empiricalOriginRecognized: empiricalReport?.evidenceOrigin?.status === "verified-empirical",
      blockerIds: Array.from(blockerIds).sort()
    }, null, 2));
  }
}
fs.rmSync(empiricalDir, { recursive: true, force: true });
