import { InvalidCurriculumXmlError } from "../errors.js";
import { DEGREE_TAGS } from "../schema/degree-tags.js";
import type {
  AcademicDegree,
  Advisory,
  Award,
  BibliographicItem,
  Curriculum,
  EmploymentLink,
  LanguageEntry,
  ProfessionalActivity,
  ProfessionalAddress,
  ResearchArea,
} from "../types.js";
import {
  mapAuthors,
  readCitationName,
  readOtherRelevantInfo,
  readSummaryText,
} from "./authors.js";
import { parseLattesDateTime } from "./dates.js";
import { mapProjectParticipations } from "./sections/atuacao-profissional.js";
import { mapComplementaryData } from "./sections/dados-complementares.js";
import { mapTechnicalProduction } from "./sections/producao-tecnica.js";
import {
  asArray,
  asRecord,
  attr,
  pickUnmapped,
  textContent,
  xmlParser,
  type XmlRecord,
} from "./xml-utils.js";

function mapBibliographicItems(
  container: XmlRecord | undefined,
  itemTag: string,
  typeLabel: string,
): BibliographicItem[] {
  const items = asArray(container?.[itemTag]);
  return items.flatMap((item) => {
    const record = asRecord(item);
    if (!record) {
      return [];
    }
    const basics =
      asRecord(record["DADOS-BASICOS-DO-ARTIGO"]) ??
      asRecord(record["DADOS-BASICOS-DO-TRABALHO"]) ??
      asRecord(record["DADOS-BASICOS-DO-LIVRO"]) ??
      asRecord(record["DADOS-BASICOS-DO-CAPITULO"]) ??
      asRecord(record["DADOS-BASICOS-DE-OUTRAS-PRODUCOES-BIBLIOGRAFICAS"]) ??
      asRecord(record["DADOS-BASICOS-DE-OUTRA-PRODUCAO"]) ??
      record;

    const title =
      attr(basics, "TITULO-DO-ARTIGO") ??
      attr(basics, "TITULO-DO-TRABALHO") ??
      attr(basics, "TITULO-DO-LIVRO") ??
      attr(basics, "TITULO") ??
      textContent(basics);

    if (!title) {
      return [];
    }

    const detail =
      asRecord(record["DETALHAMENTO-DO-ARTIGO"]) ??
      asRecord(record["DETALHAMENTO-DO-TRABALHO"]) ??
      asRecord(record["DETALHAMENTO-DO-LIVRO"]) ??
      asRecord(record["DETALHAMENTO-DO-CAPITULO"]);

    return [
      {
        type: typeLabel,
        title,
        year: attr(basics, "ANO-DO-ARTIGO") ?? attr(basics, "ANO-DO-TRABALHO"),
        authors: mapAuthors(record),
        journalOrEvent:
          attr(detail, "TITULO-DO-PERIODICO-OU-REVISTA") ??
          attr(detail, "NOME-DO-EVENTO"),
        doi: attr(detail, "DOI"),
        sequence: attr(record, "SEQUENCIA-PRODUCAO"),
        raw: record,
      },
    ];
  });
}

function mapBooksAndChapters(booksContainer: XmlRecord | undefined): BibliographicItem[] {
  if (!booksContainer) {
    return [];
  }

  const flatBooks = mapBibliographicItems(
    booksContainer,
    "LIVRO-PUBLICADO-OU-ORGANIZADO",
    "book",
  );
  const flatChapters = mapBibliographicItems(
    booksContainer,
    "CAPITULO-DE-LIVRO-PUBLICADO",
    "book_chapter",
  );

  const nestedBooks = mapBibliographicItems(
    asRecord(booksContainer["LIVROS-PUBLICADOS-OU-ORGANIZADOS"]),
    "LIVRO-PUBLICADO-OU-ORGANIZADO",
    "book",
  );
  const nestedChapters = mapBibliographicItems(
    asRecord(booksContainer["CAPITULOS-DE-LIVROS-PUBLICADOS"]),
    "CAPITULO-DE-LIVRO-PUBLICADO",
    "book_chapter",
  );

  return [...flatBooks, ...flatChapters, ...nestedBooks, ...nestedChapters];
}

