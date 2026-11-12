#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skillRoot = path.join(root, ".agents", "skills", "quality-intent-framework");
const skillPath = path.join(skillRoot, "SKILL.md");
const errors = [];

function listFiles(directory) {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...listFiles(target));
    else files.push(target);
  }
  return files;
}

if (!fs.existsSync(skillPath)) errors.push("SKILL.md is missing.");
else {
  const content = fs.readFileSync(skillPath, "utf8");
  const lines = content.split(/\r?\n/);
  const frontmatter = content.match(/^---\n([\s\S]*?)\n---\n/);
  if (!frontmatter) errors.push("SKILL.md YAML frontmatter is missing.");
  else {
    const name = frontmatter[1].match(/^name:\s*(.+)$/m)?.[1]?.trim();
    const description = frontmatter[1].match(/^description:\s*(.+)$/m)?.[1]?.trim();
    const version = frontmatter[1].match(/^\s*version:\s*"?([^"\n]+)"?$/m)?.[1]?.trim();
    const packageVersion = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8")).version;
    if (name !== path.basename(skillRoot)) errors.push("Skill name must match its parent directory.");
    if (!name || name.length > 64 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
      errors.push("Skill name violates the Agent Skills naming rules.");
    }
    if (!description || description.length > 1024) errors.push("Skill description must be 1-1024 characters.");
    if (!/Use when|when /i.test(description || "")) errors.push("Skill description must state when to use the skill.");
    if (version !== packageVersion) errors.push(`Skill metadata version ${version} does not match package ${packageVersion}.`);
  }
  if (lines.length > 500) errors.push(`SKILL.md exceeds the recommended 500-line limit: ${lines.length}.`);
  if (/\bTODO\b|\[TODO/.test(content)) errors.push("SKILL.md contains unfinished TODO text.");
  for (const required of ["Need", "Intent", "Context", "loss boundary", "semantic truth", "authority"]) {
    if (!content.toLowerCase().includes(required.toLowerCase())) errors.push(`SKILL.md is missing boundary term: ${required}.`);
  }
  for (const match of content.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    if (/^[a-z]+:/i.test(match[1])) continue;
    const linked = path.resolve(skillRoot, match[1].split("#")[0]);
    if (!fs.existsSync(linked)) errors.push(`SKILL.md link target is missing: ${match[1]}`);
  }
}

if (fs.existsSync(skillRoot)) {
  const skillFiles = listFiles(skillRoot);
  const manifests = skillFiles.filter((file) => path.basename(file).toLowerCase() === "skill.md");
  if (manifests.length !== 1) errors.push(`Skill bundle must contain exactly one SKILL.md; found ${manifests.length}.`);
  const openaiPath = path.join(skillRoot, "agents", "openai.yaml");
  if (!fs.existsSync(openaiPath)) errors.push("agents/openai.yaml is missing.");
  else if (!fs.readFileSync(openaiPath, "utf8").includes("$quality-intent-framework")) {
    errors.push("agents/openai.yaml default_prompt must mention $quality-intent-framework.");
  }
}

if (errors.length > 0) {
  process.stderr.write(`${JSON.stringify({ ok: false, errors }, null, 2)}\n`);
  process.exit(1);
}
console.log(JSON.stringify({
  ok: true,
  message: "QIF Agent Skill source follows the checked Agent Skills structure and QIF boundaries.",
  skill: path.relative(root, skillRoot),
  verifierBoundary: "This checks declared structure, metadata, links, version alignment, and required QIF boundary language; it does not prove routing quality, semantic correctness, cross-client behavior, or authority."
}, null, 2));
