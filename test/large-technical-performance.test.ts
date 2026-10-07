import { mkdtemp, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { readCurriculum, writeCurriculum } from "../src/index.js";

const ITEM = `    <SOFTWARE SEQUENCIA-PRODUCAO="1"><DADOS-BASICOS-DO-SOFTWARE TITULO-DO-SOFTWARE="Ferramenta sintetica" ANO="2024" PAIS="Brasil"/><DETALHAMENTO-DO-SOFTWARE FINALIDADE="Medicao" PLATAFORMA="Node"/><AUTORES NOME-COMPLETO-DO-AUTOR="Autora Exemplo" NOME-PARA-CITACAO="EXEMPLO, A." ORDEM-DE-AUTORIA="1"/></SOFTWARE>\n`;
const ITEM_COUNT = 12_000;

function largeTechnicalXml(): string {
  return `<?xml version="1.0" encoding="ISO-8859-1"?>
<CURRICULO-VITAE NUMERO-IDENTIFICADOR="0000000000000032" DATA-ATUALIZACAO="01012026" HORA-ATUALIZACAO="120000">
  <DADOS-GERAIS NOME-COMPLETO="Pesquisadora Sintetica"><RESUMO-CV>Resumo de medicao.</RESUMO-CV></DADOS-GERAIS>
  <PRODUCAO-TECNICA>
${ITEM.repeat(ITEM_COUNT)}  </PRODUCAO-TECNICA>
</CURRICULO-VITAE>
`;
}

describe("large technical curriculum", () => {
  it("round-trips a multi-megabyte synthetic file", async () => {
    const xml = largeTechnicalXml();
    expect(Buffer.byteLength(xml)).toBeGreaterThan(3_000_000);

    const readStarted = performance.now();
    const cv = await readCurriculum(xml);
    const readMs = performance.now() - readStarted;
    expect(cv.technicalProduction).toHaveLength(ITEM_COUNT);
    expect(cv.technicalProduction[0]?.title).toBe("Ferramenta sintetica");
    expect(cv.technicalProduction[ITEM_COUNT - 1]?.title).toBe("Ferramenta sintetica");

    const dir = await mkdtemp(path.join(tmpdir(), "lattes-large-"));
    const target = path.join(dir, "curriculo.xml");
    try {
      const writeStarted = performance.now();
      await writeCurriculum(cv, target, { backup: false });
      const writeMs = performance.now() - writeStarted;
      const again = await readCurriculum(await readFile(target));
      expect(again.technicalProduction).toHaveLength(ITEM_COUNT);
      expect(again.identification.summary).toBe("Resumo de medicao.");
      expect(again.technicalProduction[0]?.title).toBe("Ferramenta sintetica");
      console.info(
        `large technical curriculum: ${ITEM_COUNT} items, read ${Math.round(readMs)} ms, write ${Math.round(writeMs)} ms, heap ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
      );
    } finally {
      await rm(dir, { recursive: true, force: true });
    }
  }, 30_000);
});