function mapAcademicBackground(node: unknown): AcademicDegree[] {
  const root = asRecord(node);
  if (!root) {
    return [];
  }

  const degrees: AcademicDegree[] = [];
  for (const tag of DEGREE_TAGS) {
    for (const entry of asArray(root[tag])) {
      const record = asRecord(entry);
      if (!record) {
        continue;
      }
      degrees.push({
        xmlTag: tag,
        level: attr(record, "NIVEL") ?? tag.replace(/-/g, " "),
        title:
          attr(record, "TITULO-DA-MONOGRAFIA") ??
          attr(record, "TITULO-DA-DISSERTACAO-TESE") ??
          attr(record, "TITULO-DO-TRABALHO-DE-CONCLUSAO-DE-CURSO"),
        institution: attr(record, "NOME-INSTITUICAO"),
        startYear: attr(record, "ANO-DE-INICIO"),
        endYear: attr(record, "ANO-DE-CONCLUSAO"),
        status: attr(record, "STATUS-DO-CURSO"),
        sequence: attr(record, "SEQUENCIA-FORMACAO"),
        raw: record,
      });
    }
  }

  return degrees;
}

function mapEmploymentLinks(node: unknown): EmploymentLink[] {
  return asArray(node).flatMap((entry) => {
    const record = asRecord(entry);
    if (!record) {
      return [];
    }
    return [
      {
        linkType: attr(record, "TIPO-DE-VINCULO"),
        functionalRole:
          attr(record, "OUTRO-ENQUADRAMENTO-FUNCIONAL-INFORMADO") ??
          attr(record, "ENQUADRAMENTO-FUNCIONAL"),
        weeklyHours: attr(record, "CARGA-HORARIA-SEMANAL"),
        exclusive: attr(record, "FLAG-DEDICACAO-EXCLUSIVA"),
        startMonth: attr(record, "MES-INICIO"),
        startYear: attr(record, "ANO-INICIO"),
        endMonth: attr(record, "MES-FIM"),
        endYear: attr(record, "ANO-FIM"),
        raw: record,
      },
    ];
  });
}

function mapProfessionalActivities(node: unknown): ProfessionalActivity[] {
  const root = asRecord(node);
  if (!root) {
    return [];
  }

  return asArray(root["ATUACAO-PROFISSIONAL"]).flatMap((entry) => {
    const record = asRecord(entry);
    if (!record) {
      return [];
    }
    const links = mapEmploymentLinks(record["VINCULOS"]);
    const primaryLink = links[0];
    return [
      {
        institution: attr(record, "NOME-INSTITUICAO"),
        institutionCode: attr(record, "CODIGO-INSTITUICAO"),
        role: primaryLink?.functionalRole ?? attr(record, "CARGO"),
        startYear: primaryLink?.startYear ?? attr(record, "ANO-DE-INICIO"),
        endYear: primaryLink?.endYear ?? attr(record, "ANO-DE-FIM"),
        links,
        projectParticipations: mapProjectParticipations(record),
        raw: record,
      },
    ];
  });
}

function mapResearchAreas(node: unknown): ResearchArea[] {
  const root = asRecord(node);
  if (!root) {
    return [];
  }

  return asArray(root["AREA-DE-ATUACAO"]).flatMap((entry) => {
    const record = asRecord(entry);
    if (!record) {
      return [];
    }
    const name =
      attr(record, "NOME-GRANDE-AREA-DO-CONHECIMENTO") ??
      attr(record, "NOME-DA-ESPECIALIDADE") ??
      textContent(record);
    if (!name) {
      return [];
    }
    return [
      {
        name,
        knowledgeArea: attr(record, "NOME-GRANDE-AREA-DO-CONHECIMENTO"),
        subArea: attr(record, "NOME-DA-SUB-AREA-DO-CONHECIMENTO"),
        specialty: attr(record, "NOME-DA-ESPECIALIDADE"),
        raw: record,
      },
    ];
  });
}

