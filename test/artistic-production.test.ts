import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parseCurriculum, serializeCurriculum } from "../src/index.js";

const fixturePath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "fixtures",
  "curriculum-artistic-sample.xml",
);

describe("artistic production", () => {
  it("types a visual artwork and keeps advisories and unknown siblings", () => {
    const first = parseCurriculum(readFileSync(fixturePath, "latin1"));
    const artwork = first.artisticProduction.find((item) => item.type === "visual_artwork");

    expect(artwork?.title).toBe("Pintura sintetica");
    expect(artwork?.year).toBe("2021");
    expect(artwork?.keywords).toEqual(["pintura"]);
    expect(artwork?.basics.NATUREZA).toBe("PINTURA");
    expect(artwork?.containerTag).toBe("PRODUCAO-ARTISTICA-CULTURAL");

    const xml = serializeCurriculum(first);
    expect(xml).toContain('TITULO="Pintura sintetica"');
    expect(xml).toContain("ORIENTACOES-CONCLUIDAS-PARA-MESTRADO");
    expect(xml).toContain("PRODUCAO-ARTISTICA-NAO-MAPEADA");

    const second = parseCurriculum(xml);
    expect(second.artisticProduction[0]?.detail.PREMIACAO).toBe("nenhuma");
    expect(second.artisticProduction).toHaveLength(1);
  });
});
