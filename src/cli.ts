import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import {
  listBackups,
  resolveBackupSettings,
  restoreBackup,
  restoreLatestBackup,
} from "./backup/store.js";
import { diffCurricula, formatCurriculumDiff } from "./diff/diff-curriculum.js";
import { readCurriculum } from "./io/read-curriculum.js";
import { writeCurriculum } from "./io/write-curriculum.js";
import { applyCurriculumPatches } from "./patch/apply-patches.js";
import { getCurriculumValue, setCurriculumValue } from "./patch/paths.js";
import { requireSectionsFromPatchPaths } from "./serialize/sync-document.js";
import { validateCurriculumXml } from "./validate/validate-curriculum.js";

function usage(): never {
  console.error(`Usage:
  lattes-toolkit init [dir]
  lattes-toolkit parse <file.xml|zip> [--json|--summary]
  lattes-toolkit get <file> <path>
  lattes-toolkit set <file> <path> <value>
  lattes-toolkit serialize <file.json> -o <out.xml>
  lattes-toolkit backup list [dir]
  lattes-toolkit restore [--last|<backup-id>] [dir]
  lattes-toolkit validate <file.xml> [--dtd [file.dtd]]
  lattes-toolkit patch <file.xml> <patches.json>
  lattes-toolkit diff <before.xml> <after.xml>`);
  process.exit(1);
}

function parseValidateArgs(rest: string[]): {
  file?: string;
  dtd: boolean;
  dtdPath?: string;
} {
  let dtd = false;
  let dtdPath: string | undefined;
  const positional: string[] = [];
  for (let i = 0; i < rest.length; i++) {
    const arg = rest[i];
    if (arg === "--dtd") {
      dtd = true;
      const next = rest[i + 1];
      if (next && !next.startsWith("-")) {
        dtdPath = next;
        i += 1;
      }
      continue;
    }
    positional.push(arg);
  }
  return { file: positional[0], dtd, dtdPath };
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
    const { backupRoot } = await resolveBackupSettings(dir);
    await mkdir(backupRoot, { recursive: true });
    console.log(`Initialized ${backupRoot}`);
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
    await writeCurriculum(cv, file, {
      sections: requireSectionsFromPatchPaths([fieldPath]),
    });
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
      const workspace = path.resolve(rest[1] ?? ".");
      const { backupRoot } = await resolveBackupSettings(workspace);
      const items = await listBackups(backupRoot);
      console.log(JSON.stringify(items, null, 2));
      return;
    }
    usage();
  }

  if (cmd === "validate") {
    const parsed = parseValidateArgs(rest);
    if (!parsed.file) {
      usage();
    }
    const xml = await readFile(parsed.file, "latin1");
    const result = validateCurriculumXml(xml, {
      xmlPath: path.resolve(parsed.file),
      dtd: parsed.dtd,
      dtdPath: parsed.dtdPath,
    });
    if (result.skipped) {
      console.log(JSON.stringify({ skipped: true, reason: result.reason }, null, 2));
      process.exit(0);
    }
    console.log(JSON.stringify({ valid: result.valid, errors: result.errors }, null, 2));
    process.exit(result.valid ? 0 : 1);
  }

  if (cmd === "diff") {
    const [beforeFile, afterFile] = rest;
    if (!beforeFile || !afterFile) {
      usage();
    }
    const before = await loadCurriculumFromFile(beforeFile);
    const after = await loadCurriculumFromFile(afterFile);
    const text = formatCurriculumDiff(diffCurricula(before, after));
    console.log(text);
    process.exit(text === "No differences." ? 0 : 1);
  }

  if (cmd === "patch") {
    const [file, patchFile] = rest;
    if (!file || !patchFile) {
      usage();
    }
    const payload = JSON.parse(await readFile(patchFile, "utf8")) as {
      patches: Array<{ path: string; value: unknown }>;
      allowlist?: string[];
    };
    const cv = await loadCurriculumFromFile(file);
    applyCurriculumPatches(cv, payload.patches, {
      allowlist: payload.allowlist,
    });
    await writeCurriculum(cv, file, {
      sections: requireSectionsFromPatchPaths(
        payload.patches.map((patch) => patch.path),
      ),
    });
    console.log(`Applied ${payload.patches.length} patch(es) to ${file}`);
    return;
  }

  if (cmd === "restore") {
    const useLast = rest.includes("--last");
    const positional = rest.filter((a) => a !== "--last");
    const workspaceDir = useLast
      ? path.resolve(positional[0] ?? ".")
      : path.resolve(positional[1] ?? ".");
    const { backupRoot } = await resolveBackupSettings(workspaceDir);
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
