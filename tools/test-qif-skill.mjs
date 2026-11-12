#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { buildQifSkill, verifyQifSkill } from "./qif-skill-lib.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "qif-skill-test-"));

try {
  const built = buildQifSkill(root, temp);
  verifyQifSkill(root, temp);

  const wrapper = path.join(built.currentDirectory, "scripts", "run-qif.mjs");
  const commandResult = spawnSync(process.execPath, [wrapper, "commands"], { encoding: "utf8" });
  if (commandResult.status !== 0) {
    throw new Error(`Built skill could not run qif commands: ${commandResult.stderr || commandResult.stdout}`);
  }
  const commands = JSON.parse(commandResult.stdout);
  if (!commands.ok || !commands.commands?.some((command) => command.name === "validate")) {
    throw new Error("Built skill QIF command manifest is incomplete.");
  }

  const validateResult = spawnSync(process.execPath, [wrapper, "validate", "examples/qif-sample-package.json"], {
    encoding: "utf8"
  });
  if (validateResult.status !== 0) {
    throw new Error(`Built skill could not validate a QIF package: ${validateResult.stderr || validateResult.stdout}`);
  }

  fs.appendFileSync(path.join(built.currentDirectory, "SKILL.md"), "\nstale mutation\n");
  let rejected = false;
  try {
    verifyQifSkill(root, temp);
  } catch (error) {
    rejected = /stale or modified/.test(error.message);
  }
  if (!rejected) throw new Error("QIF skill verification accepted a modified SKILL.md.");
  console.log("QIF Agent Skill command, package validation, and mutation rejection tests passed.");
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
