import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  parseCurriculum,
  serializeCurriculum,
  writeCurriculum,
} from "../src/index.js";
import { loadSampleXml } from "./helpers/zip.js";

describe("serialize round-trip", () => {
  it("parse → serialize → parse preserves id, typed fields, and unmapped keys", () => {
    const first = parseCurriculum(loadSampleXml());
    expect(first.document).toBeDefined();

    const xml = serializeCurriculum(first);
    expect(xml).toContain('encoding="ISO-8859-1"');
    expect(xml).toContain("CURRICULO-VITAE");

    const second = parseCurriculum(xml);
    expect(second.id).toBe(first.id);
    expect(second.identification.fullName).toBe(first.identification.fullName);
    expect(second.identification.summary).toBe(first.identification.summary);
    expect(second.bibliographicProduction.journalArticles[0]?.doi).toBe(
      first.bibliographicProduction.journalArticles[0]?.doi,
    );
    expect(Object.keys(second.identification.unmapped ?? {})).toEqual(
      Object.keys(first.identification.unmapped ?? {}),
    );
    expect(Object.keys(second.unmapped ?? {})).toEqual(
      Object.keys(first.unmapped ?? {}),
    );
  });

  it("set on identification.summary updates XML on write", async () => {
    const dir = await mkdtemp(path.join(os.tmpdir(), "lattes-rt-"));
    const file = path.join(dir, "cv.xml");
    try {
      const cv = parseCurriculum(loadSampleXml());
      cv.identification.summary = "Resumo atualizado pelo teste.";
      await writeCurriculum(cv, file, { backup: false });

      const reread = parseCurriculum(await readFile(file, "latin1"));
      expect(reread.identification.summary).toBe("Resumo atualizado pelo teste.");
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  });
});
