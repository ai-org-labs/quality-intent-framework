#!/usr/bin/env node
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildPortablePackage, verifyPortablePackage } from "./qif-portable-lib.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const temp = fs.mkdtempSync(path.join(os.tmpdir(), "qif-portable-test-"));

try {
  const built = buildPortablePackage(root, temp);
  verifyPortablePackage(root, temp);

  fs.appendFileSync(path.join(built.currentDirectory, "START_HERE.md"), "\nstale mutation\n");
  let rejected = false;
  try {
    verifyPortablePackage(root, temp);
  } catch (error) {
    rejected = /stale or modified/.test(error.message);
  }
  if (!rejected) throw new Error("Portable verification accepted a modified file.");
  console.log("Portable mutation rejection passed.");
} finally {
  fs.rmSync(temp, { recursive: true, force: true });
}
