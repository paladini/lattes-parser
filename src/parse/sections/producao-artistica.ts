import type { ArtisticItem } from "../../types.js";
import { ARTISTIC_TYPE_SPECS } from "../../schema/artistic-production-catalog.js";
import { mapAuthors } from "../authors.js";
import { parseProductionEnvelope } from "../production/envelope.js";
import { asArray, asRecord, attr, type XmlRecord } from "../xml-utils.js";

function basicsRecord(record: XmlRecord): XmlRecord | undefined {
  for (const [key, value] of Object.entries(record)) {
    if (key.startsWith("DADOS-BASICOS")) {
      const child = asRecord(value);
      if (child) {
        return child;
      }
    }
  }
  return undefined;
}

function titleFromBasics(basics: XmlRecord | undefined, record: XmlRecord): string | undefined {
  if (basics) {
    for (const [key, value] of Object.entries(basics)) {
      if (!key.startsWith("@_TITULO") && key !== "@_DENOMINACAO") {
        continue;
      }
      if (typeof value === "string" && value) {
        return value;
      }
    }
  }
  return attr(record, "TITULO");
}

function mapArtisticEntries(
  entries: unknown[],
  spec: (typeof ARTISTIC_TYPE_SPECS)[number],
): ArtisticItem[] {
  return entries.flatMap((entry) => {
    const record = asRecord(entry);
    if (!record) {
      return [];
    }
    const basics = basicsRecord(record);
    const title = titleFromBasics(basics, record);
    if (!title) {
      return [];
    }
    return [
      {
        type: spec.typeLabel,
        xmlTag: spec.xmlTag,
        containerTag: spec.containerTag,
        title,
        year: basics ? attr(basics, "ANO") : undefined,
        sequence: attr(record, "SEQUENCIA-PRODUCAO"),
        authors: mapAuthors(record),
        ...parseProductionEnvelope(record),
        raw: record,
      },
    ];
  });
}

export function mapArtisticProduction(otherProduction: unknown): ArtisticItem[] {
  const root = asRecord(otherProduction);
  if (!root) {
    return [];
  }
  const cultural = asRecord(root["PRODUCAO-ARTISTICA-CULTURAL"]);
  const items: ArtisticItem[] = [];
  for (const spec of ARTISTIC_TYPE_SPECS) {
    const parent = spec.containerTag ? cultural : root;
    if (!parent) {
      continue;
    }
    items.push(...mapArtisticEntries(asArray(parent[spec.xmlTag]), spec));
  }
  return items;
}
