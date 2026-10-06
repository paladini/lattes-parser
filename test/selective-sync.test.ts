import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  applyCurriculumPatches,
  parseCurriculum,
  sectionsFromPatchPaths,
  serializeCurriculum,
} from "../src/index.js";

const fixturePath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "fixtures",
  "curriculum-real-anonymized.xml",
);

function loadXml(): string {
  return readFileSync(fixturePath, "latin1");
}

function countTag(xml: string, tag: string): number {
  return xml.split(`<${tag}`).length - 1;
}

describe("selective sync", () => {
  it("updates the summary and leaves bibliographic XML in place", () => {
    const original = loadXml();
    const cv = parseCurriculum(original);
    applyCurriculumPatches(cv, [
      { path: "identification.summary", value: "Resumo seletivo." },
    ]);

    const xml = serializeCurriculum(cv, { sections: ["identification"] });
    const detailTag = original.match(/DETALHAMENTO-[A-Z0-9-]+/)?.[0];

    expect(detailTag).toBeTruthy();
    expect(xml.indexOf(detailTag!)).toBeGreaterThan(-1);
    expect(countTag(xml, "AUTORES")).toBe(countTag(original, "AUTORES"));
    expect(xml).toContain("Resumo seletivo.");
  });

  it("removes technical production when that section is selected and empty", () => {
    const cv = parseCurriculum(loadXml());
    cv.technicalProduction = [];

    const xml = serializeCurriculum(cv, { sections: ["technicalProduction"] });

    expect(xml).not.toContain("<SOFTWARE");
    expect(xml).not.toContain("DEMAIS-TIPOS-DE-PRODUCAO-TECNICA");
  });

  it("keeps technical production on full sync when the typed array is empty", () => {
    const cv = parseCurriculum(loadXml());
    cv.technicalProduction = [];

    const xml = serializeCurriculum(cv);

    expect(xml).toContain("<SOFTWARE");
  });

  it("maps the first path segment to a section id", () => {
    expect(
      sectionsFromPatchPaths([
        "identification.summary",
        "technicalProduction[0].title",
        "complementary.eventParticipation[0].title",
        "unknown.field",
        "identification.fullName",
      ]),
    ).toEqual(["identification", "technicalProduction", "complementary"]);
  });
});
