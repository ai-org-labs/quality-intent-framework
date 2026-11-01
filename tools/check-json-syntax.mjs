import fs from "node:fs";
import path from "node:path";

const roots = ["schemas", "examples"];
const files = ["package.json", "portable/OUTPUT_TEMPLATE.json"];

function collectJsonFiles(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) collectJsonFiles(target);
    else if (entry.isFile() && entry.name.endsWith(".json")) files.push(target);
  }
}

for (const root of roots) collectJsonFiles(root);

const failures = [];
for (const file of files.sort()) {
  try {
    JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    failures.push(`${file}: ${error.message}`);
  }
}

if (failures.length > 0) {
  console.error(JSON.stringify({ ok: false, checked: files.length, failures }, null, 2));
  process.exit(1);
}

console.log(JSON.stringify({ ok: true, checked: files.length, message: "Canonical JSON syntax is valid." }, null, 2));
