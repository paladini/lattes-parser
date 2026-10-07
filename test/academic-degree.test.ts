import { describe, expect, it } from "vitest";
import { parseCurriculum, serializeCurriculum } from "../src/index.js";

const GRADUATION_XML = `<?xml version="1.0" encoding="ISO-8859-1"?>
<CURRICULO-VITAE NUMERO-IDENTIFICADOR="0000000000000099" DATA-ATUALIZACAO="01012024" HORA-ATUALIZACAO="120000">
  <DADOS-GERAIS NOME-COMPLETO="Formacao Exemplo">
    <FORMACAO-ACADEMICA-TITULACAO>
      <GRADUACAO NIVEL="GRADUACAO" NOME-CURSO="Engenharia de Software" TITULO-DO-TRABALHO-DE-CONCLUSAO-DE-CURSO="Monografia final" NOME-INSTITUICAO="Universidade A" ANO-DE-CONCLUSAO="2020" STATUS-DO-CURSO="CONCLUIDO"/>
    </FORMACAO-ACADEMICA-TITULACAO>
  </DADOS-GERAIS>
</CURRICULO-VITAE>`;

describe("AcademicDegree courseName and conclusion title", () => {
  it("reads NOME-CURSO separately from the conclusion work title", () => {
    const cv = parseCurriculum(GRADUATION_XML);
    const grad = cv.academicBackground.find((entry) => entry.xmlTag === "GRADUACAO");
    expect(grad?.courseName).toBe("Engenharia de Software");
    expect(grad?.title).toBe("Monografia final");
  });

  it("round-trips a new graduation with courseName and TCC title on the correct attributes", () => {
    const cv = parseCurriculum(GRADUATION_XML);
    cv.academicBackground.push({
      xmlTag: "GRADUACAO",
      level: "GRADUACAO",
      courseName: "Sistemas de Informacao",
      title: "Projeto integrador",
      institution: "Universidade B",
      startYear: "2018",
      endYear: "2022",
      status: "CONCLUIDO",
    });

    const xml = serializeCurriculum(cv);
    expect(xml).toContain('NOME-CURSO="Sistemas de Informacao"');
    expect(xml).toContain('TITULO-DO-TRABALHO-DE-CONCLUSAO-DE-CURSO="Projeto integrador"');
    expect(xml).not.toMatch(/NOME-CURSO="Projeto integrador"/);

    const reread = parseCurriculum(xml);
    const added = reread.academicBackground.find(
      (entry) => entry.courseName === "Sistemas de Informacao",
    );
    expect(added?.title).toBe("Projeto integrador");
  });

  it("writes mestrado title only on TITULO-DA-DISSERTACAO-TESE", () => {
    const cv = parseCurriculum(GRADUATION_XML);
    cv.academicBackground.push({
      xmlTag: "MESTRADO",
      level: "MESTRADO",
      courseName: "Ciencia da Computacao",
      title: "Dissertacao exemplo",
      institution: "Universidade C",
      endYear: "2024",
      status: "CONCLUIDO",
    });

    const xml = serializeCurriculum(cv);
    expect(xml).toContain('TITULO-DA-DISSERTACAO-TESE="Dissertacao exemplo"');
    const mestradoBlock = xml.match(/<MESTRADO[^>]*Dissertacao exemplo[^/]*\/>/)?.[0] ?? "";
    expect(mestradoBlock).not.toContain("TITULO-DA-MONOGRAFIA");
  });
});
