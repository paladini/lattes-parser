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

function deleteAttr(record: XmlRecord, name: string): void {
  delete record[`@_${name}`];
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
  if (keywords === undefined) {
    return;
  }
  if (keywords.length === 0) {
    delete record["PALAVRAS-CHAVE"];
    return;
  }
  let node = firstRecord(record["PALAVRAS-CHAVE"]);
  if (!node) {
    node = {};
    record["PALAVRAS-CHAVE"] = node;
  }
  for (let index = 1; index <= 6; index += 1) {
    const word = keywords[index - 1];
    if (word !== undefined) {
      setAttrPreserve(node, `PALAVRA-CHAVE-${index}`, word);
    } else {
      deleteAttr(node, `PALAVRA-CHAVE-${index}`);
    }
  }
}

function syncKnowledgeAreas(
  record: XmlRecord,
  areas: KnowledgeAreaEntry[] | undefined,
): void {
  if (areas === undefined) {
    return;
  }
  if (areas.length === 0) {
    delete record["AREAS-DO-CONHECIMENTO"];
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
  for (let index = areas.length + 1; index <= 3; index += 1) {
    delete root[`AREA-DO-CONHECIMENTO-${index}`];
  }
}

function syncActivitySectors(record: XmlRecord, sectors: string[] | undefined): void {
  if (sectors === undefined) {
    return;
  }
  if (sectors.length === 0) {
    delete record["SETORES-DE-ATIVIDADE"];
    return;
  }
  let node = firstRecord(record["SETORES-DE-ATIVIDADE"]);
  if (!node) {
    node = {};
    record["SETORES-DE-ATIVIDADE"] = node;
  }
  for (let index = 1; index <= 3; index += 1) {
    const sector = sectors[index - 1];
    if (sector !== undefined) {
      setAttrPreserve(node, `SETOR-DE-ATIVIDADE-${index}`, sector);
    } else {
      deleteAttr(node, `SETOR-DE-ATIVIDADE-${index}`);
    }
  }
}

function syncAdditionalInfo(record: XmlRecord, item: ProductionEnvelope): void {
  if (item.additionalInfo === undefined) {
    return;
  }
  const info = item.additionalInfo;
  let node = firstRecord(record["INFORMACOES-ADICIONAIS"]);
  if (!node) {
    node = {};
    record["INFORMACOES-ADICIONAIS"] = node;
  }
  if (info.description !== undefined) {
    setAttrPreserve(node, "DESCRICAO-INFORMACOES-ADICIONAIS", info.description);
  } else {
    deleteAttr(node, "DESCRICAO-INFORMACOES-ADICIONAIS");
  }
  if (info.descriptionEnglish !== undefined) {
    setAttrPreserve(
      node,
      "DESCRICAO-INFORMACOES-ADICIONAIS-INGLES",
      info.descriptionEnglish,
    );
  } else {
    deleteAttr(node, "DESCRICAO-INFORMACOES-ADICIONAIS-INGLES");
  }
  const hasAttributes = Object.keys(node).some((key) => key.startsWith("@_"));
  if (!hasAttributes) {
    delete record["INFORMACOES-ADICIONAIS"];
  }
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
