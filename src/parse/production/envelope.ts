import type {
  KnowledgeAreaEntry,
  ProductionAdditionalInfo,
  ProductionEnvelope,
} from "../../types.js";
import { asRecord, attr, type XmlRecord } from "../xml-utils.js";

const KNOWLEDGE_AREA_ATTRS: Array<[keyof KnowledgeAreaEntry, string]> = [
  ["majorArea", "NOME-GRANDE-AREA-DO-CONHECIMENTO"],
  ["area", "NOME-DA-AREA-DO-CONHECIMENTO"],
  ["subArea", "NOME-DA-SUB-AREA-DO-CONHECIMENTO"],
  ["specialty", "NOME-DA-ESPECIALIDADE"],
];

function firstRecord(value: unknown): XmlRecord | undefined {
  if (Array.isArray(value)) {
    return asRecord(value[0]);
  }
  return asRecord(value);
}

function attributeMap(record: XmlRecord | undefined): Record<string, string> {
  if (!record) {
    return {};
  }
  const mapped: Record<string, string> = {};
  for (const key of Object.keys(record)) {
    if (!key.startsWith("@_")) {
      continue;
    }
    const name = key.slice(2);
    const value = attr(record, name);
    if (value) {
      mapped[name] = value;
    }
  }
  return mapped;
}

function firstChildByPrefix(record: XmlRecord, prefix: string): XmlRecord | undefined {
  for (const [key, value] of Object.entries(record)) {
    if (!key.startsWith(prefix)) {
      continue;
    }
    const child = asRecord(value);
    if (child) {
      return child;
    }
  }
  return undefined;
}

function parseKeywords(record: XmlRecord): string[] {
  const node = firstRecord(record["PALAVRAS-CHAVE"]);
  if (!node) {
    return [];
  }
  const keywords: string[] = [];
  for (let index = 1; index <= 6; index += 1) {
    const value = attr(node, `PALAVRA-CHAVE-${index}`);
    if (value) {
      keywords.push(value);
    }
  }
  return keywords;
}

function parseKnowledgeAreas(record: XmlRecord): KnowledgeAreaEntry[] {
  const root = firstRecord(record["AREAS-DO-CONHECIMENTO"]);
  if (!root) {
    return [];
  }
  const areas: KnowledgeAreaEntry[] = [];
  for (let index = 1; index <= 3; index += 1) {
    const node = asRecord(root[`AREA-DO-CONHECIMENTO-${index}`]);
    if (!node) {
      continue;
    }
    const entry: KnowledgeAreaEntry = {};
    for (const [field, name] of KNOWLEDGE_AREA_ATTRS) {
      const value = attr(node, name);
      if (value) {
        entry[field] = value;
      }
    }
    if (
      entry.majorArea ||
      entry.area ||
      entry.subArea ||
      entry.specialty
    ) {
      areas.push(entry);
    }
  }
  return areas;
}

function parseActivitySectors(record: XmlRecord): string[] {
  const node = firstRecord(record["SETORES-DE-ATIVIDADE"]);
  if (!node) {
    return [];
  }
  const sectors: string[] = [];
  for (let index = 1; index <= 3; index += 1) {
    const value = attr(node, `SETOR-DE-ATIVIDADE-${index}`);
    if (value) {
      sectors.push(value);
    }
  }
  return sectors;
}

function parseAdditionalInfo(
  record: XmlRecord,
): ProductionAdditionalInfo | undefined {
  const node = firstRecord(record["INFORMACOES-ADICIONAIS"]);
  if (!node) {
    return undefined;
  }
  const description = attr(node, "DESCRICAO-INFORMACOES-ADICIONAIS");
  const descriptionEnglish = attr(node, "DESCRICAO-INFORMACOES-ADICIONAIS-INGLES");
  if (!description && !descriptionEnglish) {
    return undefined;
  }
  return {
    description,
    descriptionEnglish,
  };
}

/** Reads the shared XSD production envelope from one technical item node. */
export function parseProductionEnvelope(record: XmlRecord): ProductionEnvelope {
  return {
    basics: attributeMap(firstChildByPrefix(record, "DADOS-BASICOS")),
    detail: attributeMap(firstChildByPrefix(record, "DETALHAMENTO")),
    keywords: parseKeywords(record),
    knowledgeAreas: parseKnowledgeAreas(record),
    activitySectors: parseActivitySectors(record),
    additionalInfo: parseAdditionalInfo(record),
  };
}
