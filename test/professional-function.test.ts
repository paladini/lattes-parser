import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parseCurriculum, serializeCurriculum } from "../src/index.js";

const fixturePath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "fixtures",
  "curriculum-professional-functions-sample.xml",
);

function loadFixture() {
  return parseCurriculum(readFileSync(fixturePath, "latin1"));
}

describe("professional function activities", () => {
  it("reads direction and teaching blocks under ATUACAO-PROFISSIONAL", () => {
    const curriculum = loadFixture();
    const activity = curriculum.professionalActivities[0];
    expect(activity?.functionActivities).toHaveLength(2);

    const direction = activity?.functionActivities.find(
      (entry) => entry.category === "direction_and_administration",
    );
    expect(direction?.periodFlag).toBe("ATUAL");
    expect(direction?.startYear).toBe("2022");
    expect(direction?.specifics["CARGO-OU-FUNCAO"]).toBe("Coordenação de curso");

    const teaching = activity?.functionActivities.find((entry) => entry.category === "teaching");
    expect(teaching?.specifics["TIPO-ENSINO"]).toBe("GRADUACAO");
    expect(teaching?.specifics["NOME-CURSO"]).toBe("Engenharia de Software");
    expect(teaching?.raw?.["DISCIPLINA"]).toBeDefined();
  });

  it("round-trips function activity fields and nested DISCIPLINA", () => {
    const first = loadFixture();
    const xml = serializeCurriculum(first);
    const second = parseCurriculum(xml);

    const before = first.professionalActivities[0]?.functionActivities;
    const after = second.professionalActivities[0]?.functionActivities;
    expect(after).toHaveLength(before?.length);

    const teachingBefore = before?.find((entry) => entry.category === "teaching");
    const teachingAfter = after?.find((entry) => entry.category === "teaching");
    expect(teachingAfter?.specifics["NOME-CURSO"]).toBe(teachingBefore?.specifics["NOME-CURSO"]);
    expect(teachingAfter?.raw?.["DISCIPLINA"]).toBeDefined();
  });
});