function mapLanguages(node: unknown): LanguageEntry[] {
  const root = asRecord(node);
  if (!root) {
    return [];
  }

  return asArray(root["IDIOMA"]).flatMap((entry) => {
    const record = asRecord(entry);
    if (!record) {
      return [];
    }
    const language = attr(record, "DESCRICAO-DO-IDIOMA") ?? textContent(record);
    if (!language) {
      return [];
    }
    return [
      {
        language,
        languageCode: attr(record, "IDIOMA"),
        proficiency: attr(record, "PROFICIENCIA"),
        reading: attr(record, "PROFICIENCIA-DE-LEITURA"),
        speaking: attr(record, "PROFICIENCIA-DE-FALA"),
        writing: attr(record, "PROFICIENCIA-DE-ESCRITA"),
        comprehension: attr(record, "PROFICIENCIA-DE-COMPREENSAO"),
        raw: record,
      },
    ];
  });
}

function firstPresentAttr(record: XmlRecord, names: readonly string[]): string | undefined {
  for (const name of names) {
    const value = attr(record, name);
    if (value) {
      return value;
    }
  }
  return undefined;
}

function mapAddressContact(endereco: XmlRecord | undefined): {
  preference?: string;
  electronic?: string;
  otherContact?: string;
  socialNetwork?: string;
} | undefined {
  if (!endereco) {
    return undefined;
  }
  const preference = attr(endereco, "FLAG-DE-PREFERENCIA");
  const electronic = attr(endereco, "ELETRONICO");
  const otherContact = attr(endereco, "OUTRA-FORMA-DE-CONTATO");
  const socialNetwork = attr(endereco, "REDE-SOCIAL");
  if (
    preference === undefined &&
    electronic === undefined &&
    otherContact === undefined &&
    socialNetwork === undefined
  ) {
    return undefined;
  }
  return { preference, electronic, otherContact, socialNetwork };
}

function mapAddressBlock(
  endereco: XmlRecord | undefined,
  tag: string,
  streetAttrs: readonly string[] = ["LOGRADOURO-COMPLEMENTO", "LOGRADOURO"],
): ProfessionalAddress | undefined {
  const prof = asRecord(endereco?.[tag]);
  if (!prof) {
    return undefined;
  }
  const institution = attr(prof, "NOME-INSTITUICAO-EMPRESA") ?? attr(prof, "NOME-INSTITUICAO");
  const city = attr(prof, "CIDADE");
  const street = firstPresentAttr(prof, streetAttrs);
  const postalCode = attr(prof, "CEP");
  const email = attr(prof, "E-MAIL");
  const department = attr(prof, "NOME-UNIDADE");
  const state = attr(prof, "UF");
  const country = attr(prof, "PAIS");
  const neighborhood = attr(prof, "BAIRRO");
  const areaCode = attr(prof, "DDD");
  const phone = attr(prof, "TELEFONE");
  const homepage = attr(prof, "HOME-PAGE");
  if (
    !institution &&
    !city &&
    !email &&
    !street &&
    !postalCode &&
    !department &&
    !state &&
    !country &&
    !neighborhood &&
    !areaCode &&
    !phone &&
    !homepage
  ) {
    return undefined;
  }
  return {
    institution,
    department,
    city,
    state,
    country,
    street,
    postalCode,
    neighborhood,
    areaCode,
    phone,
    email,
    homepage,
    raw: prof,
  };
}

