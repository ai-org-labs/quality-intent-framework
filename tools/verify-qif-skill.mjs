#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import { verifyQifSkill } from "./qif-skill-lib.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const result = verifyQifSkill(root);
console.log(`Verified QIF Agent Skill v${result.version}: ${result.fileCount} files, ${result.zipBytes} zip bytes`);
console.log(result.zipPath);
