import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parseCurriculum, serializeCurriculum } from "../src/index.js";

const fixturePath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "fixtures",
  "curriculum-technical-extra-sample.xml",
);

function load() {
  return parseCurriculum(readFileSync(fixturePath, "latin1"));
}

describe("technical production tags outside the original list", () => {
  it("types a trademark, a registered cultivar, and a research report", () => {
    const curriculum = load();
    const trademark = curriculum.technicalProduction.find((item) => item.type === "trademark");
    const cultivar = curriculum.technicalProduction.find(
      (item) => item.type === "registered_cultivar",
    );
    const report = curriculum.technicalProduction.find((item) => item.type === "research_report");

    expect(trademark?.title).toBe("Marca Sintetica");
    expect(trademark?.year).toBe("2022");
    expect(trademark?.keywords).toEqual(["marca"]);
    expect(trademark?.detail.NATUREZA).toBe("MISTA");
    expect(trademark?.authors[0]?.name).toBe("Autora Exemplo");

    expect(cultivar?.title).toBe("Cultivar Alfa");
    expect(cultivar?.year).toBe("2021");
    expect(cultivar?.xmlTag).toBe("CULTIVAR-REGISTRADA");

    expect(report?.title).toBe("Relatorio sintetico");
    expect(report?.year).toBe("2020");
    expect(report?.containerTag).toBe("DEMAIS-TIPOS-DE-PRODUCAO-TECNICA");
    expect(report?.detail["NOME-DO-PROJETO"]).toBe("Projeto Alfa");
  });

  it("round-trips the new tags and keeps an unknown sibling", () => {
    const first = load();
    const xml = serializeCurriculum(first);
    const second = parseCurriculum(xml);

    expect(second.technicalProduction.map((item) => item.xmlTag).sort()).toEqual(
      ["CULTIVAR-REGISTRADA", "MARCA", "RELATORIO-DE-PESQUISA"].sort(),
    );
    expect(xml).toContain("TAG-DESCONHECIDA-DE-PRODUCAO");
    expect(xml).toContain("DENOMINACAO=\"Cultivar Alfa\"");
    expect(xml).toContain("TITULO=\"Marca Sintetica\"");
    expect(xml).not.toContain("TITULO-DO-TRABALHO-TECNICO=\"Marca Sintetica\"");

    const report = second.technicalProduction.find((item) => item.xmlTag === "RELATORIO-DE-PESQUISA");
    expect(report?.detail["NOME-DO-PROJETO"]).toBe("Projeto Alfa");
  });
});
