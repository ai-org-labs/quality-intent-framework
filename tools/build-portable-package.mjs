#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildPortablePackage } from "./qif-portable-lib.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const result = buildPortablePackage(root);
console.log(`Built QIF portable v${result.version}: ${result.files.size} files`);
console.log(result.currentDirectory);
console.log(result.zipPath);
