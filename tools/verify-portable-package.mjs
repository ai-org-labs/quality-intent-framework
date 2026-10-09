#!/usr/bin/env node
import path from "node:path";
import { fileURLToPath } from "node:url";
import { verifyPortablePackage } from "./qif-portable-lib.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const result = verifyPortablePackage(root);
console.log(`Verified QIF portable v${result.version}: ${result.fileCount} files`);
console.log(result.zipPath);
