import { InvalidCurriculumXmlError } from "../errors.js";
import type {
  AcademicDegree,
  Advisory,
  Author,
  Award,
  BibliographicItem,
  Curriculum,
  LanguageEntry,
  ProfessionalActivity,
  ProfessionalAddress,
  ResearchArea,
  TechnicalItem,
} from "../types.js";
import { parseLattesDateTime } from "./dates.js";
import {
  asArray,
  asRecord,
  attr,
  pickUnmapped,
  textContent,
  xmlParser,
  type XmlRecord,
} from "./xml-utils.js";

function mapAuthors(node: unknown): Author[] {
  const record = asRecord(node);
  if (!record) {
    return [];
  }
  const autoresNode = asRecord(record["AUTORES"]);
  const authorNodes = autoresNode
    ? asArray(autoresNode["AUTOR"])
    : asArray(record["AUTOR"]);

  return authorNodes.flatMap((entry) => {
      const record = asRecord(entry);
      if (!record) {
        return [];
      }
      const name =
        attr(record, "NOME-COMPLETO-DO-AUTOR") ??
        textContent(record) ??
        attr(record, "NOME-PARA-CITACAO");
      if (!name) {
        return [];
      }
      const orderRaw = attr(record, "ORDEM-DE-AUTORIA");
      return [
        {
          name,
          citationName: attr(record, "NOME-PARA-CITACAO"),
          order: orderRaw ? Number(orderRaw) : undefined,
          raw: record,
        },
      ];
    });
}

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
      asRecord(record["DADOS-BASICOS-DE-OUTRAS-PRODUCOES-BIBLIOGRAFICAS"]) ??
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
      asRecord(record["DETALHAMENTO-DO-LIVRO"]);

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
        raw: record,
      },
    ];
  });
}

function mapAcademicBackground(node: unknown): AcademicDegree[] {
  const root = asRecord(node);
  if (!root) {
    return [];
  }

  const degrees: AcademicDegree[] = [];
  for (const tag of [
    "GRADUACAO",
    "MESTRADO",
    "DOUTORADO",
    "POS-DOUTORADO",
    "ESPECIALIZACAO",
    "APERFEICOAMENTO",
  ] as const) {
    for (const entry of asArray(root[tag])) {
      const record = asRecord(entry);
      if (!record) {
        continue;
      }
      degrees.push({
        level: attr(record, "NIVEL") ?? tag.replace(/-/g, " "),
        title:
          attr(record, "TITULO-DA-MONOGRAFIA") ??
          attr(record, "TITULO-DA-DISSERTACAO-TESE"),
        institution: attr(record, "NOME-INSTITUICAO"),
        startYear: attr(record, "ANO-DE-INICIO"),
        endYear: attr(record, "ANO-DE-CONCLUSAO"),
        status: attr(record, "STATUS-DO-CURSO"),
        raw: record,
      });
    }
  }

  return degrees;
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
    return [
      {
        institution: attr(record, "NOME-INSTITUICAO"),
        role: attr(record, "CARGO"),
        startYear: attr(record, "ANO-DE-INICIO"),
        endYear: attr(record, "ANO-DE-FIM"),
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
        proficiency: attr(record, "PROFICIENCIA"),
        raw: record,
      },
    ];
  });
}

function mapProfessionalAddress(node: unknown): ProfessionalAddress | undefined {
  const root = asRecord(node);
  if (!root) {
    return undefined;
  }

  const prof = asRecord(root["ENDERECO-PROFISSIONAL"]) ?? root;
  const institution = attr(prof, "NOME-INSTITUICAO");
  const city = attr(prof, "CIDADE");
  if (!institution && !city) {
    return undefined;
  }

  return {
    institution,
    department: attr(prof, "NOME-UNIDADE"),
    city,
    state: attr(prof, "UF"),
    country: attr(prof, "PAIS"),
    raw: prof,
  };
}

