import { XMLBuilder } from "fast-xml-parser";
import { InvalidCurriculumXmlError } from "../errors.js";
import type { Curriculum } from "../types.js";
import { syncCvToDocument } from "./sync-document.js";

const xmlBuilder = new XMLBuilder({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
  format: true,
  suppressEmptyNode: false,
  processEntities: true,
});

export function serializeCurriculum(cv: Curriculum): string {
  if (!cv.document || typeof cv.document !== "object") {
    throw new InvalidCurriculumXmlError(
      "Curriculum.document is missing; parse from XML before serializing",
    );
  }

  syncCvToDocument(cv);
  const body = xmlBuilder.build({ "CURRICULO-VITAE": cv.document });
  return `<?xml version="1.0" encoding="ISO-8859-1"?>\n${body}`;
}
