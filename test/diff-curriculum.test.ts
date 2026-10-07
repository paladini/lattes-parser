import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { diffCurricula, formatCurriculumDiff, parseCurriculum } from "../src/index.js";

const fixtures = join(dirname(fileURLToPath(import.meta.url)), "fixtures");

function load(name: string) {
  return parseCurriculum(readFileSync(join(fixtures, name), "latin1"));
}

describe("curriculum diff", () => {
  it("reports the summary, a technical title, and unmapped tags", () => {
    const text = formatCurriculumDiff(
      diffCurricula(load("curriculum-diff-before.xml"), load("curriculum-diff-after.xml")),
    );
    expect(text).toContain("changed identification.summary");
    expect(text).toContain("- Resumo original.");
    expect(text).toContain("+ Resumo revisado.");
    expect(text).toContain("changed technicalProduction[0].title");
    expect(text).toContain("- Ferramenta exemplo");
    expect(text).toContain("+ Ferramenta revisada");
    expect(text).toContain(
      "document tag removed CURRICULO-VITAE/PRODUCAO-TECNICA/TAG-SO-NO-ANTES",
    );
    expect(text).toContain(
      "document tag added CURRICULO-VITAE/PRODUCAO-TECNICA/TAG-SO-NO-DEPOIS",
    );
    expect(text).toContain(
      "unmapped tag added identification.unmapped/LINHA-DE-PESQUISA-NAO-MAPEADA",
    );
    expect(text).not.toContain("Pesquisadora Sintetica");
  });

  it("prints no differences for the same curriculum", () => {
    const cv = load("curriculum-diff-before.xml");
    expect(formatCurriculumDiff(diffCurricula(cv, cv))).toBe("No differences.");
  });
});
