import type { KnowledgeAreaEntry, ProductionEnvelope } from "../../types.js";
import { asRecord, type XmlRecord } from "../../parse/xml-utils.js";

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

function setAttrPreserve(
  record: XmlRecord,
  name: string,
  value: string | undefined,
): void {
  if (value !== undefined) {
    record[`@_${name}`] = value;
  }
}

function writeAttributeMap(record: XmlRecord, values: Record<string, string> | undefined): void {
  if (!values) {
    return;
  }
  for (const [name, value] of Object.entries(values)) {
    setAttrPreserve(record, name, value);
  }
}

function findChildByPrefix(
  record: XmlRecord,
  prefix: string,
): { tag: string; node: XmlRecord } | undefined {
  for (const [key, value] of Object.entries(record)) {
    if (!key.startsWith(prefix)) {
      continue;
    }
    const node = asRecord(value);
    if (node) {
      return { tag: key, node };
    }
  }
  return undefined;
}

function ensurePrefixedChild(record: XmlRecord, prefix: string, fallbackTag: string): XmlRecord {
  const existing = findChildByPrefix(record, prefix);
  if (existing) {
    return existing.node;
  }
  const created: XmlRecord = {};
  record[fallbackTag] = created;
  return created;
}

function syncKeywords(record: XmlRecord, keywords: string[] | undefined): void {
  if (!keywords || keywords.length === 0) {
    return;
  }
  let node = firstRecord(record["PALAVRAS-CHAVE"]);
  if (!node) {
    node = {};
    record["PALAVRAS-CHAVE"] = node;
  }
  keywords.slice(0, 6).forEach((word, index) => {
    setAttrPreserve(node, `PALAVRA-CHAVE-${index + 1}`, word);
  });
}

function syncKnowledgeAreas(
  record: XmlRecord,
  areas: KnowledgeAreaEntry[] | undefined,
): void {
  if (!areas || areas.length === 0) {
    return;
  }
  let root = firstRecord(record["AREAS-DO-CONHECIMENTO"]);
  if (!root) {
    root = {};
    record["AREAS-DO-CONHECIMENTO"] = root;
  }
  areas.slice(0, 3).forEach((entry, index) => {
    const tag = `AREA-DO-CONHECIMENTO-${index + 1}`;
    let node = asRecord(root[tag]);
    if (!node) {
      node = {};
      root[tag] = node;
    }
    for (const [field, name] of KNOWLEDGE_AREA_ATTRS) {
      setAttrPreserve(node, name, entry[field]);
    }
  });
}

function syncActivitySectors(record: XmlRecord, sectors: string[] | undefined): void {
  if (!sectors || sectors.length === 0) {
    return;
  }
  let node = firstRecord(record["SETORES-DE-ATIVIDADE"]);
  if (!node) {
    node = {};
    record["SETORES-DE-ATIVIDADE"] = node;
  }
  sectors.slice(0, 3).forEach((sector, index) => {
    setAttrPreserve(node, `SETOR-DE-ATIVIDADE-${index + 1}`, sector);
  });
}

function syncAdditionalInfo(record: XmlRecord, item: ProductionEnvelope): void {
  const info = item.additionalInfo;
  if (!info) {
    return;
  }
  if (info.description === undefined && info.descriptionEnglish === undefined) {
    return;
  }
  let node = firstRecord(record["INFORMACOES-ADICIONAIS"]);
  if (!node) {
    node = {};
    record["INFORMACOES-ADICIONAIS"] = node;
  }
  setAttrPreserve(node, "DESCRICAO-INFORMACOES-ADICIONAIS", info.description);
  setAttrPreserve(
    node,
    "DESCRICAO-INFORMACOES-ADICIONAIS-INGLES",
    info.descriptionEnglish,
  );
}

function detailFallbackTag(record: XmlRecord): string | undefined {
  const basics = findChildByPrefix(record, "DADOS-BASICOS");
  if (!basics) {
    return undefined;
  }
  return basics.tag.replace(/^DADOS-BASICOS/, "DETALHAMENTO");
}

/**
 * Writes envelope fields onto the existing basics/detail children and metadata
 * siblings. Unknown attributes and sibling nodes such as AUTORES are kept.
 */
export function syncProductionEnvelope(record: XmlRecord, item: ProductionEnvelope): void {
  const basics = findChildByPrefix(record, "DADOS-BASICOS");
  if (basics) {
    writeAttributeMap(basics.node, item.basics);
  }

  if (item.detail && Object.keys(item.detail).length > 0) {
    const fallback = detailFallbackTag(record);
    const detail = fallback
      ? ensurePrefixedChild(record, "DETALHAMENTO", fallback)
      : findChildByPrefix(record, "DETALHAMENTO")?.node;
    if (detail) {
      writeAttributeMap(detail, item.detail);
    }
  }

  syncKeywords(record, item.keywords);
  syncKnowledgeAreas(record, item.knowledgeAreas);
  syncActivitySectors(record, item.activitySectors);
  syncAdditionalInfo(record, item);
}
