import type { Author } from "../types.js";
import { asArray, asRecord, type XmlRecord } from "../parse/xml-utils.js";

function setAttrPreserve(
  record: XmlRecord,
  name: string,
  value: string | undefined,
): void {
  if (value !== undefined) {
    record[`@_${name}`] = value;
  }
}

function writeSiblingArray(parent: XmlRecord, tag: string, entries: unknown[]): void {
  delete parent["AUTOR"];
  const nested = asRecord(parent[tag]);
  if (nested && "AUTOR" in nested) {
    delete parent[tag];
  }
  if (entries.length === 0) {
    delete parent[tag];
    return;
  }
  parent[tag] = entries.length === 1 ? entries[0] : entries;
}

/** Writes XSD-style repeated AUTORES siblings on the production node. */
export function syncAuthorsOnRecord(record: XmlRecord, authors: Author[]): void {
  if (authors.length === 0) {
    return;
  }

  const nodes = authors.map((author) => {
    const existing = asRecord(author.raw);
    const node: XmlRecord = existing ?? {};
    setAttrPreserve(node, "NOME-COMPLETO-DO-AUTOR", author.name);
    setAttrPreserve(node, "NOME-PARA-CITACAO", author.citationName);
    if (author.order !== undefined) {
      setAttrPreserve(node, "ORDEM-DE-AUTORIA", String(author.order));
    }
    return node;
  });

  writeSiblingArray(record, "AUTORES", nodes);
}

/** Removes legacy AUTOR wrappers if present. */
export function normalizeAuthorsShape(record: XmlRecord): void {
  const autores = asRecord(record["AUTORES"]);
  if (autores && autores["AUTOR"]) {
    const legacy = asArray(autores["AUTOR"]).flatMap((entry) => {
      const node = asRecord(entry);
      return node ? [node] : [];
    });
    writeSiblingArray(record, "AUTORES", legacy);
  }
}
