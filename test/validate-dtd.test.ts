import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";
import { validateCurriculumXml } from "../src/validate/validate-curriculum.js";

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<CURRICULO-VITAE/>
`;

const invalidXml = `<?xml version="1.0" encoding="UTF-8"?>
<CURRICULO-VITAE><EXTRA/></CURRICULO-VITAE>
`;

function writeFixture(): { dir: string; dtdPath: string; xmlPath: string } {
  const dir = mkdtempSync(path.join(tmpdir(), "lattes-dtd-"));
  const dtdPath = path.join(dir, "sample.dtd");
  const xmlPath = path.join(dir, "sample.xml");
  writeFileSync(
    dtdPath,
    "<!ELEMENT CURRICULO-VITAE EMPTY>\n",
    "utf8",
  );
  writeFileSync(xmlPath, xml, "utf8");
  return { dir, dtdPath, xmlPath };
}

describe("validateCurriculumXml DTD flag", () => {
  it("keeps XSD validation when dtd is omitted", () => {
    const result = validateCurriculumXml("<CURRICULO-VITAE/>", {
      schemaPath: "DEFINITIONS/does-not-exist.xsd",
    });

    expect(result.skipped).toBe(true);
    expect(result.reason?.toLowerCase()).toContain("schema");
  });

  it("skips when the flag is set and no DTD path is given", () => {
    const result = validateCurriculumXml(xml, { dtd: true });

    expect(result.valid).toBe(false);
    expect(result.skipped).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.reason).toMatch(/DTD path was not provided/i);
  });

  it("skips when the DTD file is missing", () => {
    const result = validateCurriculumXml(xml, {
      dtd: true,
      dtdPath: "DEFINITIONS/does-not-exist.dtd",
    });

    expect(result.skipped).toBe(true);
    expect(result.reason).toMatch(/DTD not found/i);
  });

  it("validates a minimal fixture when a local DTD is present", () => {
    const { dtdPath, xmlPath } = writeFixture();
    const result = validateCurriculumXml(xml, {
      dtd: true,
      dtdPath,
      xmlPath,
    });

    const xmllint = spawnSync("xmllint", ["--version"], { encoding: "utf8" });
    if (xmllint.error || xmllint.status !== 0) {
      expect(result.skipped).toBe(true);
      expect(result.reason).toMatch(/xmllint/i);
      return;
    }

    expect(result.skipped).toBeUndefined();
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it("forwards xmllint errors when the XML does not match the DTD", () => {
    const { dtdPath } = writeFixture();
    const result = validateCurriculumXml(invalidXml, {
      dtd: true,
      dtdPath,
    });

    const xmllint = spawnSync("xmllint", ["--version"], { encoding: "utf8" });
    if (xmllint.error || xmllint.status !== 0) {
      expect(result.skipped).toBe(true);
      return;
    }

    expect(result.valid).toBe(false);
    expect(result.skipped).toBeUndefined();
    expect(result.errors.length).toBeGreaterThan(0);
  });
});
