import { readFile, stat } from "node:fs/promises";
import path from "node:path";

export interface LattesConfig {
  backupDir?: string;
  retention?: number;
}

export async function loadLattesConfig(
  startDir: string,
): Promise<LattesConfig> {
  let dir = path.resolve(startDir);
  const root = path.parse(dir).root;

  for (;;) {
    const candidate = path.join(dir, "lattes.config.json");
    try {
      await stat(candidate);
      return parseLattesConfig(candidate, await readFile(candidate, "utf8"));
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code;
      if (code && code !== "ENOENT") {
        throw error;
      }
    }
    if (dir === root) {
      return {};
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
      return {};
    }
    dir = parent;
  }
}

function parseLattesConfig(filePath: string, raw: string): LattesConfig {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error(`Invalid JSON in ${filePath}`);
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error(`lattes.config.json must be an object: ${filePath}`);
  }
  const record = parsed as Record<string, unknown>;
  const config: LattesConfig = {};
  if ("backupDir" in record) {
    if (typeof record.backupDir !== "string" || record.backupDir.trim() === "") {
      throw new Error(`backupDir in ${filePath} must be a non-empty string`);
    }
    config.backupDir = record.backupDir;
  }
  if ("retention" in record) {
    if (
      typeof record.retention !== "number" ||
      !Number.isInteger(record.retention) ||
      record.retention < 1
    ) {
      throw new Error(`retention in ${filePath} must be an integer >= 1`);
    }
    config.retention = record.retention;
  }
  return config;
}
