import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  backupBeforeWrite,
  listBackups,
  loadLattesConfig,
  parseCurriculum,
  writeCurriculum,
} from "../src/index.js";
import { loadSampleXml } from "./helpers/zip.js";

const envKey = "LATTES_TOOLKIT_BACKUP_DIR";
const previousEnv = process.env[envKey];

async function waitForNextSnapshot(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 20));
}

describe("lattes.config.json", () => {
  afterEach(() => {
    if (previousEnv === undefined) {
      delete process.env[envKey];
    } else {
      process.env[envKey] = previousEnv;
    }
  });

  it("uses a parent config for backup directory and per-file retention", async () => {
    delete process.env[envKey];
    const root = await mkdtemp(path.join(os.tmpdir(), "lattes-cfg-"));
    const nested = path.join(root, "cv");
    const backupRoot = path.join(nested, "snapshots");
    const fileA = path.join(nested, "a.xml");
    const fileB = path.join(nested, "b.xml");
    try {
      await writeFile(
        path.join(root, "lattes.config.json"),
        JSON.stringify({ backupDir: "snapshots", retention: 2 }),
        "utf8",
      );
      const xml = loadSampleXml();
      await mkdir(nested, { recursive: true });
      await writeFile(fileA, xml, "latin1");
      await writeFile(fileB, xml, "latin1");

      const found = await loadLattesConfig(nested);
      expect(found.retention).toBe(2);
      expect(found.backupDir).toBe("snapshots");

      const cv = parseCurriculum(xml);
      for (let i = 0; i < 3; i += 1) {
        cv.identification.summary = `edicao ${i}`;
        await writeCurriculum(cv, fileA);
        await waitForNextSnapshot();
      }
      cv.identification.summary = "arquivo b";
      await writeCurriculum(cv, fileB);

      const backups = await listBackups(backupRoot);
      const forA = backups.filter((item) => item.sourcePath === path.resolve(fileA));
      const forB = backups.filter((item) => item.sourcePath === path.resolve(fileB));
      expect(forA).toHaveLength(2);
      expect(forB).toHaveLength(1);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it("lets the environment variable override the config directory", async () => {
    const root = await mkdtemp(path.join(os.tmpdir(), "lattes-cfg-env-"));
    const file = path.join(root, "curriculo.xml");
    const envDir = path.join(root, "from-env");
    try {
      await writeFile(
        path.join(root, "lattes.config.json"),
        JSON.stringify({ backupDir: "from-config", retention: 5 }),
        "utf8",
      );
      await writeFile(file, loadSampleXml(), "latin1");
      process.env[envKey] = envDir;
      const ref = await backupBeforeWrite(file);
      expect(ref?.backupDir.startsWith(envDir)).toBe(true);
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });
});