function mapTechnicalProduction(node: unknown): TechnicalItem[] {
  const root = asRecord(node);
  if (!root) {
    return [];
  }

  const items: TechnicalItem[] = [];
  for (const [tag, label] of [
    ["PATENTE", "patent"],
    ["PRODUTO-TECNOLOGICO", "technology_product"],
    ["SOFTWARE", "software"],
    ["TRABALHO-TECNICO", "technical_work"],
  ] as const) {
    for (const entry of asArray(root[tag])) {
      const record = asRecord(entry);
      if (!record) {
        continue;
      }
      const basics =
        asRecord(record["DADOS-BASICOS-DA-PATENTE"]) ??
        asRecord(record["DADOS-BASICOS-DO-PRODUTO-TECNOLOGICO"]) ??
        asRecord(record["DADOS-BASICOS-DO-SOFTWARE"]) ??
        asRecord(record["DADOS-BASICOS-DO-TRABALHO-TECNICO"]) ??
        record;
      const title =
        attr(basics, "TITULO-PATENTE") ??
        attr(basics, "TITULO-DO-PRODUTO-TECNOLOGICO") ??
        attr(basics, "TITULO-DO-SOFTWARE") ??
        attr(basics, "TITULO-DO-TRABALHO-TECNICO") ??
        attr(basics, "TITULO");
      if (!title) {
        continue;
      }
      items.push({
        type: label,
        title,
        year: attr(basics, "ANO"),
        raw: record,
      });
    }
  }

  return items;
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

  return asArray(root["PREMIO-OU-TITULO"]).flatMap((entry) => {
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
        year: attr(record, "ANO"),
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

  const empty: XmlRecord = {};
  const dadosGerais = asRecord(root["DADOS-GERAIS"]) ?? empty;
  const bibliographic = asRecord(root["PRODUCAO-BIBLIOGRAFICA"]) ?? empty;
  const technical = asRecord(root["PRODUCAO-TECNICA"]);
  const complement = asRecord(root["DADOS-COMPLEMENTARES"]);

  const fullName =
    attr(dadosGerais, "NOME-COMPLETO") ??
    textContent(dadosGerais["NOME-COMPLETO"]) ??
    "";

  const journalContainer = asRecord(bibliographic["ARTIGOS-PUBLICADOS"]);
  const conferenceContainer = asRecord(bibliographic["TRABALHOS-EM-EVENTOS"]);
  const booksContainer = asRecord(bibliographic["LIVROS-E-CAPITULOS"]);

  const advisories = mapAdvisories(complement);

  return {
    id,
    updatedAt: parseLattesDateTime(
      attr(root, "DATA-ATUALIZACAO"),
      attr(root, "HORA-ATUALIZACAO"),
    ),
    identification: {
      fullName,
      citationName: attr(dadosGerais, "NOME-CITACOES"),
      summary: textContent(dadosGerais["RESUMO-CV"]),
      otherRelevantInfo: textContent(
        dadosGerais["OUTRAS-INFORMACOES-RELEVANTES"],
      ),
      professionalAddress: mapProfessionalAddress(dadosGerais["ENDERECO"]),
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
      booksAndChapters: [
        ...mapBibliographicItems(booksContainer, "LIVRO-PUBLICADO-OU-ORGANIZADO", "book"),
        ...mapBibliographicItems(booksContainer, "CAPITULO-DE-LIVRO-PUBLICADO", "book_chapter"),
      ],
      other: mapBibliographicItems(
        bibliographic,
        "OUTRA-PRODUCAO-BIBLIOGRAFICA",
        "other_bibliographic",
      ),
      unmapped: pickUnmapped(bibliographic, [
        "ARTIGOS-PUBLICADOS",
        "TRABALHOS-EM-EVENTOS",
        "LIVROS-E-CAPITULOS",
        "OUTRA-PRODUCAO-BIBLIOGRAFICA",
      ]),
    },
    technicalProduction: mapTechnicalProduction(technical),
    advisories,
    awards: mapAwards(dadosGerais["PREMIOS-TITULOS"]),
    unmapped: pickUnmapped(root, [
      "DADOS-GERAIS",
      "PRODUCAO-BIBLIOGRAFICA",
      "PRODUCAO-TECNICA",
      "DADOS-COMPLEMENTARES",
    ]),
  };
}
