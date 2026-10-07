import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { parseCurriculum, serializeCurriculum } from "../src/index.js";

const fixturePath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "fixtures",
  "curriculum-license-sample.xml",
);

describe("licenses", () => {
  it("round-trips a maternity license and leaves CPF untyped", () => {
    const first = parseCurriculum(readFileSync(fixturePath, "latin1"));
    const license = first.identification.licenses[0];

    expect(license?.type).toBe("MATERNIDADE");
    expect(license?.startDateFormat).toBe("DDMMAAAA");
    expect(license?.startDate).toBe("01012024");
    expect(license?.endDateFormat).toBe("DDMMAAAA");
    expect(license?.endDate).toBe("01062024");
    expect(first.identification.unmapped.LICENCAS).toBeUndefined();
    expect(JSON.stringify(first.identification)).not.toContain("00000000000");

    const xml = serializeCurriculum(first);
    expect(xml).toContain('TIPO-LICENCA="MATERNIDADE"');
    expect(xml).toContain('DATA-FIM-LICENCA="01062024"');
    expect(xml).toContain('CPF="00000000000"');

    const second = parseCurriculum(xml);
    expect(second.identification.licenses[0]).toMatchObject({
      type: "MATERNIDADE",
      startDate: "01012024",
      endDate: "01062024",
    });
  });
});
