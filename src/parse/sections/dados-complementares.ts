import type {
  AdditionalCourse,
  AdditionalInstitution,
  ComplementaryData,
  ComplementaryTraining,
  EventParticipation,
} from "../../types.js";
import { asArray, asRecord, attr, pickUnmapped, type XmlRecord } from "../xml-utils.js";

const COMPLEMENTARY_TAGS = [
  "FORMACAO-COMPLEMENTAR-CURSO-DE-CURTA-DURACAO",
  "FORMACAO-COMPLEMENTAR-DE-EXTENSAO-UNIVERSITARIA",
  "FORMACAO-COMPLEMENTAR-DE-APERFEICOAMENTO",
  "FORMACAO-COMPLEMENTAR-DE-ESPECIALIZACAO",
  "OUTROS",
] as const;

const EVENT_TAGS = [
  "PARTICIPACAO-EM-CONGRESSO",
  "PARTICIPACAO-EM-ENCONTRO",
  "PARTICIPACAO-EM-SEMINARIO",
  "PARTICIPACAO-EM-SIMPOSIO",
  "PARTICIPACAO-EM-OFICINA",
  "OUTRAS-PARTICIPACOES-EM-EVENTOS-CONGRESSOS",
] as const;

function basicsTagForEvent(type: string): string {
  return `DADOS-BASICOS-DA-${type}`;
}

export function mapComplementaryData(
  complement: XmlRecord | undefined,
): ComplementaryData {
  const empty: ComplementaryData = {
    complementaryTraining: [],
    eventParticipation: [],
    additionalInstitutions: [],
    additionalCourses: [],
    unmapped: {},
  };
  if (!complement) {
    return empty;
  }

  const trainingRoot = asRecord(complement["FORMACAO-COMPLEMENTAR"]);
  const training: ComplementaryTraining[] = [];
  if (trainingRoot) {
    for (const tag of COMPLEMENTARY_TAGS) {
      for (const entry of asArray(trainingRoot[tag])) {
        const record = asRecord(entry);
        if (!record) {
          continue;
        }
        training.push({
          type: tag,
          title: attr(record, "NOME-CURSO"),
          institution: attr(record, "NOME-INSTITUICAO"),
          workload: attr(record, "CARGA-HORARIA"),
          startYear: attr(record, "ANO-DE-INICIO"),
          endYear: attr(record, "ANO-DE-CONCLUSAO"),
          status: attr(record, "STATUS-DO-CURSO"),
          sequence: attr(record, "SEQUENCIA-FORMACAO"),
          raw: record,
        });
      }
    }
  }

  const eventsRoot = asRecord(complement["PARTICIPACAO-EM-EVENTOS-CONGRESSOS"]);
  const events: EventParticipation[] = [];
  if (eventsRoot) {
    for (const tag of EVENT_TAGS) {
      for (const entry of asArray(eventsRoot[tag])) {
        const record = asRecord(entry);
        if (!record) {
          continue;
        }
        const basics =
          asRecord(record[basicsTagForEvent(tag)]) ??
          asRecord(record[`DADOS-BASICOS-DE-${tag}`]) ??
          record;
        const detail =
          asRecord(record[`DETALHAMENTO-DA-${tag}`]) ??
          asRecord(record[`DETALHAMENTO-DE-${tag}`]) ??
          asRecord(record["DETALHAMENTO-DA-PARTICIPACAO-EM-CONGRESSO"]);
        events.push({
          type: tag,
          title: attr(basics, "TITULO") ?? attr(basics, "TITULO-INGLES"),
          year: attr(basics, "ANO"),
          eventName: attr(detail, "NOME-DO-EVENTO"),
          city: attr(detail, "CIDADE-DO-EVENTO"),
          sequence: attr(record, "SEQUENCIA-PRODUCAO"),
          raw: record,
        });
      }
    }
  }

  const institutionsRoot = asRecord(complement["INFORMACOES-ADICIONAIS-INSTITUICOES"]);
  const institutions: AdditionalInstitution[] = asArray(
    institutionsRoot?.["INFORMACAO-ADICIONAL-INSTITUICAO"],
  ).flatMap((entry) => {
    const record = asRecord(entry);
    if (!record) {
      return [];
    }
    const code = attr(record, "CODIGO-INSTITUICAO");
    if (!code) {
      return [];
    }
    return [
      {
        institutionCode: code,
        acronym: attr(record, "SIGLA-INSTITUICAO"),
        country: attr(record, "NOME-PAIS-INSTITUICAO"),
        raw: record,
      },
    ];
  });

  const coursesRoot = asRecord(complement["INFORMACOES-ADICIONAIS-CURSOS"]);
  const courses: AdditionalCourse[] = asArray(
    coursesRoot?.["INFORMACAO-ADICIONAL-CURSO"],
  ).flatMap((entry) => {
    const record = asRecord(entry);
    if (!record) {
      return [];
    }
    const code = attr(record, "CODIGO-CURSO");
    if (!code) {
      return [];
    }
    return [
      {
        courseCode: code,
        institutionCode: attr(record, "CODIGO-INSTITUICAO"),
        institutionName: attr(record, "NOME-INSTITUICAO"),
        raw: record,
      },
    ];
  });

  return {
    complementaryTraining: training,
    eventParticipation: events,
    additionalInstitutions: institutions,
    additionalCourses: courses,
    unmapped: pickUnmapped(complement, [
      "FORMACAO-COMPLEMENTAR",
      "PARTICIPACAO-EM-EVENTOS-CONGRESSOS",
      "INFORMACOES-ADICIONAIS-INSTITUICOES",
      "INFORMACOES-ADICIONAIS-CURSOS",
      "ORIENTACOES-CONCLUIDAS",
      "ORIENTACOES-EM-ANDAMENTO",
      "PARTICIPACAO-EM-BANCA-TRABALHOS-CONCLUSAO",
      "PARTICIPACAO-EM-BANCA-JULGADORA",
    ]),
  };
}
