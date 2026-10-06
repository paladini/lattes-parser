import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parseCurriculum, serializeCurriculum } from "../src/index.js";

const fixturePath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "fixtures",
  "curriculum-real-anonymized.xml",
);

function normalizeDocument(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(normalizeDocument);
  }
  if (value && typeof value === "object") {
    const record = value as Record<string, unknown>;
    const keys = Object.keys(record).sort();
    const out: Record<string, unknown> = {};
    for (const key of keys) {
      out[key] = normalizeDocument(record[key]);
    }
    return out;
  }
  return value;
}

describe("XSD fidelity (anonymized real export)", () => {
  it("parse → serialize → parse preserves document tree", () => {
    const xml = readFileSync(fixturePath, "latin1");
    const first = parseCurriculum(xml);
    const serialized = serializeCurriculum(first);
    const second = parseCurriculum(serialized);

    expect(normalizeDocument(second.document)).toEqual(
      normalizeDocument(first.document),
    );
    expect(second.technicalProduction.length).toBe(first.technicalProduction.length);
    expect(second.complementary.complementaryTraining.length).toBe(
      first.complementary.complementaryTraining.length,
    );
  });
});
