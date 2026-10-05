import { copyFile, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  listBackups,
  parseCurriculum,
  restoreLatestBackup,
  writeCurriculum,
} from "../src/index.js";
import { loadSampleXml } from "./helpers/zip.js";

describe("backup store", () => {
  it("creates snapshot before overwrite and restore brings back content", async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), "lattes-bk-"));
    const file = path.join(dir, "curriculo.xml");
    const backupRoot = path.join(dir, ".lattes-backup");
    try {
      await writeFile(file, loadSampleXml(), "latin1");
      const original = await readFile(file, "latin1");

      const cv = parseCurriculum(original);
      cv.identification.summary = "Versão editada.";
      await writeCurriculum(cv, file, { backupDir: backupRoot });

      const edited = await readFile(file, "latin1");
      expect(edited).toContain("Versão editada.");
      expect(edited).not.toBe(original);

      const backups = await listBackups(backupRoot);
      expect(backups.length).toBeGreaterThanOrEqual(1);

      await restoreLatestBackup(backupRoot);
      const restoredCv = parseCurriculum(await readFile(file, "latin1"));
      const originalCv = parseCurriculum(original);
      expect(restoredCv.identification.summary).toBe(
        originalCv.identification.summary,
      );
      expect(restoredCv.id).toBe(originalCv.id);
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
