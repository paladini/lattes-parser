import { parseCurriculum } from "../parse/parse-curriculum.js";
import type { Curriculum } from "../types.js";
import { decodeXmlBuffer, looksLikeXml, looksLikeZip } from "./decode.js";
import { extractXmlFromZip } from "./zip.js";

function toBuffer(input: Buffer | Uint8Array | string): Uint8Array {
  if (typeof input === "string") {
    return Buffer.from(input, "utf8");
  }
  return input instanceof Uint8Array ? input : new Uint8Array(input);
}

export async function readCurriculum(
  input: Buffer | Uint8Array | string,
): Promise<Curriculum> {
  const buffer = toBuffer(input);
  let xmlBytes: Uint8Array;

  if (looksLikeZip(buffer)) {
    xmlBytes = extractXmlFromZip(buffer);
  } else if (looksLikeXml(buffer)) {
    xmlBytes = buffer;
  } else if (typeof input === "string") {
    return parseCurriculum(input);
  } else {
    xmlBytes = buffer;
  }

  const xml = decodeXmlBuffer(xmlBytes);
  return parseCurriculum(xml);
}
