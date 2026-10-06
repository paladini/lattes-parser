import type { Author } from "../types.js";
import { asArray, asRecord, attr, textContent, type XmlRecord } from "./xml-utils.js";

/** XSD: repeated sibling AUTORES elements with attributes (not AUTORES > AUTOR). */
export function mapAuthors(node: unknown): Author[] {
  const record = asRecord(node);
  if (!record) {
    return [];
  }

  const autoresEntries = asArray(record["AUTORES"]);
  if (
    autoresEntries.length > 0 &&
    (attr(asRecord(autoresEntries[0]), "NOME-COMPLETO-DO-AUTOR") ||
      attr(asRecord(autoresEntries[0]), "NOME-PARA-CITACAO"))
  ) {
    return autoresEntries.flatMap((entry) => {
      const authorRecord = asRecord(entry);
      if (!authorRecord) {
        return [];
      }
      const name =
        attr(authorRecord, "NOME-COMPLETO-DO-AUTOR") ??
        attr(authorRecord, "NOME-PARA-CITACAO") ??
        textContent(authorRecord);
      if (!name) {
        return [];
      }
      const orderRaw = attr(authorRecord, "ORDEM-DE-AUTORIA");
      return [
        {
          name,
          citationName: attr(authorRecord, "NOME-PARA-CITACAO"),
          order: orderRaw ? Number(orderRaw) : undefined,
          raw: authorRecord,
        },
      ];
    });
  }

  const autoresNode = asRecord(record["AUTORES"]);
  const authorNodes = autoresNode
    ? asArray(autoresNode["AUTOR"])
    : asArray(record["AUTOR"]);

  return authorNodes.flatMap((entry) => {
    const authorRecord = asRecord(entry);
    if (!authorRecord) {
      return [];
    }
    const name =
      attr(authorRecord, "NOME-COMPLETO-DO-AUTOR") ??
      textContent(authorRecord) ??
      attr(authorRecord, "NOME-PARA-CITACAO");
    if (!name) {
      return [];
    }
    const orderRaw = attr(authorRecord, "ORDEM-DE-AUTORIA");
    return [
      {
        name,
        citationName: attr(authorRecord, "NOME-PARA-CITACAO"),
        order: orderRaw ? Number(orderRaw) : undefined,
        raw: authorRecord,
      },
    ];
  });
}

export function readSummaryText(dadosGerais: XmlRecord): string | undefined {
  const resumo = asRecord(dadosGerais["RESUMO-CV"]);
  return (
    attr(resumo, "TEXTO-RESUMO-CV-RH") ??
    textContent(dadosGerais["RESUMO-CV"])
  );
}

export function readOtherRelevantInfo(dadosGerais: XmlRecord): string | undefined {
  const node = asRecord(dadosGerais["OUTRAS-INFORMACOES-RELEVANTES"]);
  return (
    attr(node, "OUTRAS-INFORMACOES-RELEVANTES") ??
    textContent(dadosGerais["OUTRAS-INFORMACOES-RELEVANTES"])
  );
}

export function readCitationName(dadosGerais: XmlRecord): string | undefined {
  return (
    attr(dadosGerais, "NOME-EM-CITACOES-BIBLIOGRAFICAS") ??
    attr(dadosGerais, "NOME-CITACOES")
  );
}
