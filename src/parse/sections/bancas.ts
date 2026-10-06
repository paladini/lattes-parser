import type { BoardParticipant, BoardParticipation } from "../../types.js";
import { parseProductionEnvelope } from "../production/envelope.js";
import { asArray, asRecord, attr, type XmlRecord } from "../xml-utils.js";

export const THESIS_BOARD_CONTAINER = "PARTICIPACAO-EM-BANCA-TRABALHOS-CONCLUSAO";
export const JUDGING_BOARD_CONTAINER = "PARTICIPACAO-EM-BANCA-JULGADORA";

const THESIS_BOARD_TAGS = [
  "PARTICIPACAO-EM-BANCA-DE-MESTRADO",
  "PARTICIPACAO-EM-BANCA-DE-DOUTORADO",
  "PARTICIPACAO-EM-BANCA-DE-EXAME-QUALIFICACAO",
  "PARTICIPACAO-EM-BANCA-DE-APERFEICOAMENTO-ESPECIALIZACAO",
  "PARTICIPACAO-EM-BANCA-DE-GRADUACAO",
  "OUTRAS-PARTICIPACOES-EM-BANCA",
] as const;

const JUDGING_BOARD_TAGS = [
  "BANCA-JULGADORA-PARA-PROFESSOR-TITULAR",
  "BANCA-JULGADORA-PARA-CONCURSO-PUBLICO",
  "BANCA-JULGADORA-PARA-LIVRE-DOCENCIA",
  "BANCA-JULGADORA-PARA-AVALIACAO-CURSOS",
  "OUTRAS-BANCAS-JULGADORAS",
] as const;

function mapBoardParticipants(record: XmlRecord): BoardParticipant[] {
  return asArray(record["PARTICIPANTE-BANCA"]).flatMap((entry) => {
    const node = asRecord(entry);
    if (!node) {
      return [];
    }
    const name = attr(node, "NOME-COMPLETO-DO-PARTICIPANTE-DA-BANCA");
    if (!name) {
      return [];
    }
    const orderRaw = attr(node, "ORDEM-PARTICIPANTE");
    const orderNumber = orderRaw === undefined ? Number.NaN : Number(orderRaw);
    return [
      {
        name,
        citationName: attr(node, "NOME-PARA-CITACAO-DO-PARTICIPANTE-DA-BANCA"),
        order: Number.isFinite(orderNumber) ? orderNumber : undefined,
        raw: node,
      },
    ];
  });
}

function mapBoardEntry(
  record: XmlRecord,
  xmlTag: string,
  kind: BoardParticipation["kind"],
): BoardParticipation | undefined {
  const basics =
    asRecord(record[`DADOS-BASICOS-DA-${xmlTag}`]) ??
    asRecord(record[`DADOS-BASICOS-DE-${xmlTag}`]);
  const detail =
    asRecord(record[`DETALHAMENTO-DA-${xmlTag}`]) ??
    asRecord(record[`DETALHAMENTO-DE-${xmlTag}`]);
  const title =
    attr(basics, "TITULO") ?? attr(basics, "TITULO-INGLES") ?? attr(record, "TITULO");
  if (!title) {
    return undefined;
  }
  return {
    kind,
    xmlTag,
    title,
    year: attr(basics, "ANO"),
    sequence: attr(record, "SEQUENCIA-PRODUCAO"),
    candidateName: attr(detail, "NOME-DO-CANDIDATO"),
    institution: attr(detail, "NOME-INSTITUICAO"),
    participants: mapBoardParticipants(record),
    ...parseProductionEnvelope(record),
    raw: record,
  };
}

function mapBoardsInContainer(
  complement: XmlRecord,
  containerTag: string,
  itemTags: readonly string[],
  kind: BoardParticipation["kind"],
): BoardParticipation[] {
  const container = asRecord(complement[containerTag]);
  if (!container) {
    return [];
  }
  const boards: BoardParticipation[] = [];
  for (const tag of itemTags) {
    for (const entry of asArray(container[tag])) {
      const record = asRecord(entry);
      if (!record) {
        continue;
      }
      const mapped = mapBoardEntry(record, tag, kind);
      if (mapped) {
        boards.push(mapped);
      }
    }
  }
  return boards;
}

export function mapBoardParticipation(complement: XmlRecord | undefined): BoardParticipation[] {
  if (!complement) {
    return [];
  }
  return [
    ...mapBoardsInContainer(complement, THESIS_BOARD_CONTAINER, THESIS_BOARD_TAGS, "thesis"),
    ...mapBoardsInContainer(complement, JUDGING_BOARD_CONTAINER, JUDGING_BOARD_TAGS, "judging"),
  ];
}
