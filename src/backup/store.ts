import { createHash } from "node:crypto";
import {
  copyFile,
  mkdir,
  readdir,
  readFile,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";

export const DEFAULT_BACKUP_DIR = ".lattes-backup";
export const DEFAULT_RETENTION = 20;

export interface BackupManifest {
  id: string;
  timestamp: string;
  sourcePath: string;
  sha256: string;
  curriculumId?: string;
}

export interface BackupRef {
  backupDir: string;
  manifestPath: string;
  filePath: string;
  manifest: BackupManifest;
}

export function resolveBackupRoot(targetFile: string, overrideDir?: string): string {
  if (overrideDir) {
    return path.resolve(overrideDir);
  }
  return path.join(path.dirname(path.resolve(targetFile)), DEFAULT_BACKUP_DIR);
}

function timestampId(date = new Date()): string {
  return date.toISOString().replace(/[:.]/g, "-");
}

async function sha256File(filePath: string): Promise<string> {
  const buf = await readFile(filePath);
  return createHash("sha256").update(buf).digest("hex");
}

export async function backupBeforeWrite(
  targetPath: string,
  options?: { backupDir?: string; curriculumId?: string },
): Promise<BackupRef | null> {
  const absTarget = path.resolve(targetPath);
  try {
    await stat(absTarget);
  } catch {
    return null;
  }

  const backupRoot = resolveBackupRoot(
    absTarget,
    options?.backupDir ??
      process.env.LATTES_TOOLKIT_BACKUP_DIR ??
      process.env.LATTES_PARSER_BACKUP_DIR,
  );
  const id = timestampId();
  const backupDir = path.join(backupRoot, id);
  await mkdir(backupDir, { recursive: true });

  const baseName = path.basename(absTarget);
  const filePath = path.join(backupDir, baseName);
  await copyFile(absTarget, filePath);

  const manifest: BackupManifest = {
    id,
    timestamp: new Date().toISOString(),
    sourcePath: absTarget,
    sha256: await sha256File(filePath),
    curriculumId: options?.curriculumId,
  };
  const manifestPath = path.join(backupDir, "manifest.json");
  await writeFile(manifestPath, JSON.stringify(manifest, null, 2), "utf8");

  await pruneBackups(backupRoot, DEFAULT_RETENTION);

  return { backupDir, manifestPath, filePath, manifest };
}

export async function listBackups(backupRoot: string): Promise<BackupManifest[]> {
  const absRoot = path.resolve(backupRoot);
  let entries: string[];
  try {
    entries = await readdir(absRoot);
  } catch {
    return [];
  }

  const manifests: BackupManifest[] = [];
  for (const entry of entries.sort().reverse()) {
    const manifestPath = path.join(absRoot, entry, "manifest.json");
    try {
      const raw = await readFile(manifestPath, "utf8");
      manifests.push(JSON.parse(raw) as BackupManifest);
    } catch {
      // skip invalid entries
    }
  }
  return manifests;
}

export async function restoreBackup(
  backupRoot: string,
  backupId: string,
): Promise<string> {
  const backupDir = path.join(path.resolve(backupRoot), backupId);
  const manifestPath = path.join(backupDir, "manifest.json");
  const manifest = JSON.parse(
    await readFile(manifestPath, "utf8"),
  ) as BackupManifest;

  const files = await readdir(backupDir);
  const xmlName = files.find((f) => f.endsWith(".xml") || f.endsWith(".zip"));
  if (!xmlName) {
    throw new Error(`No curriculum file in backup ${backupId}`);
  }

  const source = path.join(backupDir, xmlName);
  await backupBeforeWrite(manifest.sourcePath, {
    backupDir: backupRoot,
    curriculumId: manifest.curriculumId,
  });
  await copyFile(source, manifest.sourcePath);
  return manifest.sourcePath;
}

export async function restoreLatestBackup(backupRoot: string): Promise<string> {
  const list = await listBackups(backupRoot);
  if (list.length === 0) {
    throw new Error("No backups found");
  }
  return restoreBackup(backupRoot, list[0].id);
}

async function pruneBackups(backupRoot: string, keep: number): Promise<void> {
  const list = await listBackups(backupRoot);
  for (const old of list.slice(keep)) {
    await rm(path.join(backupRoot, old.id), { recursive: true, force: true });
  }
}
