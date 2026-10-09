import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const PORTABLE_FILES = [
  "START_HERE.md",
  "SYSTEM_INSTRUCTIONS.md",
  "QIF_CORE.md",
  "USE_CASES.md",
  "OUTPUT_TEMPLATE.json"
];

const CANONICAL_DOCS = [
  "docs/AI_AUTHORING_GUIDE.md",
  "docs/qif-operational-framework.md",
  "docs/qif-pre-implementation-review.md",
  "docs/qif-negative-acceptance.md",
  "docs/qif-quality-aspect-taxonomy.md",
  "docs/qif-guided-elicitation-design.md",
  "docs/qif-v0.3-discovery-layer-design.md",
  "docs/qif-v0.5.5-world-model-elicitation.md",
  "docs/qif-v0.6.0-action-quality-contract.md",
  "docs/expert-judgment-framework.md"
];

function sha256(content) {
  return crypto.createHash("sha256").update(content).digest("hex");
}

function listJsonFiles(root, directory) {
  return fs.readdirSync(path.join(root, directory))
    .filter((name) => name.endsWith(".json"))
    .sort()
    .map((name) => `${directory}/${name}`);
}

function sourceDescriptors(root) {
  return [
    ...PORTABLE_FILES.map((name) => ({ source: `portable/${name}`, target: name })),
    ...CANONICAL_DOCS.map((source) => ({ source, target: source })),
    ...listJsonFiles(root, "schemas").map((source) => ({ source, target: source })),
    ...listJsonFiles(root, "examples").map((source) => ({ source, target: source }))
  ].sort((a, b) => a.target.localeCompare(b.target));
}

function readVersion(root) {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  if (!/^\d+\.\d+\.\d+$/.test(pkg.version ?? "")) {
    throw new Error(`package.json has an invalid version: ${pkg.version}`);
  }
  return pkg.version;
}

