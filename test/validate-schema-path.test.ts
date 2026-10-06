import { describe, expect, it } from "vitest";
import { validateCurriculumXml } from "../src/validate/validate-curriculum.js";

describe("validateCurriculumXml schema path", () => {
  it("skips when an explicit schemaPath does not exist", () => {
    const result = validateCurriculumXml("<CURRICULO-VITAE/>", {
      schemaPath: "DEFINITIONS/does-not-exist.xsd",
    });

    expect(result.valid).toBe(false);
    expect(result.skipped).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.reason?.toLowerCase()).toContain("schema");
  });
});