function mapAdvisories(complement: XmlRecord | undefined): {
  completed: Advisory[];
  inProgress: Advisory[];
  unmapped: Record<string, unknown>;
} {
  const completed: Advisory[] = [];
  const inProgress: Advisory[] = [];

  const completedRoot = asRecord(complement?.["ORIENTACOES-CONCLUIDAS"]);
  if (completedRoot) {
    for (const tag of [
      "ORIENTACOES-CONCLUIDAS-PARA-MESTRADO",
      "ORIENTACOES-CONCLUIDAS-PARA-DOUTORADO",
      "ORIENTACOES-CONCLUIDAS-PARA-POS-DOUTORADO",
      "OUTRAS-ORIENTACOES-CONCLUIDAS",
    ] as const) {
      for (const entry of asArray(completedRoot[tag])) {
        const record = asRecord(entry);
        if (!record) {
          continue;
        }
        const basics =
          asRecord(record[`DADOS-BASICOS-DE-${tag}`]) ??
          asRecord(record[`DADOS-BASICOS-${tag}`]) ??
          asRecord(record["DADOS-BASICOS-DE-ORIENTACOES-CONCLUIDAS"]) ??
          record;
        completed.push({
          type: tag,
          studentName: attr(basics, "NOME-DO-ORIENTADO"),
          title: attr(basics, "TITULO-DO-TRABALHO-DE-CONCLUSAO"),
          institution: attr(basics, "NOME-INSTITUICAO"),
          year: attr(basics, "ANO"),
          status: "completed",
          raw: record,
        });
      }
    }
  }

  const inProgressRoot = asRecord(complement?.["ORIENTACOES-EM-ANDAMENTO"]);
  if (inProgressRoot) {
    for (const tag of [
      "ORIENTACAO-EM-ANDAMENTO-DE-MESTRADO",
      "ORIENTACAO-EM-ANDAMENTO-DE-DOUTORADO",
      "ORIENTACAO-EM-ANDAMENTO-DE-POS-DOUTORADO",
      "OUTRAS-ORIENTACOES-EM-ANDAMENTO",
    ] as const) {
      for (const entry of asArray(inProgressRoot[tag])) {
        const record = asRecord(entry);
        if (!record) {
          continue;
        }
        const basics =
          asRecord(record[`DADOS-BASICOS-DE-${tag}`]) ??
          asRecord(record[`DADOS-BASICOS-${tag}`]) ??
          record;
        inProgress.push({
          type: tag,
          studentName: attr(basics, "NOME-DO-ORIENTANDO"),
          title: attr(basics, "TITULO-DO-TRABALHO"),
          institution: attr(basics, "NOME-INSTITUICAO"),
          year: attr(basics, "ANO"),
          status: "in_progress",
          raw: record,
        });
      }
    }
  }

  return {
    completed,
    inProgress,
    unmapped: pickUnmapped(complement, [
      "ORIENTACOES-CONCLUIDAS",
      "ORIENTACOES-EM-ANDAMENTO",
    ]),
  };
}

function mapAwards(node: unknown): Award[] {
  const root = asRecord(node);
  if (!root) {
    return [];
  }

  const entries = [
    ...asArray(root["PREMIO-TITULO"]),
    ...asArray(root["PREMIO-OU-TITULO"]),
  ];

  return entries.flatMap((entry) => {
    const record = asRecord(entry);
    if (!record) {
      return [];
    }
    const title = attr(record, "NOME-DO-PREMIO-OU-TITULO") ?? textContent(record);
    if (!title) {
      return [];
    }
    return [
      {
        title,
        year: attr(record, "ANO-DA-PREMIACAO") ?? attr(record, "ANO"),
        promotingEntity: attr(record, "NOME-DA-ENTIDADE-PROMOTORA"),
        raw: record,
      },
    ];
  });
}

