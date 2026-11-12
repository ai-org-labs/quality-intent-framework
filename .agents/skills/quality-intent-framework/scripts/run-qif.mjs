#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));

function hasRuntime(directory) {
  return Boolean(directory) && fs.existsSync(path.join(directory, "tools", "qif.mjs"));
}

function findRuntime() {
  const candidates = [];
  if (process.env.QIF_ROOT) candidates.push(path.resolve(process.env.QIF_ROOT));
  candidates.push(
    path.resolve(scriptDirectory, "..", "runtime"),
    path.resolve(scriptDirectory, "..", "..", ".."),
    path.resolve(scriptDirectory, "..", "..", "..", "..")
  );

  let current = process.cwd();
  while (true) {
    candidates.push(current);
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }

  return [...new Set(candidates)].find(hasRuntime) || null;
}

const runtime = findRuntime();
if (!runtime) {
  process.stderr.write(
    "QIF runtime not found. Use the built skill bundle, run inside a QIF source/portable directory, or set QIF_ROOT.\n"
  );
  process.exit(2);
}

const result = spawnSync(process.execPath, [path.join(runtime, "tools", "qif.mjs"), ...process.argv.slice(2)], {
  cwd: runtime,
  stdio: "inherit"
});

if (result.error) {
  process.stderr.write(`QIF CLI failed to start: ${result.error.message}\n`);
  process.exit(2);
}
process.exit(result.status ?? 1);
