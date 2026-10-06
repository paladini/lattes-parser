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

describe("address and contact", () => {
  it("maps ENDERECO contact attributes and residential postal fields", () => {
    const xml = readFileSync(fixturePath, "latin1");
    const cv = parseCurriculum(xml);

    expect(cv.identification.addressContact?.preference).toBe("ENDERECO_RESIDENCIAL");
    expect(cv.identification.addressContact?.electronic).toBe("anonimo@example.test");
    expect(cv.identification.residentialAddress?.postalCode).toBe("00000000");
    expect(cv.identification.residentialAddress?.email).toBe("anonimo@example.test");

    const again = parseCurriculum(serializeCurriculum(cv));
    expect(again.identification.addressContact?.electronic).toBe("anonimo@example.test");
    expect(again.identification.residentialAddress?.postalCode).toBe("00000000");
  });
});
