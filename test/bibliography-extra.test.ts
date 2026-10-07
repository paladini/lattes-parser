import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parseCurriculum, serializeCurriculum } from "../src/index.js";

const fixturePath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "fixtures",
  "curriculum-bibliography-extra-sample.xml",
);

describe("remaining bibliographic production", () => {
  it("keeps accepted articles and newspaper texts out of published articles", () => {
    const curriculum = parseCurriculum(readFileSync(fixturePath, "latin1"));
    const bib = curriculum.bibliographicProduction;

    expect(bib.journalArticles.map((item) => item.title)).toEqual(["Artigo publicado"]);
    expect(bib.acceptedArticles[0]?.title).toBe("Artigo aceito");
    expect(bib.acceptedArticles[0]?.keywords).toEqual(["aceite"]);
    expect(bib.acceptedArticles[0]?.journalOrEvent).toBe("Revista B");
    expect(bib.newspaperTexts[0]?.title).toBe("Nota de jornal");
    expect(bib.newspaperTexts[0]?.year).toBe("2023");
    expect(bib.other.find((item) => item.xmlTag === "TRADUCAO")?.title).toBe(
      "Traducao sintetica",
    );
    expect(bib.other.find((item) => item.xmlTag === "TRADUCAO")?.detail["NOME-DO-AUTOR-TRADUZIDO"]).toBe(
      "Autora Original",
    );
  });

  it("round-trips title attributes without writing a journal title onto a translation", () => {
    const first = parseCurriculum(readFileSync(fixturePath, "latin1"));
    const xml = serializeCurriculum(first);

    expect(xml).toContain('TITULO-DO-ARTIGO="Artigo aceito"');
    expect(xml).toContain('TITULO-DO-TEXTO="Nota de jornal"');
    expect(xml).toContain('TITULO="Traducao sintetica"');
    expect(xml).not.toContain('TITULO-DO-ARTIGO="Traducao sintetica"');
    expect(xml).not.toContain('TITULO-DO-TRABALHO="Nota de jornal"');

    const second = parseCurriculum(xml);
    expect(second.bibliographicProduction.acceptedArticles[0]?.title).toBe("Artigo aceito");
    expect(second.bibliographicProduction.newspaperTexts[0]?.year).toBe("2023");
    expect(
      second.bibliographicProduction.other.find((item) => item.type === "translation")?.detail[
        "NOME-DO-AUTOR-TRADUZIDO"
      ],
    ).toBe("Autora Original");
  });
});
