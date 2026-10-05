import { describe, expect, it } from "vitest";
import {
  applyCurriculumPatches,
  getCurriculumValue,
  parseCurriculum,
  setCurriculumValue,
} from "../src/index.js";
import { loadSampleXml } from "./helpers/zip.js";

describe("curriculum paths", () => {
  it("gets and sets nested fields", () => {
    const cv = parseCurriculum(loadSampleXml());
    expect(getCurriculumValue(cv, "identification.fullName")).toBe(
      "Pesquisador Síntese",
    );

    setCurriculumValue(cv, "identification.summary", "Novo resumo.");
    expect(cv.identification.summary).toBe("Novo resumo.");
  });

  it("applyCurriculumPatches respects allowlist", () => {
    const cv = parseCurriculum(loadSampleXml());
    applyCurriculumPatches(
      cv,
      [{ path: "identification.summary", value: "Patch ok" }],
      { allowlist: ["identification.summary"] },
    );
    expect(cv.identification.summary).toBe("Patch ok");

    expect(() =>
      applyCurriculumPatches(
        cv,
        [{ path: "id", value: "x" }],
        { allowlist: ["identification.summary"] },
      ),
    ).toThrow(/not allowed/);
  });
});
