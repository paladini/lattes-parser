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

  it("typed edits persist in XML across major sections", async () => {
    const cv = parseCurriculum(loadSampleXml());

    cv.bibliographicProduction.journalArticles[0]!.title = "Artigo revisado";
    cv.bibliographicProduction.journalArticles[0]!.doi = "10.9999/revised";
    cv.academicBackground[0]!.institution = "Universidade Atualizada";
    cv.identification.languages[0]!.proficiency = "NATIVO";
    cv.awards[0]!.title = "Premio atualizado";
    cv.advisories.completed[0]!.studentName = "Aluno Revisado";
    cv.technicalProduction[0]!.title = "Software revisado";

    const xml = serializeCurriculum(cv);
    expect(xml).toContain("Artigo revisado");
    expect(xml).toContain("10.9999/revised");
    expect(xml).toContain("Universidade Atualizada");
    expect(xml).toContain("NATIVO");
    expect(xml).toContain("Premio atualizado");
    expect(xml).toContain("Aluno Revisado");
    expect(xml).toContain("Software revisado");

    const reread = parseCurriculum(xml);
    expect(reread.bibliographicProduction.journalArticles[0]?.title).toBe(
      "Artigo revisado",
    );
    expect(reread.bibliographicProduction.journalArticles[0]?.doi).toBe(
      "10.9999/revised",
    );
    expect(reread.academicBackground[0]?.institution).toBe("Universidade Atualizada");
    expect(reread.identification.languages[0]?.proficiency).toBe("NATIVO");
    expect(reread.awards[0]?.title).toBe("Premio atualizado");
    expect(reread.advisories.completed[0]?.studentName).toBe("Aluno Revisado");
    expect(reread.technicalProduction[0]?.title).toBe("Software revisado");
  });

  it("adds and removes list items while preserving unmapped blocks", () => {
    const cv = parseCurriculum(loadSampleXml());

    cv.bibliographicProduction.journalArticles.push({
      type: "journal_article",
      title: "Artigo novo",
      year: "2026",
      authors: [
        {
          name: "Pesquisador Sintese",
          citationName: "SINTESE, P.",
          order: 1,
        },
      ],
      journalOrEvent: "Revista Nova",
      doi: "10.0000/new",
      basics: {},
      detail: {},
      keywords: [],
      knowledgeAreas: [],
      activitySectors: [],
    });
    cv.awards = [];

    const xml = serializeCurriculum(cv);
    expect(xml).toContain("Artigo novo");
    expect(xml).not.toContain("Premio Jovem Pesquisador");
    expect(xml).toContain("OUTRA-PRODUCAO");
    expect(xml).toContain("LINHA-DE-PESQUISA-NAO-MAPEADA");
    expect(xml).toContain("SECAO-BIBLIOGRAFICA-EXTRA");

    const reread = parseCurriculum(xml);
    expect(reread.bibliographicProduction.journalArticles).toHaveLength(2);
    expect(reread.bibliographicProduction.journalArticles[1]?.title).toBe(
      "Artigo novo",
    );
    expect(reread.awards).toHaveLength(0);
    expect(Object.keys(reread.unmapped ?? {})).toEqual(
      Object.keys(cv.unmapped ?? {}),
    );
    expect(reread.identification.unmapped).toHaveProperty(
      "LINHA-DE-PESQUISA-NAO-MAPEADA",
    );
  });

  it("raw nodes reference document tree after parse", () => {
    const cv = parseCurriculum(loadSampleXml());
    const articleRaw = cv.bibliographicProduction.journalArticles[0]?.raw;
    const documentBibliographic = cv.document["PRODUCAO-BIBLIOGRAFICA"];

    expect(articleRaw).toBeDefined();
    expect(documentBibliographic).toBeDefined();
    expect(JSON.stringify(articleRaw)).toBe(
      JSON.stringify(
        (
          (
            (documentBibliographic as Record<string, unknown>)[
              "ARTIGOS-PUBLICADOS"
            ] as Record<string, unknown>
          )["ARTIGO-PUBLICADO"] as Record<string, unknown>
        ),
      ),
    );
  });
});