export function expectedPortablePackage(root) {
  const version = readVersion(root);
  const files = new Map();
  const entries = [];

  for (const descriptor of sourceDescriptors(root)) {
    const sourcePath = path.join(root, descriptor.source);
    if (!fs.existsSync(sourcePath)) {
      throw new Error(`Portable source does not exist: ${descriptor.source}`);
    }
    let content = fs.readFileSync(sourcePath);
    if (descriptor.source === "portable/OUTPUT_TEMPLATE.json") {
      content = Buffer.from(
        content.toString("utf8").replace("VERSION_REPLACED_AT_BUILD", version)
      );
    }
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
    package: "quality-intent-framework-portable",
    version,
    generatedBy: "tools/build-portable-package.mjs",
    startHere: "START_HERE.md",
    entryCount: entries.length,
    boundaries: {
      isAgent: false,
      isCompleteRuntime: false,
      provesSemanticTruth: false,
      grantsAuthority: false
    },
    entries
  };
  const manifestContent = Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`);
  files.set("MANIFEST.json", manifestContent);

  const sums = [...files.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([file, content]) => `${sha256(content)}  ${file}`)
    .join("\n");
  files.set("SHA256SUMS", Buffer.from(`${sums}\n`));

  return { version, files, manifest };
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

export function createDeterministicZip(files, rootDirectory) {
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  for (const [relativePath, content] of [...files.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const name = Buffer.from(`${rootDirectory}/${relativePath.replaceAll(path.sep, "/")}`);
    const checksum = crc32(content);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0, 6);
    local.writeUInt16LE(0, 8);
    local.writeUInt16LE(0, 10);
    local.writeUInt16LE(33, 12);
    local.writeUInt32LE(checksum, 14);
    local.writeUInt32LE(content.length, 18);
    local.writeUInt32LE(content.length, 22);
    local.writeUInt16LE(name.length, 26);
    local.writeUInt16LE(0, 28);
    localParts.push(local, name, content);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0, 8);
    central.writeUInt16LE(0, 10);
    central.writeUInt16LE(0, 12);
    central.writeUInt16LE(33, 14);
    central.writeUInt32LE(checksum, 16);
    central.writeUInt32LE(content.length, 20);
    central.writeUInt32LE(content.length, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt16LE(0, 30);
    central.writeUInt16LE(0, 32);
    central.writeUInt16LE(0, 34);
    central.writeUInt16LE(0, 36);
    central.writeUInt32LE(0, 38);
    central.writeUInt32LE(offset, 42);
    centralParts.push(central, name);
    offset += local.length + name.length + content.length;
  }

  const centralDirectory = Buffer.concat(centralParts);
  const end = Buffer.alloc(22);
  const fileCount = files.size;
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(0, 4);
  end.writeUInt16LE(0, 6);
  end.writeUInt16LE(fileCount, 8);
  end.writeUInt16LE(fileCount, 10);
  end.writeUInt32LE(centralDirectory.length, 12);
  end.writeUInt32LE(offset, 16);
  end.writeUInt16LE(0, 20);
  return Buffer.concat([...localParts, centralDirectory, end]);
}

function writeDirectory(directory, files) {
  fs.rmSync(directory, { recursive: true, force: true });
  for (const [relativePath, content] of files) {
    const target = path.join(directory, relativePath);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  }
}

export function buildPortablePackage(root, distRoot = path.join(root, "dist")) {
  const expected = expectedPortablePackage(root);
  const versionedName = `qif-portable-v${expected.version}`;
  const versionedDirectory = path.join(distRoot, versionedName);
  const currentDirectory = path.join(distRoot, "qif-portable-current");
  fs.mkdirSync(distRoot, { recursive: true });
  writeDirectory(versionedDirectory, expected.files);
  writeDirectory(currentDirectory, expected.files);

  const zip = createDeterministicZip(expected.files, versionedName);
  const zipPath = path.join(distRoot, `${versionedName}.zip`);
  fs.writeFileSync(zipPath, zip);
  fs.writeFileSync(`${zipPath}.sha256`, `${sha256(zip)}  ${path.basename(zipPath)}\n`);
  return { ...expected, versionedDirectory, currentDirectory, zipPath };
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
  if (!fs.existsSync(directory)) throw new Error(`Portable directory is missing: ${directory}`);
  const expectedNames = [...expectedFiles.keys()].sort();
  const actualNames = listRelativeFiles(directory);
  if (JSON.stringify(actualNames) !== JSON.stringify(expectedNames)) {
    throw new Error(`Portable file inventory is stale in ${directory}`);
  }
  for (const [relativePath, expectedContent] of expectedFiles) {
    const actual = fs.readFileSync(path.join(directory, relativePath));
    if (!actual.equals(expectedContent)) {
      throw new Error(`Portable file is stale or modified: ${relativePath}`);
    }
  }
}

export function verifyPortablePackage(root, distRoot = path.join(root, "dist")) {
  const expected = expectedPortablePackage(root);
  const versionedName = `qif-portable-v${expected.version}`;
  verifyDirectory(path.join(distRoot, versionedName), expected.files);
  verifyDirectory(path.join(distRoot, "qif-portable-current"), expected.files);

  const expectedZip = createDeterministicZip(expected.files, versionedName);
  const zipPath = path.join(distRoot, `${versionedName}.zip`);
  if (!fs.existsSync(zipPath) || !fs.readFileSync(zipPath).equals(expectedZip)) {
    throw new Error(`Portable zip is missing, stale, or non-deterministic: ${zipPath}`);
  }
  const expectedSum = `${sha256(expectedZip)}  ${path.basename(zipPath)}\n`;
  if (fs.readFileSync(`${zipPath}.sha256`, "utf8") !== expectedSum) {
    throw new Error(`Portable zip checksum is missing or stale: ${zipPath}.sha256`);
  }
  return { version: expected.version, fileCount: expected.files.size, zipPath };
}
