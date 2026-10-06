import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const fixturePath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "fixtures",
  "curriculum-real-anonymized.xml",
);

const syntheticLattesId = "0000000000000001";

const forbidden = [
  "Fernando Paladini",
  "27121995",
  "22072008",
  "88058455",
];

describe("anonymized fixture hygiene", () => {
  it("does not contain known personal identifiers", () => {
    const xml = readFileSync(fixturePath, "latin1");
    for (const value of forbidden) {
      expect(xml.includes(value), `fixture contains ${value}`).toBe(false);
    }
  });

  it("uses a synthetic Lattes identifier everywhere", () => {
    const xml = readFileSync(fixturePath, "latin1");
    expect(xml).toContain(`NUMERO-IDENTIFICADOR="${syntheticLattesId}"`);
    const nroIds = [...xml.matchAll(/NRO-ID-CNPQ="([^"]+)"/g)].map((m) => m[1]);
    expect(nroIds.length).toBeGreaterThan(0);
    for (const id of nroIds) {
      expect(id, "NRO-ID-CNPQ must use synthetic Lattes ID").toBe(syntheticLattesId);
    }
  });
});
