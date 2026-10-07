import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parseCurriculum, serializeCurriculum } from "../src/index.js";

const fixturePath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "fixtures",
  "curriculum-advisories-sample.xml",
);

const legacyCompleted = `<?xml version="1.0" encoding="ISO-8859-1"?>
<CURRICULO-VITAE NUMERO-IDENTIFICADOR="0000000000000026" DATA-ATUALIZACAO="01012025" HORA-ATUALIZACAO="120000">
  <DADOS-GERAIS NOME-COMPLETO="Pesquisador Orientacoes"/>
  <DADOS-COMPLEMENTARES>
    <ORIENTACOES-CONCLUIDAS>
      <ORIENTACOES-CONCLUIDAS-PARA-MESTRADO>
        <DADOS-BASICOS-DE-ORIENTACOES-CONCLUIDAS-PARA-MESTRADO NOME-DO-ORIENTADO="Aluno Antigo" TITULO-DO-TRABALHO-DE-CONCLUSAO="Texto antigo" ANO="2018" NOME-INSTITUICAO="Universidade Antiga"/>
      </ORIENTACOES-CONCLUIDAS-PARA-MESTRADO>
    </ORIENTACOES-CONCLUIDAS>
  </DADOS-COMPLEMENTARES>
</CURRICULO-VITAE>`;

describe("advisories aligned with the XSD", () => {
  it("reads a completed master's under OUTRA-PRODUCAO and an in-progress graduation", () => {
    const first = parseCurriculum(readFileSync(fixturePath, "latin1"));
    const completed = first.advisories.completed[0];
    const graduation = first.advisories.inProgress.find(
      (entry) => entry.type === "ORIENTACAO-EM-ANDAMENTO-DE-GRADUACAO",
    );

    expect(completed?.studentName).toBe("Orientado Exemplo");
    expect(completed?.title).toBe("Dissertacao sintetica");
    expect(completed?.keywords).toEqual(["orientacao"]);
    expect(graduation?.studentName).toBe("Graduando Exemplo");
    expect(graduation?.institution).toBe("Instituto Sintetico");
    expect(graduation?.title).toBe("Trabalho de graduacao");
    expect(first.artisticProduction[0]?.title).toBe("Peca sintetica");

    const xml = serializeCurriculum(first);
    expect(xml).toContain("OUTRA-PRODUCAO");
    expect(xml).toContain("ORIENTACOES-CONCLUIDAS-PARA-MESTRADO");
    expect(xml).toContain("MUSICA");
    expect(xml).toContain("DETALHAMENTO-DA-ORIENTACAO-EM-ANDAMENTO-DE-GRADUACAO");
    expect(xml).toContain('NOME-DO-ORIENTANDO="Graduando Exemplo"');

    const second = parseCurriculum(xml);
    expect(second.advisories.completed).toHaveLength(1);
    expect(second.advisories.inProgress[0]?.studentName).toBe("Graduando Exemplo");
    expect(second.artisticProduction[0]?.title).toBe("Peca sintetica");
  });

  it("moves a legacy completed advisory out of DADOS-COMPLEMENTARES", () => {
    const first = parseCurriculum(legacyCompleted);
    expect(first.advisories.completed[0]?.studentName).toBe("Aluno Antigo");

    const xml = serializeCurriculum(first);
    const otherStart = xml.indexOf("<OUTRA-PRODUCAO");
    const complementStart = xml.indexOf("<DADOS-COMPLEMENTARES");
    const completedAt = xml.indexOf("ORIENTACOES-CONCLUIDAS-PARA-MESTRADO");
    expect(otherStart).toBeGreaterThan(-1);
    expect(completedAt).toBeGreaterThan(otherStart);
    if (complementStart >= 0) {
      expect(completedAt).toBeLessThan(complementStart);
    }

    const second = parseCurriculum(xml);
    expect(second.advisories.completed).toHaveLength(1);
    expect(second.advisories.completed[0]?.title).toBe("Texto antigo");
  });
});
