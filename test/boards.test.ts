import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parseCurriculum, serializeCurriculum } from "../src/index.js";

const fixturePath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "fixtures",
  "curriculum-boards-sample.xml",
);

function loadBoardsFixture() {
  return parseCurriculum(readFileSync(fixturePath, "latin1"));
}

describe("board participation (bancas)", () => {
  it("reads thesis and judging boards with participants", () => {
    const curriculum = loadBoardsFixture();
    expect(curriculum.complementary.boards).toHaveLength(2);

    const thesis = curriculum.complementary.boards.find(
      (entry) => entry.xmlTag === "PARTICIPACAO-EM-BANCA-DE-MESTRADO",
    );
    expect(thesis?.kind).toBe("thesis");
    expect(thesis?.title).toBe("Sistemas distribuídos");
    expect(thesis?.year).toBe("2023");
    expect(thesis?.candidateName).toBe("Candidato Exemplo");
    expect(thesis?.institution).toBe("Universidade Sintética");
    expect(thesis?.participants[0]?.name).toBe("Membro Um");
    expect(thesis?.participants[0]?.order).toBe(1);
    expect(thesis?.keywords).toContain("software");

    const judging = curriculum.complementary.boards.find(
      (entry) => entry.xmlTag === "BANCA-JULGADORA-PARA-CONCURSO-PUBLICO",
    );
    expect(judging?.kind).toBe("judging");
    expect(judging?.title).toBe("Concurso docente");
    expect(judging?.institution).toBe("Instituto Federal Exemplo");
  });

  it("round-trips board fields through serialize", () => {
    const first = loadBoardsFixture();
    const second = parseCurriculum(serializeCurriculum(first));

    const thesisBefore = first.complementary.boards.find(
      (entry) => entry.sequence === "1",
    );
    const thesisAfter = second.complementary.boards.find(
      (entry) => entry.sequence === "1",
    );
    expect(thesisAfter?.title).toBe(thesisBefore?.title);
    expect(thesisAfter?.candidateName).toBe(thesisBefore?.candidateName);
    expect(thesisAfter?.participants[0]?.name).toBe(
      thesisBefore?.participants[0]?.name,
    );
    expect(thesisAfter?.keywords).toEqual(thesisBefore?.keywords);

    const judgingBefore = first.complementary.boards.find(
      (entry) => entry.sequence === "2",
    );
    const judgingAfter = second.complementary.boards.find(
      (entry) => entry.sequence === "2",
    );
    expect(judgingAfter?.xmlTag).toBe(judgingBefore?.xmlTag);
    expect(judgingAfter?.institution).toBe(judgingBefore?.institution);
  });
});
