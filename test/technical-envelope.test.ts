import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parseCurriculum, serializeCurriculum } from "../src/index.js";
import type { TechnicalItem } from "../src/types.js";

const fixturePath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "fixtures",
  "curriculum-real-anonymized.xml",
);

function loadAnonymized() {
  return parseCurriculum(readFileSync(fixturePath, "latin1"));
}

function softwareWithEnvelope(items: TechnicalItem[]): TechnicalItem | undefined {
  return items.find(
    (item) =>
      item.type === "software" &&
      item.keywords.length > 0 &&
      Object.keys(item.detail).length > 0 &&
      item.knowledgeAreas.length > 0,
  );
}

describe("technical production envelope", () => {
  it("reads keywords, detail, and media basics from the anonymized export", () => {
    const curriculum = loadAnonymized();

    expect(curriculum.technicalProduction[0]?.title).toBeTruthy();

    const software = curriculum.technicalProduction.find((item) => item.type === "software");
    expect(software?.keywords.length).toBeGreaterThan(0);
    expect(Object.keys(software?.detail ?? {}).length).toBeGreaterThan(0);

    const media = curriculum.technicalProduction.find(
      (item) => item.xmlTag === "MIDIA-SOCIAL-WEBSITE-BLOG",
    );
    expect(media?.basics.NATUREZA).toBeTruthy();
  });

  it("round-trips keywords, a knowledge area, and one detail attribute", () => {
    const first = loadAnonymized();
    const before = softwareWithEnvelope(first.technicalProduction);
    expect(before).toBeTruthy();

    const detailKey = Object.keys(before!.detail)[0];
    expect(detailKey).toBeTruthy();

    const second = parseCurriculum(serializeCurriculum(first));
    const after = second.technicalProduction.find(
      (item) => item.type === "software" && item.sequence === before!.sequence,
    );

    expect(after?.keywords).toEqual(before!.keywords);
    expect(after?.knowledgeAreas[0]).toEqual(before!.knowledgeAreas[0]);
    expect(after?.detail[detailKey!]).toBe(before!.detail[detailKey!]);
    expect(second.technicalProduction[0]?.title).toBe(first.technicalProduction[0]?.title);
  });

  it("updates the existing title attribute on media items", () => {
    const first = loadAnonymized();
    const media = first.technicalProduction.find(
      (item) => item.xmlTag === "MIDIA-SOCIAL-WEBSITE-BLOG",
    );
    expect(media).toBeTruthy();
    expect(media!.basics["TITULO-DO-TRABALHO-TECNICO"]).toBeUndefined();

    const revised = `${media!.title} (revisado)`;
    media!.title = revised;

    const second = parseCurriculum(serializeCurriculum(first));
    const again = second.technicalProduction.find(
      (item) =>
        item.xmlTag === "MIDIA-SOCIAL-WEBSITE-BLOG" && item.sequence === media!.sequence,
    );

    expect(again?.title).toBe(revised);
    expect(again?.basics.TITULO).toBe(revised);
    expect(again?.basics["TITULO-DO-TRABALHO-TECNICO"]).toBeUndefined();
    expect(again?.basics["TITULO-INGLES"]).toBe(media!.basics["TITULO-INGLES"]);
  });
});
