import { unzipSync } from "fflate";
import { InvalidCurriculumArchiveError } from "../errors.js";

export function extractXmlFromZip(buffer: Uint8Array): Uint8Array {
  let entries: Record<string, Uint8Array>;
  try {
    entries = unzipSync(buffer);
  } catch {
    throw new InvalidCurriculumArchiveError("Invalid or corrupted ZIP archive");
  }

  const names = Object.keys(entries).filter((name) => !name.endsWith("/"));
  if (names.length === 0) {
    throw new InvalidCurriculumArchiveError("ZIP archive contains no files");
  }

  const xmlName =
    names.find((name) => name.toLowerCase().endsWith(".xml")) ?? names[0];
  const content = entries[xmlName];
  if (!content) {
    throw new InvalidCurriculumArchiveError("Unable to read XML entry from ZIP");
  }

  return content;
}
