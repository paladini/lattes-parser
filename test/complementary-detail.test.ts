import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parseCurriculum, serializeCurriculum } from "../src/index.js";

const fixturePath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "fixtures",
  "curriculum-real-anonymized.xml",
);

function loadAnonymized() {
  return parseCurriculum(readFileSync(fixturePath, "latin1"));
}

describe("complementary training and event detail", () => {
  it("reads level and course title on a short course", () => {
    const curriculum = loadAnonymized();
    const course = curriculum.complementary.complementaryTraining.find(
      (entry) => entry.type === "FORMACAO-COMPLEMENTAR-CURSO-DE-CURTA-DURACAO",
    );

    expect(course?.level).toBeTruthy();
    expect(course?.title).toBeTruthy();
  });

  it("reads an OUTROS complementary entry", () => {
    const curriculum = loadAnonymized();
    const other = curriculum.complementary.complementaryTraining.find(
      (entry) => entry.type === "OUTROS",
    );

    expect(other).toBeTruthy();
    expect(other?.title).toBeTruthy();
  });

  it("reads congress basics, detail event name, and a participant", () => {
    const curriculum = loadAnonymized();
    const congress = curriculum.complementary.eventParticipation.find(
      (entry) => entry.type === "PARTICIPACAO-EM-CONGRESSO",
    );

    expect(congress).toBeTruthy();
    expect(congress?.basics.TITULO || congress?.title).toBeTruthy();
    expect(congress?.detail["NOME-DO-EVENTO"] || congress?.eventName).toBeTruthy();
    expect(congress?.participants.length).toBeGreaterThan(0);
  });

  it("round-trips participant name and one basics attribute", () => {
    const first = loadAnonymized();
    const before = first.complementary.eventParticipation.find(
      (entry) => entry.type === "PARTICIPACAO-EM-CONGRESSO",
    );
    expect(before).toBeTruthy();

    const basicsKey = Object.keys(before!.basics).find((key) => before!.basics[key]);
    expect(basicsKey).toBeTruthy();
    const participantName = before!.participants[0]?.name;
    expect(participantName).toBeTruthy();

    const second = parseCurriculum(serializeCurriculum(first));
    const after = second.complementary.eventParticipation.find(
      (entry) =>
        entry.type === "PARTICIPACAO-EM-CONGRESSO" && entry.sequence === before!.sequence,
    );

    expect(after?.participants[0]?.name).toBe(participantName);
    expect(after?.basics[basicsKey!]).toBe(before!.basics[basicsKey!]);
  });
});
