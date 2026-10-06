import type { TechnicalItem } from "../../types.js";
import {
  TECHNICAL_TITLE_READ_ATTRIBUTES,
  TECHNICAL_TYPE_SPECS,
  TECHNICAL_YEAR_READ_ATTRIBUTES,
} from "../../schema/technical-production-catalog.js";
import { mapAuthors } from "../authors.js";
import { parseProductionEnvelope } from "../production/envelope.js";
import { asArray, asRecord, attr, type XmlRecord } from "../xml-utils.js";

function titleFromTechnicalRecord(record: XmlRecord): string | undefined {
  for (const [key, value] of Object.entries(record)) {
    if (!key.startsWith("DADOS-BASICOS")) {
      continue;
    }
    const basics = asRecord(value);
    if (!basics) {
      continue;
    }
    for (const name of TECHNICAL_TITLE_READ_ATTRIBUTES) {
      const title = attr(basics, name);
      if (title) {
        return title;
      }
    }
  }
  return attr(record, "TITULO");
}

function yearFromTechnicalRecord(record: XmlRecord): string | undefined {
  for (const [key, value] of Object.entries(record)) {
    if (!key.startsWith("DADOS-BASICOS")) {
      continue;
    }
    const basics = asRecord(value);
    if (basics) {
      for (const name of TECHNICAL_YEAR_READ_ATTRIBUTES) {
        const year = attr(basics, name);
        if (year) {
          return year;
        }
      }
    }
  }
  return undefined;
}

function mapTechnicalEntries(
  entries: unknown[],
  spec: (typeof TECHNICAL_TYPE_SPECS)[number],
): TechnicalItem[] {
  return entries.flatMap((entry) => {
    const record = asRecord(entry);
    if (!record) {
      return [];
    }
    const title = titleFromTechnicalRecord(record);
    if (!title) {
      return [];
    }
    return [
      {
        type: spec.typeLabel,
        xmlTag: spec.xmlTag,
        containerTag: spec.containerTag,
        title,
        year: yearFromTechnicalRecord(record),
        sequence: attr(record, "SEQUENCIA-PRODUCAO"),
        authors: mapAuthors(record),
        ...parseProductionEnvelope(record),
        raw: record,
      },
    ];
  });
}

export function mapTechnicalProduction(node: unknown): TechnicalItem[] {
  const root = asRecord(node);
  if (!root) {
    return [];
  }

  const items: TechnicalItem[] = [];
  for (const spec of TECHNICAL_TYPE_SPECS) {
    if (spec.containerTag) {
      continue;
    }
    items.push(...mapTechnicalEntries(asArray(root[spec.xmlTag]), spec));
  }

  const demais = asRecord(root["DEMAIS-TIPOS-DE-PRODUCAO-TECNICA"]);
  if (demais) {
    for (const spec of TECHNICAL_TYPE_SPECS) {
      if (!spec.containerTag) {
        continue;
      }
      items.push(...mapTechnicalEntries(asArray(demais[spec.xmlTag]), spec));
    }
  }

  return items;
}
