import type { Curriculum } from "../types.js";
import { asRecord, type XmlRecord } from "../parse/xml-utils.js";

function setAttr(record: XmlRecord, name: string, value: string | undefined): void {
  if (value === undefined) {
    delete record[`@_${name}`];
    return;
  }
  record[`@_${name}`] = value;
}

function setTextElement(record: XmlRecord, tag: string, value: string | undefined): void {
  if (value === undefined) {
    delete record[tag];
    return;
  }
  record[tag] = value;
}

/** Applies typed Curriculum fields onto the XML document tree before serialization. */
export function syncCvToDocument(cv: Curriculum): void {
  const root = cv.document;
  const dadosGerais = asRecord(root["DADOS-GERAIS"]) ?? {};
  root["DADOS-GERAIS"] = dadosGerais;

  setAttr(dadosGerais, "NOME-COMPLETO", cv.identification.fullName);
  setAttr(dadosGerais, "NOME-CITACOES", cv.identification.citationName);
  setTextElement(dadosGerais, "RESUMO-CV", cv.identification.summary);
  setTextElement(
    dadosGerais,
    "OUTRAS-INFORMACOES-RELEVANTES",
    cv.identification.otherRelevantInfo,
  );

  setAttr(root, "NUMERO-IDENTIFICADOR", cv.id);
  setAttr(root, "DATA-ATUALIZACAO", cv.updatedAt.rawDate || undefined);
  setAttr(root, "HORA-ATUALIZACAO", cv.updatedAt.rawTime || undefined);
}