export function parseCurriculum(xml: string): Curriculum {
  let parsed: unknown;
  try {
    parsed = xmlParser.parse(xml);
  } catch {
    throw new InvalidCurriculumXmlError("Unable to parse XML document");
  }

  const root = asRecord(asRecord(parsed)?.["CURRICULO-VITAE"]);
  if (!root) {
    throw new InvalidCurriculumXmlError(
      'Root element must be "CURRICULO-VITAE"',
    );
  }

  const id = attr(root, "NUMERO-IDENTIFICADOR");
  if (!id) {
    throw new InvalidCurriculumXmlError(
      "Missing NUMERO-IDENTIFICADOR attribute on CURRICULO-VITAE",
    );
  }

  const document = structuredClone(root) as XmlRecord;

  const empty: XmlRecord = {};
  const dadosGerais = asRecord(document["DADOS-GERAIS"]) ?? empty;
  document["DADOS-GERAIS"] = dadosGerais;
  const bibliographic = asRecord(document["PRODUCAO-BIBLIOGRAFICA"]) ?? empty;
  document["PRODUCAO-BIBLIOGRAFICA"] = bibliographic;
  const technical = asRecord(document["PRODUCAO-TECNICA"]);
  const complement = asRecord(document["DADOS-COMPLEMENTARES"]);

  const fullName =
    attr(dadosGerais, "NOME-COMPLETO") ??
    textContent(dadosGerais["NOME-COMPLETO"]) ??
    "";

  const journalContainer = asRecord(bibliographic["ARTIGOS-PUBLICADOS"]);
  const conferenceContainer = asRecord(bibliographic["TRABALHOS-EM-EVENTOS"]);
  const booksContainer = asRecord(bibliographic["LIVROS-E-CAPITULOS"]);
  const endereco = asRecord(dadosGerais["ENDERECO"]);

  const resumoNode = asRecord(dadosGerais["RESUMO-CV"]);
  const advisories = mapAdvisories(complement);
  const complementary = mapComplementaryData(complement);

  return {
    id,
    document,
    metadata: {
      systemOrigin: attr(document, "SISTEMA-ORIGEM-XML"),
      dateFormat: attr(document, "FORMATO-DATA-ATUALIZACAO"),
      timeFormat: attr(document, "FORMATO-HORA-ATUALIZACAO"),
    },
    updatedAt: parseLattesDateTime(
      attr(document, "DATA-ATUALIZACAO"),
      attr(document, "HORA-ATUALIZACAO"),
    ),
    identification: {
      fullName,
      citationName: readCitationName(dadosGerais),
      summary: readSummaryText(dadosGerais),
      summaryEnglish: attr(resumoNode, "TEXTO-RESUMO-CV-RH-EN"),
      otherRelevantInfo: readOtherRelevantInfo(dadosGerais),
      addressContact: mapAddressContact(endereco),
      professionalAddress: mapAddressBlock(endereco, "ENDERECO-PROFISSIONAL"),
      residentialAddress: mapAddressBlock(endereco, "ENDERECO-RESIDENCIAL", ["LOGRADOURO"]),
      researchAreas: mapResearchAreas(dadosGerais["AREAS-DE-ATUACAO"]),
      languages: mapLanguages(dadosGerais["IDIOMAS"]),
      unmapped: pickUnmapped(dadosGerais, [
        "RESUMO-CV",
        "OUTRAS-INFORMACOES-RELEVANTES",
        "ENDERECO",
        "FORMACAO-ACADEMICA-TITULACAO",
        "ATUACOES-PROFISSIONAIS",
        "AREAS-DE-ATUACAO",
        "IDIOMAS",
        "PREMIOS-TITULOS",
        "NOME-COMPLETO",
        "NOME-CITACOES",
        "NOME-EM-CITACOES-BIBLIOGRAFICAS",
      ]),
    },
    academicBackground: mapAcademicBackground(
      dadosGerais["FORMACAO-ACADEMICA-TITULACAO"],
    ),
    professionalActivities: mapProfessionalActivities(
      dadosGerais["ATUACOES-PROFISSIONAIS"],
    ),
    bibliographicProduction: {
      journalArticles: mapBibliographicItems(
        journalContainer,
        "ARTIGO-PUBLICADO",
        "journal_article",
      ),
      conferencePapers: mapBibliographicItems(
        conferenceContainer,
        "TRABALHO-EM-EVENTOS",
        "conference_paper",
      ),
      booksAndChapters: mapBooksAndChapters(booksContainer),
      other: [
        ...mapBibliographicItems(
          bibliographic,
          "OUTRA-PRODUCAO-BIBLIOGRAFICA",
          "other_bibliographic",
        ),
        ...mapBibliographicItems(
          asRecord(bibliographic["DEMAIS-TIPOS-DE-PRODUCAO-BIBLIOGRAFICA"]),
          "OUTRA-PRODUCAO-BIBLIOGRAFICA",
          "other_bibliographic",
        ),
      ],
      unmapped: pickUnmapped(bibliographic, [
        "ARTIGOS-PUBLICADOS",
        "TRABALHOS-EM-EVENTOS",
        "LIVROS-E-CAPITULOS",
        "OUTRA-PRODUCAO-BIBLIOGRAFICA",
        "DEMAIS-TIPOS-DE-PRODUCAO-BIBLIOGRAFICA",
        "ARTIGOS-ACEITOS-PARA-PUBLICACAO",
        "TEXTOS-EM-JORNAIS-OU-REVISTAS",
      ]),
    },
    technicalProduction: mapTechnicalProduction(technical),
    complementary,
    advisories,
    awards: mapAwards(dadosGerais["PREMIOS-TITULOS"]),
    unmapped: pickUnmapped(document, [
      "DADOS-GERAIS",
      "PRODUCAO-BIBLIOGRAFICA",
      "PRODUCAO-TECNICA",
      "DADOS-COMPLEMENTARES",
    ]),
  };
}
