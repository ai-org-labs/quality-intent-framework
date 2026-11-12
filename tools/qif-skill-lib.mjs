import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { createDeterministicZip } from "./qif-portable-lib.mjs";

const SKILL_SOURCE = ".agents/skills/quality-intent-framework";
const MAX_SKILL_FILES = 500;
const MAX_FILE_BYTES = 25 * 1024 * 1024;
const MAX_ZIP_BYTES = 50 * 1024 * 1024;

function sha256(content) {
  return crypto.createHash("sha256").update(content).digest("hex");
}

function listFiles(root, directory, predicate = () => true, prefix = "") {
  const base = path.join(root, directory, prefix);
  if (!fs.existsSync(base)) return [];
  const files = [];
  for (const entry of fs.readdirSync(base, { withFileTypes: true })) {
    const relative = path.join(prefix, entry.name);
    if (entry.isDirectory()) files.push(...listFiles(root, directory, predicate, relative));
    else if (predicate(relative)) files.push(path.join(directory, relative).split(path.sep).join("/"));
  }
  return files.sort();
}

function readVersion(root) {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  if (!/^\d+\.\d+\.\d+$/.test(pkg.version ?? "")) {
    throw new Error(`package.json has an invalid version: ${pkg.version}`);
  }
  return pkg.version;
}

function descriptors(root) {
  const sourceFiles = listFiles(root, SKILL_SOURCE);
  const runtimeFiles = [
    "package.json",
    "README.md",
    "CHANGELOG.md",
    ...listFiles(root, "portable"),
    ...listFiles(root, "docs", (name) => name.endsWith(".md")),
    ...listFiles(root, "schemas", (name) => name.endsWith(".json")),
    ...listFiles(root, "examples", (name) => name.endsWith(".json")),
    ...listFiles(root, "tools", (name) => name.endsWith(".mjs") && !name.startsWith("fixtures/"))
  ];

  return [
    ...sourceFiles.map((source) => ({ source, target: source.slice(`${SKILL_SOURCE}/`.length) })),
    ...runtimeFiles.map((source) => ({ source, target: `runtime/${source}` }))
  ].sort((a, b) => a.target.localeCompare(b.target));
}

export function expectedQifSkillPackage(root) {
  const version = readVersion(root);
  const files = new Map();
  const entries = [];

  for (const descriptor of descriptors(root)) {
    const sourcePath = path.join(root, descriptor.source);
    if (!fs.existsSync(sourcePath)) throw new Error(`QIF skill source does not exist: ${descriptor.source}`);
    const content = fs.readFileSync(sourcePath);
    if (content.length > MAX_FILE_BYTES) throw new Error(`QIF skill file exceeds 25 MB: ${descriptor.target}`);
    files.set(descriptor.target, content);
    entries.push({
      path: descriptor.target,
      source: descriptor.source,
      bytes: content.length,
      sha256: sha256(content)
    });
  }

  const manifest = {
    formatVersion: 1,
    package: "quality-intent-framework-agent-skill",
    skillName: "quality-intent-framework",
    version,
    generatedBy: "tools/build-qif-skill.mjs",
    entryCount: entries.length,
    boundaries: {
      isAutonomousAgent: false,
      provesSemanticTruth: false,
      grantsExecutionAuthority: false,
      grantsApprovalAuthority: false
    },
    entries
  };
  files.set("QIF_SKILL_MANIFEST.json", Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`));

  const sums = [...files.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([file, content]) => `${sha256(content)}  ${file}`)
    .join("\n");
  files.set("SHA256SUMS", Buffer.from(`${sums}\n`));

  if (files.size > MAX_SKILL_FILES) {
    throw new Error(`QIF skill exceeds the 500-file Agent Skills upload limit: ${files.size}`);
  }
  return { version, files, manifest };
}

function writeDirectory(directory, files) {
  fs.rmSync(directory, { recursive: true, force: true });
  for (const [relativePath, content] of files) {
    const target = path.join(directory, relativePath);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  }
}

function listRelativeFiles(directory, prefix = "") {
  const result = [];
  for (const entry of fs.readdirSync(path.join(directory, prefix), { withFileTypes: true })) {
    const relative = path.join(prefix, entry.name);
    if (entry.isDirectory()) result.push(...listRelativeFiles(directory, relative));
    else result.push(relative.split(path.sep).join("/"));
  }
  return result.sort();
}

function verifyDirectory(directory, expectedFiles) {
  if (!fs.existsSync(directory)) throw new Error(`QIF skill directory is missing: ${directory}`);
  const expectedNames = [...expectedFiles.keys()].sort();
  const actualNames = listRelativeFiles(directory);
  if (JSON.stringify(actualNames) !== JSON.stringify(expectedNames)) {
    throw new Error(`QIF skill file inventory is stale in ${directory}`);
  }
  for (const [relativePath, expectedContent] of expectedFiles) {
    const actual = fs.readFileSync(path.join(directory, relativePath));
    if (!actual.equals(expectedContent)) throw new Error(`QIF skill file is stale or modified: ${relativePath}`);
  }
}

export function buildQifSkill(root, distRoot = path.join(root, "dist")) {
  const expected = expectedQifSkillPackage(root);
  const releaseName = `qif-agent-skill-v${expected.version}`;
  const versionedDirectory = path.join(distRoot, releaseName, "quality-intent-framework");
  const currentDirectory = path.join(distRoot, "qif-agent-skill-current", "quality-intent-framework");
  fs.mkdirSync(distRoot, { recursive: true });
  writeDirectory(versionedDirectory, expected.files);
  writeDirectory(currentDirectory, expected.files);

  const zip = createDeterministicZip(expected.files, "quality-intent-framework");
  if (zip.length > MAX_ZIP_BYTES) throw new Error(`QIF skill zip exceeds the 50 MB upload limit: ${zip.length}`);
  const zipPath = path.join(distRoot, `${releaseName}.zip`);
  fs.writeFileSync(zipPath, zip);
  fs.writeFileSync(`${zipPath}.sha256`, `${sha256(zip)}  ${path.basename(zipPath)}\n`);
  return { ...expected, versionedDirectory, currentDirectory, zipPath, zipBytes: zip.length };
}

export function verifyQifSkill(root, distRoot = path.join(root, "dist")) {
  const expected = expectedQifSkillPackage(root);
  const releaseName = `qif-agent-skill-v${expected.version}`;
  verifyDirectory(path.join(distRoot, releaseName, "quality-intent-framework"), expected.files);
  verifyDirectory(path.join(distRoot, "qif-agent-skill-current", "quality-intent-framework"), expected.files);

  const expectedZip = createDeterministicZip(expected.files, "quality-intent-framework");
  const zipPath = path.join(distRoot, `${releaseName}.zip`);
  if (!fs.existsSync(zipPath) || !fs.readFileSync(zipPath).equals(expectedZip)) {
    throw new Error(`QIF skill zip is missing, stale, or non-deterministic: ${zipPath}`);
  }
  const expectedSum = `${sha256(expectedZip)}  ${path.basename(zipPath)}\n`;
  if (fs.readFileSync(`${zipPath}.sha256`, "utf8") !== expectedSum) {
    throw new Error(`QIF skill zip checksum is missing or stale: ${zipPath}.sha256`);
  }
  return { version: expected.version, fileCount: expected.files.size, zipPath, zipBytes: expectedZip.length };
}
