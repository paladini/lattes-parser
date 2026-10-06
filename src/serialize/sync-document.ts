import type {
  AcademicDegree,
  AdditionalCourse,
  AdditionalInstitution,
  Advisory,
  Award,
  BibliographicItem,
  ComplementaryTraining,
  Curriculum,
  EmploymentLink,
  EventParticipation,
  LanguageEntry,
  ProfessionalActivity,
  ProfessionalAddress,
  ResearchArea,
  TechnicalItem,
} from "../types.js";
import { DEGREE_TAGS } from "../schema/degree-tags.js";
import { asArray, asRecord, type XmlRecord } from "../parse/xml-utils.js";
import { syncAuthorsOnRecord } from "./authors-sync.js";

const TECH_TAG_BY_TYPE: Record<string, string> = {
  patent: "PATENTE",
  technology_product: "PRODUTO-TECNOLOGICO",
  software: "SOFTWARE",
  technical_work: "TRABALHO-TECNICO",
};

function setAttr(record: XmlRecord, name: string, value: string | undefined): void {
  if (value === undefined) {
    delete record[`@_${name}`];
    return;
  }
  record[`@_${name}`] = value;
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

function ensureChild(parent: XmlRecord, tag: string): XmlRecord {
  const existing = asRecord(parent[tag]);
  if (existing) {
    return existing;
  }
  const created: XmlRecord = {};
  parent[tag] = created;
  return created;
}

function writeArray(parent: XmlRecord, tag: string, entries: unknown[]): void {
  if (entries.length === 0) {
    delete parent[tag];
    return;
  }
  parent[tag] = entries.length === 1 ? entries[0] : entries;
}

function nodeInParentList(parent: XmlRecord, tag: string, node: XmlRecord): boolean {
  return asArray(parent[tag]).some((entry) => asRecord(entry) === node);
}

function orderIndexMap<T extends { raw?: Record<string, unknown> }>(
  items: T[],
): Map<XmlRecord, number> {
  const map = new Map<XmlRecord, number>();
  items.forEach((item, index) => {
    const raw = asRecord(item.raw);
    if (raw) {
      map.set(raw, index);
    }
  });
  return map;
}

function sortByTypedOrder(
  entries: unknown[],
  order: Map<XmlRecord, number>,
): unknown[] {
  return [...entries].sort((a, b) => {
    const ra = asRecord(a);
    const rb = asRecord(b);
    const ia = ra ? (order.get(ra) ?? Number.MAX_SAFE_INTEGER) : Number.MAX_SAFE_INTEGER;
    const ib = rb ? (order.get(rb) ?? Number.MAX_SAFE_INTEGER) : Number.MAX_SAFE_INTEGER;
    return ia - ib;
  });
}

function inferDegreeTag(degree: AcademicDegree, formacao: XmlRecord): string {
  if (degree.xmlTag) {
    return degree.xmlTag;
  }
  const raw = asRecord(degree.raw);
  if (raw) {
    for (const tag of DEGREE_TAGS) {
      if (nodeInParentList(formacao, tag, raw)) {
        return tag;
      }
    }
  }
  const normalized = degree.level.toUpperCase().replace(/\s+/g, "-");
  if ((DEGREE_TAGS as readonly string[]).includes(normalized)) {
    return normalized;
  }
  return "GRADUACAO";
}

function applyDegreeFields(node: XmlRecord, degree: AcademicDegree): void {
  setAttrPreserve(node, "NIVEL", degree.level);
  setAttrPreserve(
    node,
    "TITULO-DA-MONOGRAFIA",
    degree.title,
  );
  setAttrPreserve(
    node,
    "TITULO-DA-DISSERTACAO-TESE",
    degree.title,
  );
  setAttrPreserve(node, "NOME-INSTITUICAO", degree.institution);
  setAttrPreserve(node, "ANO-DE-INICIO", degree.startYear);
  setAttrPreserve(node, "ANO-DE-CONCLUSAO", degree.endYear);
  setAttrPreserve(node, "STATUS-DO-CURSO", degree.status);
  setAttrPreserve(node, "SEQUENCIA-FORMACAO", degree.sequence);
}

function createDegreeNode(degree: AcademicDegree, tag: string): XmlRecord {
  const node: XmlRecord = {};
  applyDegreeFields(node, degree);
  if (!node["@_NIVEL"]) {
    setAttrPreserve(node, "NIVEL", tag.replace(/-/g, " "));
  }
  return node;
}

function syncAcademicBackground(dadosGerais: XmlRecord, degrees: AcademicDegree[]): void {
  if (degrees.length === 0) {
    return;
  }
  const formacao = ensureChild(dadosGerais, "FORMACAO-ACADEMICA-TITULACAO");
  const referenced = new Set<XmlRecord>();
  const order = orderIndexMap(degrees);

  for (const degree of degrees) {
    const tag = inferDegreeTag(degree, formacao);
    let node = asRecord(degree.raw);
    if (node && nodeInParentList(formacao, tag, node)) {
      applyDegreeFields(node, degree);
    } else {
      node = createDegreeNode(degree, tag);
      const current = asArray(formacao[tag]);
      current.push(node);
      writeArray(formacao, tag, current);
    }
    referenced.add(node);
  }

  for (const tag of DEGREE_TAGS) {
    const kept = asArray(formacao[tag])
      .map((entry) => asRecord(entry))
      .filter((entry): entry is XmlRecord => !!entry && referenced.has(entry));
    writeArray(formacao, tag, sortByTypedOrder(kept, order));
  }
}

function applyEmploymentLink(node: XmlRecord, link: EmploymentLink): void {
  setAttrPreserve(node, "TIPO-DE-VINCULO", link.linkType);
  setAttrPreserve(node, "OUTRO-ENQUADRAMENTO-FUNCIONAL-INFORMADO", link.functionalRole);
  setAttrPreserve(node, "CARGA-HORARIA-SEMANAL", link.weeklyHours);
  setAttrPreserve(node, "FLAG-DEDICACAO-EXCLUSIVA", link.exclusive);
  setAttrPreserve(node, "MES-INICIO", link.startMonth);
  setAttrPreserve(node, "ANO-INICIO", link.startYear);
  setAttrPreserve(node, "MES-FIM", link.endMonth);
  setAttrPreserve(node, "ANO-FIM", link.endYear);
}

function syncProfessionalActivities(
  dadosGerais: XmlRecord,
  activities: ProfessionalActivity[],
): void {
  if (activities.length === 0) {
    return;
  }
  const container = ensureChild(dadosGerais, "ATUACOES-PROFISSIONAIS");
  const order = orderIndexMap(activities);
  const next: XmlRecord[] = [];

  for (const activity of activities) {
    let node = asRecord(activity.raw);
    if (!node || !nodeInParentList(container, "ATUACAO-PROFISSIONAL", node)) {
      node = {};
    }
    setAttrPreserve(node, "NOME-INSTITUICAO", activity.institution);
    setAttrPreserve(node, "CODIGO-INSTITUICAO", activity.institutionCode);
    if (activity.links.length > 0) {
      const links = activity.links.map((link) => {
        const linkNode = asRecord(link.raw) ?? {};
        applyEmploymentLink(linkNode, link);
        return linkNode;
      });
      writeArray(node, "VINCULOS", links);
    } else {
      setAttrPreserve(node, "CARGO", activity.role);
      setAttrPreserve(node, "ANO-DE-INICIO", activity.startYear);
      setAttrPreserve(node, "ANO-DE-FIM", activity.endYear);
    }
    next.push(node);
  }

  writeArray(
    container,
    "ATUACAO-PROFISSIONAL",
    sortByTypedOrder(next, order),
  );
}

function syncResearchAreas(dadosGerais: XmlRecord, areas: ResearchArea[]): void {
  if (areas.length === 0) {
    return;
  }
  const container = ensureChild(dadosGerais, "AREAS-DE-ATUACAO");
  const order = orderIndexMap(areas);
  const next: XmlRecord[] = [];

  for (const area of areas) {
    let node = asRecord(area.raw);
    if (!node || !nodeInParentList(container, "AREA-DE-ATUACAO", node)) {
      node = {};
    }
    setAttrPreserve(node, "NOME-GRANDE-AREA-DO-CONHECIMENTO", area.knowledgeArea ?? area.name);
    setAttrPreserve(node, "NOME-DA-SUB-AREA-DO-CONHECIMENTO", area.subArea);
    setAttrPreserve(node, "NOME-DA-ESPECIALIDADE", area.specialty);
    next.push(node);
  }

  writeArray(container, "AREA-DE-ATUACAO", sortByTypedOrder(next, order));
}

function syncLanguages(dadosGerais: XmlRecord, languages: LanguageEntry[]): void {
  if (languages.length === 0) {
    return;
  }
  const container = ensureChild(dadosGerais, "IDIOMAS");
  const order = orderIndexMap(languages);
  const next: XmlRecord[] = [];

  for (const entry of languages) {
    let node = asRecord(entry.raw);
    if (!node || !nodeInParentList(container, "IDIOMA", node)) {
      node = {};
    }
    setAttrPreserve(node, "DESCRICAO-DO-IDIOMA", entry.language);
    setAttrPreserve(node, "IDIOMA", entry.languageCode);
    setAttrPreserve(node, "PROFICIENCIA", entry.proficiency);
    setAttrPreserve(node, "PROFICIENCIA-DE-LEITURA", entry.reading);
    setAttrPreserve(node, "PROFICIENCIA-DE-FALA", entry.speaking);
    setAttrPreserve(node, "PROFICIENCIA-DE-ESCRITA", entry.writing);
    setAttrPreserve(node, "PROFICIENCIA-DE-COMPREENSAO", entry.comprehension);
    next.push(node);
  }

  writeArray(container, "IDIOMA", sortByTypedOrder(next, order));
}

function syncProfessionalAddress(
  dadosGerais: XmlRecord,
  address: ProfessionalAddress | undefined,
): void {
  if (!address) {
    return;
  }
  const endereco = ensureChild(dadosGerais, "ENDERECO");
  let prof = asRecord(address.raw);
  if (!prof || asRecord(endereco["ENDERECO-PROFISSIONAL"]) !== prof) {
    prof = ensureChild(endereco, "ENDERECO-PROFISSIONAL");
  }
  setAttrPreserve(prof, "NOME-INSTITUICAO", address.institution);
  setAttrPreserve(prof, "NOME-UNIDADE", address.department);
  setAttrPreserve(prof, "CIDADE", address.city);
  setAttrPreserve(prof, "UF", address.state);
  setAttrPreserve(prof, "PAIS", address.country);
}

function awardItemTag(container: XmlRecord, node: XmlRecord | undefined): string {
  if (node && nodeInParentList(container, "PREMIO-TITULO", node)) {
    return "PREMIO-TITULO";
  }
  if (node && nodeInParentList(container, "PREMIO-OU-TITULO", node)) {
    return "PREMIO-OU-TITULO";
  }
  return "PREMIO-TITULO";
}

function syncAwards(dadosGerais: XmlRecord, awards: Award[]): void {
  if (awards.length === 0) {
    const container = asRecord(dadosGerais["PREMIOS-TITULOS"]);
    if (container) {
      delete container["PREMIO-TITULO"];
      delete container["PREMIO-OU-TITULO"];
    }
    return;
  }
  const container = ensureChild(dadosGerais, "PREMIOS-TITULOS");
  const order = orderIndexMap(awards);
  const byTag = new Map<string, XmlRecord[]>();

  for (const award of awards) {
    let node = asRecord(award.raw);
    const tag = awardItemTag(container, node);
    if (!node || !nodeInParentList(container, tag, node)) {
      node = {};
    }
    setAttrPreserve(node, "NOME-DO-PREMIO-OU-TITULO", award.title);
    setAttrPreserve(node, "ANO-DA-PREMIACAO", award.year);
    setAttrPreserve(node, "ANO", award.year);
    setAttrPreserve(node, "NOME-DA-ENTIDADE-PROMOTORA", award.promotingEntity);
    const list = byTag.get(tag) ?? [];
    list.push(node);
    byTag.set(tag, list);
  }

  for (const [tag, nodes] of byTag) {
    writeArray(container, tag, sortByTypedOrder(nodes, order));
  }
}

function bibliographicBasicsTag(type: string): string {
  switch (type) {
    case "journal_article":
      return "DADOS-BASICOS-DO-ARTIGO";
    case "conference_paper":
      return "DADOS-BASICOS-DO-TRABALHO";
    case "book":
    case "book_chapter":
      return "DADOS-BASICOS-DO-LIVRO";
    default:
      return "DADOS-BASICOS-DE-OUTRAS-PRODUCOES-BIBLIOGRAFICAS";
  }
}

function bibliographicDetailTag(type: string): string {
  switch (type) {
    case "journal_article":
      return "DETALHAMENTO-DO-ARTIGO";
    case "conference_paper":
      return "DETALHAMENTO-DO-TRABALHO";
    case "book":
    case "book_chapter":
      return "DETALHAMENTO-DO-LIVRO";
    default:
      return "DETALHAMENTO";
  }
}

function applyBibliographicFields(record: XmlRecord, item: BibliographicItem): void {
  const basics = ensureChild(record, bibliographicBasicsTag(item.type));
  const detail = ensureChild(record, bibliographicDetailTag(item.type));

  if (item.type === "journal_article") {
    setAttrPreserve(basics, "TITULO-DO-ARTIGO", item.title);
    setAttrPreserve(basics, "ANO-DO-ARTIGO", item.year);
    setAttrPreserve(detail, "TITULO-DO-PERIODICO-OU-REVISTA", item.journalOrEvent);
    setAttrPreserve(detail, "DOI", item.doi);
  } else if (item.type === "conference_paper") {
    setAttrPreserve(basics, "TITULO-DO-TRABALHO", item.title);
    setAttrPreserve(basics, "ANO-DO-TRABALHO", item.year);
    setAttrPreserve(detail, "NOME-DO-EVENTO", item.journalOrEvent);
    setAttrPreserve(detail, "DOI", item.doi);
  } else if (item.type === "book" || item.type === "book_chapter") {
    setAttrPreserve(basics, "TITULO-DO-LIVRO", item.title);
    setAttrPreserve(basics, "ANO-DO-TRABALHO", item.year);
    setAttrPreserve(detail, "DOI", item.doi);
  } else {
    setAttrPreserve(basics, "TITULO", item.title);
    setAttrPreserve(basics, "ANO-DO-TRABALHO", item.year);
  }

  if (item.authors.length > 0) {
    syncAuthorsOnRecord(record, item.authors);
  }
}

function createBibliographicNode(item: BibliographicItem): XmlRecord {
  const node: XmlRecord = {};
  applyBibliographicFields(node, item);
  return node;
}

function bookItemTag(type: string): string {
  return type === "book_chapter"
    ? "CAPITULO-DE-LIVRO-PUBLICADO"
    : "LIVRO-PUBLICADO-OU-ORGANIZADO";
}

function syncBibliographicList(
  parent: XmlRecord,
  containerTag: string | null,
  itemTag: string,
  items: BibliographicItem[],
): void {
  if (items.length === 0) {
    return;
  }
  const container = containerTag ? ensureChild(parent, containerTag) : parent;
  const order = orderIndexMap(items);
  const next: XmlRecord[] = [];

  for (const item of items) {
    let node = asRecord(item.raw);
    if (node && nodeInParentList(container, itemTag, node)) {
      applyBibliographicFields(node, item);
      setAttrPreserve(node, "SEQUENCIA-PRODUCAO", item.sequence);
    } else {
      node = createBibliographicNode(item);
      setAttrPreserve(node, "SEQUENCIA-PRODUCAO", item.sequence);
    }
    next.push(node);
  }

  writeArray(container, itemTag, sortByTypedOrder(next, order));
}

function hasBibliographicItems(cv: Curriculum): boolean {
  const bib = cv.bibliographicProduction;
  return (
    bib.journalArticles.length > 0 ||
    bib.conferencePapers.length > 0 ||
    bib.booksAndChapters.length > 0 ||
    bib.other.length > 0
  );
}

function syncBibliographicProduction(root: XmlRecord, cv: Curriculum): void {
  if (!hasBibliographicItems(cv)) {
    return;
  }
  const bibliographic = ensureChild(root, "PRODUCAO-BIBLIOGRAFICA");

  syncBibliographicList(
    bibliographic,
    "ARTIGOS-PUBLICADOS",
    "ARTIGO-PUBLICADO",
    cv.bibliographicProduction.journalArticles,
  );
  syncBibliographicList(
    bibliographic,
    "TRABALHOS-EM-EVENTOS",
    "TRABALHO-EM-EVENTOS",
    cv.bibliographicProduction.conferencePapers,
  );

  const booksContainer = ensureChild(bibliographic, "LIVROS-E-CAPITULOS");
  const books = cv.bibliographicProduction.booksAndChapters.filter(
    (item) => item.type === "book",
  );
  const chapters = cv.bibliographicProduction.booksAndChapters.filter(
    (item) => item.type === "book_chapter",
  );
  syncBibliographicList(booksContainer, null, bookItemTag("book"), books);
  syncBibliographicList(booksContainer, null, bookItemTag("book_chapter"), chapters);

  syncBibliographicList(
    bibliographic,
    null,
    "OUTRA-PRODUCAO-BIBLIOGRAFICA",
    cv.bibliographicProduction.other,
  );
}

function technicalBasicsTag(type: string): string {
  switch (type) {
    case "patent":
      return "DADOS-BASICOS-DA-PATENTE";
    case "technology_product":
      return "DADOS-BASICOS-DO-PRODUTO-TECNOLOGICO";
    case "software":
      return "DADOS-BASICOS-DO-SOFTWARE";
    default:
      return "DADOS-BASICOS-DO-TRABALHO-TECNICO";
  }
}

function applyTechnicalFields(record: XmlRecord, item: TechnicalItem): void {
  const basicsTag = technicalBasicsTag(item.type);
  let basics = asRecord(record[basicsTag]);
  if (!basics) {
    for (const [key, value] of Object.entries(record)) {
      if (key.startsWith("DADOS-BASICOS") && asRecord(value)) {
        basics = asRecord(value);
        break;
      }
    }
  }
  if (!basics) {
    basics = ensureChild(record, basicsTag);
  }
  switch (item.type) {
    case "patent":
      setAttrPreserve(basics, "TITULO-PATENTE", item.title);
      break;
    case "technology_product":
      setAttrPreserve(basics, "TITULO-DO-PRODUTO-TECNOLOGICO", item.title);
      break;
    case "software":
      setAttrPreserve(basics, "TITULO-DO-SOFTWARE", item.title);
      break;
    default:
      setAttrPreserve(basics, "TITULO-DO-TRABALHO-TECNICO", item.title);
      setAttrPreserve(basics, "TITULO", item.title);
      setAttrPreserve(basics, "TITULO-INGLES", item.title);
      break;
  }
  setAttrPreserve(basics, "ANO", item.year);
  setAttrPreserve(record, "SEQUENCIA-PRODUCAO", item.sequence);
  if (item.authors && item.authors.length > 0) {
    syncAuthorsOnRecord(record, item.authors);
  }
}

function createTechnicalNode(item: TechnicalItem): XmlRecord {
  const node: XmlRecord = {};
  applyTechnicalFields(node, item);
  return node;
}

function technicalTag(item: TechnicalItem): string {
  return item.xmlTag ?? TECH_TAG_BY_TYPE[item.type] ?? "TRABALHO-TECNICO";
}

function syncTechnicalGroup(parent: XmlRecord, items: TechnicalItem[]): void {
  const tags = [...new Set(items.map(technicalTag))];
  for (const tag of tags) {
    const subset = items.filter((item) => technicalTag(item) === tag);
    const order = orderIndexMap(subset);
    const next: XmlRecord[] = [];

    for (const item of subset) {
      let node = asRecord(item.raw);
      if (node && nodeInParentList(parent, tag, node)) {
        applyTechnicalFields(node, item);
      } else {
        node = createTechnicalNode(item);
      }
      next.push(node);
    }

    writeArray(parent, tag, sortByTypedOrder(next, order));
  }
}

function syncTechnicalProduction(root: XmlRecord, items: TechnicalItem[]): void {
  if (items.length === 0) {
    return;
  }
  const container = ensureChild(root, "PRODUCAO-TECNICA");
  const topLevel = items.filter((item) => !item.containerTag);
  const demais = items.filter(
    (item) => item.containerTag === "DEMAIS-TIPOS-DE-PRODUCAO-TECNICA",
  );

  syncTechnicalGroup(container, topLevel);
  if (demais.length > 0) {
    const demaisContainer = ensureChild(container, "DEMAIS-TIPOS-DE-PRODUCAO-TECNICA");
    syncTechnicalGroup(demaisContainer, demais);
  }
}

function advisoryBasicsTag(advisory: Advisory): string {
  const candidates = [
    `DADOS-BASICOS-DE-${advisory.type}`,
    `DADOS-BASICOS-${advisory.type}`,
    "DADOS-BASICOS-DE-ORIENTACOES-CONCLUIDAS",
  ];
  for (const tag of candidates) {
    const raw = asRecord(advisory.raw);
    if (raw && asRecord(raw[tag])) {
      return tag;
    }
  }
  return candidates[0];
}

function applyAdvisoryFields(record: XmlRecord, advisory: Advisory): void {
  const basicsTag = advisoryBasicsTag(advisory);
  const basics = ensureChild(record, basicsTag);
  if (advisory.status === "completed") {
    setAttrPreserve(basics, "NOME-DO-ORIENTADO", advisory.studentName);
    setAttrPreserve(basics, "TITULO-DO-TRABALHO-DE-CONCLUSAO", advisory.title);
  } else {
    setAttrPreserve(basics, "NOME-DO-ORIENTANDO", advisory.studentName);
    setAttrPreserve(basics, "TITULO-DO-TRABALHO", advisory.title);
  }
  setAttrPreserve(basics, "NOME-INSTITUICAO", advisory.institution);
  setAttrPreserve(basics, "ANO", advisory.year);
}

function createAdvisoryNode(advisory: Advisory): XmlRecord {
  const node: XmlRecord = {};
  applyAdvisoryFields(node, advisory);
  return node;
}

const COMPLETED_ADVISORY_TAGS = [
  "ORIENTACOES-CONCLUIDAS-PARA-MESTRADO",
  "ORIENTACOES-CONCLUIDAS-PARA-DOUTORADO",
  "ORIENTACOES-CONCLUIDAS-PARA-POS-DOUTORADO",
  "OUTRAS-ORIENTACOES-CONCLUIDAS",
] as const;

const IN_PROGRESS_ADVISORY_TAGS = [
  "ORIENTACAO-EM-ANDAMENTO-DE-MESTRADO",
  "ORIENTACAO-EM-ANDAMENTO-DE-DOUTORADO",
  "ORIENTACAO-EM-ANDAMENTO-DE-POS-DOUTORADO",
  "OUTRAS-ORIENTACOES-EM-ANDAMENTO",
] as const;

function syncAdvisoryGroup(
  parent: XmlRecord,
  parentTag: string,
  itemTags: readonly string[],
  advisories: Advisory[],
): void {
  const container = ensureChild(parent, parentTag);
  const order = orderIndexMap(advisories);

  for (const itemTag of itemTags) {
    const subset = advisories.filter((entry) => entry.type === itemTag);
    const next: XmlRecord[] = [];

    for (const advisory of subset) {
      let node = asRecord(advisory.raw);
      if (node && nodeInParentList(container, itemTag, node)) {
        applyAdvisoryFields(node, advisory);
      } else {
        node = createAdvisoryNode(advisory);
      }
      next.push(node);
    }

    writeArray(container, itemTag, sortByTypedOrder(next, order));
  }
}

function syncSimpleList<T extends { raw?: Record<string, unknown> }>(
  parent: XmlRecord,
  itemTag: string,
  items: T[],
  apply: (node: XmlRecord, item: T) => void,
): void {
  if (items.length === 0) {
    return;
  }
  const order = orderIndexMap(items);
  const next: XmlRecord[] = [];
  for (const item of items) {
    let node = asRecord(item.raw);
    if (!node || !nodeInParentList(parent, itemTag, node)) {
      node = {};
    }
    apply(node, item);
    next.push(node);
  }
  writeArray(parent, itemTag, sortByTypedOrder(next, order));
}

function syncComplementaryData(root: XmlRecord, cv: Curriculum): void {
  const data = cv.complementary;
  const hasData =
    data.complementaryTraining.length > 0 ||
    data.eventParticipation.length > 0 ||
    data.additionalInstitutions.length > 0 ||
    data.additionalCourses.length > 0;
  if (!hasData) {
    return;
  }

  const complement = ensureChild(root, "DADOS-COMPLEMENTARES");

  if (data.complementaryTraining.length > 0) {
    const trainingRoot = ensureChild(complement, "FORMACAO-COMPLEMENTAR");
    const byType = new Map<string, ComplementaryTraining[]>();
    for (const entry of data.complementaryTraining) {
      const list = byType.get(entry.type) ?? [];
      list.push(entry);
      byType.set(entry.type, list);
    }
    for (const [type, entries] of byType) {
      syncSimpleList(trainingRoot, type, entries, (node, entry) => {
        setAttrPreserve(node, "NOME-CURSO", entry.title);
        setAttrPreserve(node, "NOME-INSTITUICAO", entry.institution);
        setAttrPreserve(node, "CARGA-HORARIA", entry.workload);
        setAttrPreserve(node, "ANO-DE-INICIO", entry.startYear);
        setAttrPreserve(node, "ANO-DE-CONCLUSAO", entry.endYear);
        setAttrPreserve(node, "STATUS-DO-CURSO", entry.status);
        setAttrPreserve(node, "SEQUENCIA-FORMACAO", entry.sequence);
      });
    }
  }

  if (data.eventParticipation.length > 0) {
    const eventsRoot = ensureChild(complement, "PARTICIPACAO-EM-EVENTOS-CONGRESSOS");
    const byType = new Map<string, EventParticipation[]>();
    for (const entry of data.eventParticipation) {
      const list = byType.get(entry.type) ?? [];
      list.push(entry);
      byType.set(entry.type, list);
    }
    for (const [type, entries] of byType) {
      syncSimpleList(eventsRoot, type, entries, (node, entry) => {
        setAttrPreserve(node, "SEQUENCIA-PRODUCAO", entry.sequence);
        const basics =
          asRecord(node[`DADOS-BASICOS-DA-${type}`]) ??
          asRecord(node[`DADOS-BASICOS-DE-${type}`]) ??
          ensureChild(node, `DADOS-BASICOS-DA-${type}`);
        setAttrPreserve(basics, "TITULO", entry.title);
        setAttrPreserve(basics, "ANO", entry.year);
        const detail =
          asRecord(node[`DETALHAMENTO-DA-${type}`]) ??
          asRecord(node[`DETALHAMENTO-DE-${type}`]) ??
          ensureChild(node, `DETALHAMENTO-DA-${type}`);
        setAttrPreserve(detail, "NOME-DO-EVENTO", entry.eventName);
        setAttrPreserve(detail, "CIDADE-DO-EVENTO", entry.city);
      });
    }
  }

  if (data.additionalInstitutions.length > 0) {
    const instRoot = ensureChild(complement, "INFORMACOES-ADICIONAIS-INSTITUICOES");
    syncSimpleList(
      instRoot,
      "INFORMACAO-ADICIONAL-INSTITUICAO",
      data.additionalInstitutions,
      (node, entry: AdditionalInstitution) => {
        setAttrPreserve(node, "CODIGO-INSTITUICAO", entry.institutionCode);
        setAttrPreserve(node, "SIGLA-INSTITUICAO", entry.acronym);
        setAttrPreserve(node, "NOME-PAIS-INSTITUICAO", entry.country);
      },
    );
  }

  if (data.additionalCourses.length > 0) {
    const coursesRoot = ensureChild(complement, "INFORMACOES-ADICIONAIS-CURSOS");
    syncSimpleList(
      coursesRoot,
      "INFORMACAO-ADICIONAL-CURSO",
      data.additionalCourses,
      (node, entry: AdditionalCourse) => {
        setAttrPreserve(node, "CODIGO-CURSO", entry.courseCode);
        setAttrPreserve(node, "CODIGO-INSTITUICAO", entry.institutionCode);
        setAttrPreserve(node, "NOME-INSTITUICAO", entry.institutionName);
      },
    );
  }
}

function syncSummaryAndOtherInfo(dadosGerais: XmlRecord, cv: Curriculum): void {
  if (cv.identification.summary !== undefined) {
    const resumo = ensureChild(dadosGerais, "RESUMO-CV");
    delete resumo["#text"];
    setAttrPreserve(resumo, "TEXTO-RESUMO-CV-RH", cv.identification.summary);
    setAttrPreserve(resumo, "TEXTO-RESUMO-CV-RH-EN", cv.identification.summaryEnglish);
  } else {
    delete dadosGerais["RESUMO-CV"];
  }

  if (cv.identification.otherRelevantInfo !== undefined) {
    const outras = ensureChild(dadosGerais, "OUTRAS-INFORMACOES-RELEVANTES");
    delete outras["#text"];
    setAttrPreserve(
      outras,
      "OUTRAS-INFORMACOES-RELEVANTES",
      cv.identification.otherRelevantInfo,
    );
  } else {
    delete dadosGerais["OUTRAS-INFORMACOES-RELEVANTES"];
  }
}

function syncRootMetadata(root: XmlRecord, cv: Curriculum): void {
  setAttr(root, "NUMERO-IDENTIFICADOR", cv.id);
  setAttr(root, "DATA-ATUALIZACAO", cv.updatedAt.rawDate || undefined);
  setAttr(root, "HORA-ATUALIZACAO", cv.updatedAt.rawTime || undefined);
  setAttrPreserve(root, "SISTEMA-ORIGEM-XML", cv.metadata.systemOrigin ?? "LATTES_OFFLINE");
  setAttrPreserve(root, "FORMATO-DATA-ATUALIZACAO", cv.metadata.dateFormat ?? "DDMMAAAA");
  setAttrPreserve(root, "FORMATO-HORA-ATUALIZACAO", cv.metadata.timeFormat ?? "HHMMSS");
}

function syncAdvisories(root: XmlRecord, cv: Curriculum): void {
  if (cv.advisories.completed.length === 0 && cv.advisories.inProgress.length === 0) {
    return;
  }
  const complement = ensureChild(root, "DADOS-COMPLEMENTARES");
  syncAdvisoryGroup(
    complement,
    "ORIENTACOES-CONCLUIDAS",
    COMPLETED_ADVISORY_TAGS,
    cv.advisories.completed,
  );
  syncAdvisoryGroup(
    complement,
    "ORIENTACOES-EM-ANDAMENTO",
    IN_PROGRESS_ADVISORY_TAGS,
    cv.advisories.inProgress,
  );
}

/** Applies typed Curriculum fields onto the XML document tree before serialization. */
export function syncCvToDocument(cv: Curriculum): void {
  const root = cv.document;
  const dadosGerais = asRecord(root["DADOS-GERAIS"]) ?? {};
  root["DADOS-GERAIS"] = dadosGerais;

  setAttr(dadosGerais, "NOME-COMPLETO", cv.identification.fullName);
  setAttrPreserve(
    dadosGerais,
    "NOME-EM-CITACOES-BIBLIOGRAFICAS",
    cv.identification.citationName,
  );
  setAttrPreserve(dadosGerais, "NOME-CITACOES", cv.identification.citationName);
  syncSummaryAndOtherInfo(dadosGerais, cv);

  syncProfessionalAddress(dadosGerais, cv.identification.professionalAddress);
  if (cv.identification.residentialAddress) {
    const endereco = ensureChild(dadosGerais, "ENDERECO");
    let residential = asRecord(cv.identification.residentialAddress.raw);
    if (!residential || asRecord(endereco["ENDERECO-RESIDENCIAL"]) !== residential) {
      residential = ensureChild(endereco, "ENDERECO-RESIDENCIAL");
    }
    setAttrPreserve(residential, "CIDADE", cv.identification.residentialAddress.city);
    setAttrPreserve(residential, "UF", cv.identification.residentialAddress.state);
    setAttrPreserve(residential, "PAIS", cv.identification.residentialAddress.country);
  }
  syncResearchAreas(dadosGerais, cv.identification.researchAreas);
  syncLanguages(dadosGerais, cv.identification.languages);
  syncAcademicBackground(dadosGerais, cv.academicBackground);
  syncProfessionalActivities(dadosGerais, cv.professionalActivities);
  syncAwards(dadosGerais, cv.awards);

  syncRootMetadata(root, cv);

  syncBibliographicProduction(root, cv);
  syncTechnicalProduction(root, cv.technicalProduction);
  syncComplementaryData(root, cv);
  syncAdvisories(root, cv);
}
