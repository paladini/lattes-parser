import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const fixturePath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "fixtures",
  "curriculum-real-anonymized.xml",
);

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
});
