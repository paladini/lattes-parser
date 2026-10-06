import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { validateCurriculumXml } from "../src/validate/validate-curriculum.js";

const schemaFileName =
  "xml_cvbase_src_main_resources_CurriculoLattes_12_09_2022.xsd";
const originalCwd = process.cwd();

describe("validateCurriculumXml schema path", () => {
  afterEach(() => {
    process.chdir(originalCwd);
  });

  it("skips when an explicit schemaPath does not exist", () => {
    const result = validateCurriculumXml("<CURRICULO-VITAE/>", {
      schemaPath: "DEFINITIONS/does-not-exist.xsd",
    });

    expect(result.valid).toBe(false);
    expect(result.skipped).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.reason?.toLowerCase()).toContain("schema");
  });

  it("finds the packaged schema when the working directory has no DEFINITIONS", () => {
    process.chdir(mkdtempSync(path.join(tmpdir(), "lattes-schema-")));

    const result = validateCurriculumXml("<CURRICULO-VITAE/>");

    expect(result.reason ?? "").not.toMatch(/schema not found/i);
    if (result.skipped) {
      expect(result.reason).toMatch(/xmllint/i);
    }
  });

  it("lists the versioned XSD in the published package files", () => {
    const pkg = JSON.parse(readFileSync("package.json", "utf8")) as {
      files: string[];
    };

    expect(pkg.files).toContain(`DEFINITIONS/${schemaFileName}`);
  });
});
