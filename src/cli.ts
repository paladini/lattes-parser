import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import {
  DEFAULT_BACKUP_DIR,
  listBackups,
  restoreBackup,
  restoreLatestBackup,
} from "./backup/store.js";
import { readCurriculum } from "./io/read-curriculum.js";
import { writeCurriculum } from "./io/write-curriculum.js";
import { getCurriculumValue, setCurriculumValue } from "./patch/paths.js";

function usage(): never {
  console.error(`Usage:
  lattes-toolkit init [dir]
  lattes-toolkit parse <file.xml|zip> [--json|--summary]
  lattes-toolkit get <file> <path>
  lattes-toolkit set <file> <path> <value>
  lattes-toolkit serialize <file.json> -o <out.xml>
  lattes-toolkit backup list [dir]
  lattes-toolkit restore [--last|<backup-id>] [dir]`);
  process.exit(1);
}

async function loadCurriculumFromFile(filePath: string) {
  const buf = await readFile(filePath);
  return readCurriculum(buf);
}

async function main(): Promise<void> {
  const [, , cmd, ...rest] = process.argv;
  if (!cmd) {
    usage();
  }

  if (cmd === "init") {
    const dir = path.resolve(rest[0] ?? ".");
    await mkdir(path.join(dir, DEFAULT_BACKUP_DIR), { recursive: true });
    console.log(`Initialized ${path.join(dir, DEFAULT_BACKUP_DIR)}`);
    return;
  }

  if (cmd === "parse") {
    const file = rest[0];
    if (!file) {
      usage();
    }
    const cv = await loadCurriculumFromFile(file);
    if (rest.includes("--json")) {
      console.log(JSON.stringify(cv, null, 2));
      return;
    }
    const summary = {
      id: cv.id,
      name: cv.identification.fullName,
      updatedAt: cv.updatedAt,
      articles: cv.bibliographicProduction.journalArticles.length,
      advisoriesCompleted: cv.advisories.completed.length,
    };
    console.log(JSON.stringify(summary, null, 2));
    return;
  }

  if (cmd === "get") {
    const [file, fieldPath] = rest;
    if (!file || !fieldPath) {
      usage();
    }
    const cv = await loadCurriculumFromFile(file);
    console.log(JSON.stringify(getCurriculumValue(cv, fieldPath), null, 2));
    return;
  }

  if (cmd === "set") {
    const [file, fieldPath, ...valueParts] = rest;
    if (!file || !fieldPath || valueParts.length === 0) {
      usage();
    }
    const valueRaw = valueParts.join(" ");
    let value: unknown = valueRaw;
    if (valueRaw.startsWith("{") || valueRaw.startsWith("[")) {
      value = JSON.parse(valueRaw);
    }
    const cv = await loadCurriculumFromFile(file);
    setCurriculumValue(cv, fieldPath, value);
    await writeCurriculum(cv, file);
    console.log(`Updated ${fieldPath} in ${file}`);
    return;
  }

  if (cmd === "serialize") {
    const jsonPath = rest[0];
    const outIndex = rest.indexOf("-o");
    const outPath = outIndex >= 0 ? rest[outIndex + 1] : undefined;
    if (!jsonPath || !outPath) {
      usage();
    }
    const cv = JSON.parse(await readFile(jsonPath, "utf8"));
    await writeCurriculum(cv, outPath);
    console.log(`Wrote ${outPath}`);
    return;
  }

  if (cmd === "backup") {
    const sub = rest[0];
    if (sub === "list") {
      const dir = path.resolve(rest[1] ?? ".", DEFAULT_BACKUP_DIR);
      const items = await listBackups(dir);
      console.log(JSON.stringify(items, null, 2));
      return;
    }
    usage();
  }

  if (cmd === "restore") {
    const useLast = rest.includes("--last");
    const positional = rest.filter((a) => a !== "--last");
    const workspaceDir = useLast
      ? path.resolve(positional[0] ?? ".")
      : path.resolve(positional[1] ?? ".");
    const backupRoot = path.join(workspaceDir, DEFAULT_BACKUP_DIR);
    if (useLast) {
      const target = await restoreLatestBackup(backupRoot);
      console.log(`Restored ${target}`);
      return;
    }
    const backupId = positional[0];
    if (!backupId) {
      usage();
    }
    const target = await restoreBackup(backupRoot, backupId);
    console.log(`Restored ${target}`);
    return;
  }

  usage();
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
