import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  parseCurriculum,
  requireSectionsFromPatchPaths,
  sectionsFromPatchPaths,
  serializeCurriculum,
} from "../src/index.js";
import type { TechnicalItem } from "../src/types.js";

const fixturePath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "fixtures",
  "curriculum-real-anonymized.xml",
);

function loadAnonymized() {
  return parseCurriculum(readFileSync(fixturePath, "latin1"));
}

const minimalTechnicalXml = `<?xml version="1.0" encoding="ISO-8859-1"?>
<CURRICULO-VITAE NUMERO-IDENTIFICADOR="1" DATA-ATUALIZACAO="01012020" HORA-ATUALIZACAO="120000">
<DADOS-GERAIS><NOME-COMPLETO>Test</NOME-COMPLETO></DADOS-GERAIS>
<PRODUCAO-TECNICA>
<PROCESSOS-OU-TECNICAS SEQUENCIA-PRODUCAO="1">
<DADOS-BASICOS-DO-PROCESSOS-OU-TECNICAS TITULO-DO-PROCESSO="Proc A" ANO="2020"/>
</PROCESSOS-OU-TECNICAS>
<PRODUTO-TECNOLOGICO SEQUENCIA-PRODUCAO="2">
<DADOS-BASICOS-DO-PRODUTO-TECNOLOGICO TITULO-DO-PRODUTO="Prod B" ANO="2021"/>
</PRODUTO-TECNOLOGICO>
</PRODUCAO-TECNICA>
</CURRICULO-VITAE>`;

const addressNeighborhoodXml = `<?xml version="1.0" encoding="ISO-8859-1"?>
<CURRICULO-VITAE NUMERO-IDENTIFICADOR="1" DATA-ATUALIZACAO="01012020" HORA-ATUALIZACAO="120000">
<DADOS-GERAIS>
<NOME-COMPLETO>Test</NOME-COMPLETO>
<ENDERECO>
<ENDERECO-PROFISSIONAL BAIRRO="Centro"/>
</ENDERECO>
</DADOS-GERAIS>
</CURRICULO-VITAE>`;

describe("Copilot PR 19 fixes", () => {
  it("parses XSD product and process title attributes", () => {
    const cv = parseCurriculum(minimalTechnicalXml);
    expect(cv.technicalProduction).toHaveLength(2);
    const process = cv.technicalProduction.find((item) => item.type === "process_or_technique");
    const product = cv.technicalProduction.find((item) => item.type === "technology_product");
    expect(process?.title).toBe("Proc A");
    expect(product?.title).toBe("Prod B");
  });

  it("creates new media items with schema-correct basics tag and title attribute", () => {
    const cv = loadAnonymized();
    const item: TechnicalItem = {
      type: "media_social_website_blog",
      xmlTag: "MIDIA-SOCIAL-WEBSITE-BLOG",
      containerTag: "DEMAIS-TIPOS-DE-PRODUCAO-TECNICA",
      title: "Blog novo",
      year: "2024",
      sequence: "999",
      basics: {},
      detail: {},
      keywords: [],
      knowledgeAreas: [],
      activitySectors: [],
    };
    cv.technicalProduction.push(item);

    const xml = serializeCurriculum(cv, { sections: ["technicalProduction"] });
    expect(xml).toContain("DADOS-BASICOS-DA-MIDIA-SOCIAL-WEBSITE-BLOG");
    expect(xml).toContain('TITULO="Blog novo"');
    expect(xml).not.toMatch(
      /<MIDIA-SOCIAL-WEBSITE-BLOG[^>]*>[\s\S]*DADOS-BASICOS-DO-TRABALHO-TECNICO/,
    );
  });

  it("keeps an address block when only neighborhood is present", () => {
    const cv = parseCurriculum(addressNeighborhoodXml);
    expect(cv.identification.professionalAddress?.neighborhood).toBe("Centro");
  });

  it("drops stale keyword slots when the keyword list shrinks", () => {
    const cv = loadAnonymized();
    const software = cv.technicalProduction.find((item) => item.type === "software");
    expect(software).toBeTruthy();

    software!.keywords = ["kw-one", "kw-two"];
    software!.keywords = ["kw-one"];
    const xml = serializeCurriculum(cv, { sections: ["technicalProduction"] });
    const again = parseCurriculum(xml);
    const updated = again.technicalProduction.find(
      (item) => item.type === "software" && item.sequence === software!.sequence,
    );
    expect(updated?.keywords).toEqual(["kw-one"]);
    const sequence = software!.sequence ?? "";
    const softwareBlock = xml.match(
      new RegExp(
        `<SOFTWARE[^>]*SEQUENCIA-PRODUCAO="${sequence}"[\\s\\S]*?</SOFTWARE>`,
      ),
    )?.[0];
    expect(softwareBlock).toBeTruthy();
    expect(softwareBlock).not.toContain("PALAVRA-CHAVE-2=");
  });

  it("removes event participants when the typed array is empty", () => {
    const cv = loadAnonymized();
    const congress = cv.complementary.eventParticipation.find(
      (entry) => entry.type === "PARTICIPACAO-EM-CONGRESSO",
    );
    expect(congress).toBeTruthy();
    expect(congress!.participants.length).toBeGreaterThan(0);

    congress!.participants = [];
    const sequence = congress!.sequence ?? "";
    const xml = serializeCurriculum(cv, { sections: ["complementary"] });
    const congressBlock = xml.match(
      new RegExp(
        `<PARTICIPACAO-EM-CONGRESSO[^>]*SEQUENCIA-PRODUCAO="${sequence}"[\\s\\S]*?</PARTICIPACAO-EM-CONGRESSO>`,
      ),
    )?.[0];
    expect(congressBlock).toBeTruthy();
    expect(congressBlock).not.toContain("PARTICIPANTE-DE-EVENTOS-CONGRESSOS");

    const again = parseCurriculum(xml);
    const updated = again.complementary.eventParticipation.find(
      (entry) => entry.type === "PARTICIPACAO-EM-CONGRESSO" && entry.sequence === congress!.sequence,
    );
    expect(updated?.participants).toEqual([]);
  });

  it("maps root id and updatedAt paths to the metadata section", () => {
    expect(sectionsFromPatchPaths(["id"])).toEqual(["metadata"]);
    expect(sectionsFromPatchPaths(["updatedAt.rawDate"])).toEqual(["metadata"]);
  });

  it("rejects patch paths that do not map to any section", () => {
    expect(() => requireSectionsFromPatchPaths(["not.a.section"])).toThrow(
      /No curriculum section mapped/,
    );
  });
});
