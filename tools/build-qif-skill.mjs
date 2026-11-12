#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildQifSkill } from "./qif-skill-lib.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const result = buildQifSkill(root);
console.log(`Built QIF Agent Skill v${result.version}: ${result.files.size} files, ${result.zipBytes} zip bytes`);
console.log(result.currentDirectory);
console.log(result.zipPath);
