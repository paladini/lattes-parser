import { zipSync } from "fflate";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const fixturesDir = join(dirname(fileURLToPath(import.meta.url)), "../fixtures");

export function loadSampleXml(): string {
  return readFileSync(join(fixturesDir, "curriculum-sample.xml"), "latin1");
}

export function loadSampleXmlBytes(): Uint8Array {
  return readFileSync(join(fixturesDir, "curriculum-sample.xml"));
}

export function zipSampleCurriculum(): Uint8Array {
  const xml = loadSampleXmlBytes();
  return zipSync({ "8907059238612691.xml": xml });
}
