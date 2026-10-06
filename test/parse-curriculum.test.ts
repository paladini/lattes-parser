import { describe, expect, it } from "vitest";
import {
  InvalidCurriculumArchiveError,
  InvalidCurriculumXmlError,
  parseCurriculum,
  readCurriculum,
} from "../src/index.js";
import { loadSampleXml, zipSampleCurriculum } from "./helpers/zip.js";

describe("parseCurriculum", () => {
  it("maps major curriculum sections from synthetic XML", () => {
    const curriculum = parseCurriculum(loadSampleXml());

    expect(curriculum.id).toBe("0000000000000001");
    expect(curriculum.updatedAt.iso).toBe("2024-03-15T14:30:22");
    expect(curriculum.identification.fullName).toBe("Pesquisador Síntese");
    expect(curriculum.identification.summary).toContain("acentuação");
    expect(curriculum.identification.professionalAddress?.city).toBe("Campinas");
    expect(curriculum.academicBackground).toHaveLength(2);
    expect(curriculum.professionalActivities[0]?.role).toBe("Professor");
    expect(curriculum.identification.researchAreas[0]?.specialty).toBe(
      "Engenharia de Software",
    );
    expect(curriculum.identification.languages).toHaveLength(2);
    expect(curriculum.bibliographicProduction.journalArticles[0]?.doi).toBe(
      "10.0000/example",
    );
    expect(curriculum.bibliographicProduction.conferencePapers[0]?.title).toBe(
      "Trabalho em evento",
    );
    expect(curriculum.bibliographicProduction.booksAndChapters[0]?.type).toBe(
      "book_chapter",
    );
    expect(curriculum.technicalProduction[0]?.title).toBe("Ferramenta exemplo");
    expect(curriculum.advisories.completed[0]?.studentName).toBe("Aluno Um");
    expect(curriculum.advisories.inProgress[0]?.studentName).toBe("Aluna Dois");
    expect(curriculum.awards[0]?.title).toContain("Prêmio");
    expect(curriculum.identification.unmapped).toHaveProperty(
      "LINHA-DE-PESQUISA-NAO-MAPEADA",
    );
    expect(curriculum.bibliographicProduction.unmapped).toHaveProperty(
      "SECAO-BIBLIOGRAFICA-EXTRA",
    );
    expect(curriculum.unmapped).toHaveProperty("OUTRA-PRODUCAO");
  });

  it("rejects invalid roots", () => {
    expect(() => parseCurriculum("<ROOT/>")).toThrow(InvalidCurriculumXmlError);
  });
});

describe("readCurriculum", () => {
  it("reads XML buffers with ISO-8859-1 encoding", async () => {
    const { loadSampleXmlBytes } = await import("./helpers/zip.js");
    const curriculum = await readCurriculum(loadSampleXmlBytes());
    expect(curriculum.identification.fullName).toBe("Pesquisador Síntese");
  });

  it("reads ZIP archives from Extrator", async () => {
    const zip = zipSampleCurriculum();
    const curriculum = await readCurriculum(zip);
    expect(curriculum.id).toBe("0000000000000001");
  });

  it("rejects empty ZIP archives", async () => {
    const { zipSync } = await import("fflate");
    const emptyZip = zipSync({});
    await expect(readCurriculum(emptyZip)).rejects.toThrow(
      InvalidCurriculumArchiveError,
    );
  });
});
