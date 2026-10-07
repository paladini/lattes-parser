import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parseCurriculum, serializeCurriculum } from "../src/index.js";

const fixturePath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "fixtures",
  "curriculum-event-fair-sample.xml",
);

describe("fair, exhibition, and olympiad events", () => {
  it("round-trips a fair with basics, detail, and participants", () => {
    const first = parseCurriculum(readFileSync(fixturePath, "latin1"));
    const fair = first.complementary.eventParticipation.find(
      (entry) => entry.type === "PARTICIPACAO-EM-FEIRA",
    );

    expect(fair?.title).toBe("Feira de ciencias");
    expect(fair?.year).toBe("2024");
    expect(fair?.eventName).toBe("Feira Sintetica");
    expect(fair?.city).toBe("Curitiba");
    expect(fair?.participants[0]?.name).toBe("Participante Exemplo");
    expect(fair?.participants[0]?.order).toBe(1);

    const xml = serializeCurriculum(first);
    expect(xml).toContain("PARTICIPACAO-EM-FEIRA");
    expect(xml).toContain("DADOS-BASICOS-DA-PARTICIPACAO-EM-FEIRA");
    expect(xml).toContain("DETALHAMENTO-DA-PARTICIPACAO-EM-FEIRA");
    expect(xml).toContain("PARTICIPANTE-DE-EVENTOS-CONGRESSOS");

    const second = parseCurriculum(xml);
    const again = second.complementary.eventParticipation.find(
      (entry) => entry.type === "PARTICIPACAO-EM-FEIRA",
    );
    expect(again?.title).toBe("Feira de ciencias");
    expect(again?.eventName).toBe("Feira Sintetica");
    expect(again?.participants[0]?.citationName).toBe("EXEMPLO, P.");
  });
});
