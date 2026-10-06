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
  EventParticipant,
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
import { syncProductionEnvelope } from "./production/envelope.js";

export type CurriculumSectionId =
  | "identification"
  | "academicBackground"
  | "professionalActivities"
  | "bibliographicProduction"
  | "technicalProduction"
  | "complementary"
  | "advisories"
  | "awards"
  | "metadata";

const CURRICULUM_SECTION_IDS: readonly CurriculumSectionId[] = [
  "identification",
  "academicBackground",
  "professionalActivities",
  "bibliographicProduction",
  "technicalProduction",
  "complementary",
  "advisories",
  "awards",
  "metadata",
];

export interface SyncDocumentOptions {
  sections?: CurriculumSectionId[];
}

/** Maps patch paths to the curriculum sections those paths belong to. */
export function sectionsFromPatchPaths(paths: string[]): CurriculumSectionId[] {
  const seen = new Set<CurriculumSectionId>();
  const sections: CurriculumSectionId[] = [];
  for (const path of paths) {
    const head = path.split(/[.\[]/)[0] ?? "";
    if (
      (CURRICULUM_SECTION_IDS as readonly string[]).includes(head) &&
      !seen.has(head as CurriculumSectionId)
    ) {
      const id = head as CurriculumSectionId;
      seen.add(id);
      sections.push(id);
    }
  }
  return sections;
}

function sectionSelected(
  sections: CurriculumSectionId[] | undefined,
  id: CurriculumSectionId,
): boolean {
  return sections === undefined || sections.includes(id);
}

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

function hasChildElements(record: XmlRecord): boolean {
  return Object.keys(record).some((key) => key !== "#text" && !key.startsWith("@_"));
}

const OWNED_TECHNICAL_TAGS = [
  "PATENTE",
  "PRODUTO-TECNOLOGICO",
  "PROCESSOS-OU-TECNICAS",
  "SOFTWARE",
  "TRABALHO-TECNICO",
] as const;

const OWNED_DEMAIS_TECHNICAL_TAGS = [
  "APRESENTACAO-DE-TRABALHO",
  "MIDIA-SOCIAL-WEBSITE-BLOG",
  "MANUTENCAO-DE-OBRA-ARTISTICA",
  "OUTRA-PRODUCAO-TECNICA",
  "CURSO-DE-CURTA-DURACAO-MINISTRADO",
  "DESENVOLVIMENTO-DE-MATERIAL-DIDATICO-OU-INSTRUCIONAL",
  "EDITORACAO",
  "ORGANIZACAO-DE-EVENTO",
  "PROGRAMA-DE-RADIO-OU-TV",
] as const;

const OWNED_BIBLIOGRAPHIC_TAGS = [
  "ARTIGOS-PUBLICADOS",
  "TRABALHOS-EM-EVENTOS",
  "LIVROS-E-CAPITULOS",
  "OUTRA-PRODUCAO-BIBLIOGRAFICA",
  "DEMAIS-TIPOS-DE-PRODUCAO-BIBLIOGRAFICA",
] as const;

const COMPLEMENTARY_LIST_TAGS = [
  "FORMACAO-COMPLEMENTAR",
  "PARTICIPACAO-EM-EVENTOS-CONGRESSOS",
  "INFORMACOES-ADICIONAIS-INSTITUICOES",
  "INFORMACOES-ADICIONAIS-CURSOS",
] as const;

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

function syncAcademicBackground(
  dadosGerais: XmlRecord,
  degrees: AcademicDegree[],
  deleteWhenEmpty = false,
): void {
  if (degrees.length === 0) {
    if (!deleteWhenEmpty) {
      return;
    }
    const formacao = asRecord(dadosGerais["FORMACAO-ACADEMICA-TITULACAO"]);
    if (!formacao) {
      return;
    }
    for (const tag of DEGREE_TAGS) {
      delete formacao[tag];
    }
    if (!hasChildElements(formacao)) {
      delete dadosGerais["FORMACAO-ACADEMICA-TITULACAO"];
    }
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
  deleteWhenEmpty = false,
): void {
  if (activities.length === 0) {
    if (deleteWhenEmpty) {
      delete dadosGerais["ATUACOES-PROFISSIONAIS"];
    }
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

function syncStreetAttr(
  record: XmlRecord,
  street: string | undefined,
  preferred: string,
  alternate?: string,
): void {
  if (street === undefined) {
    return;
  }
  const preferredKey = `@_${preferred}`;
  const alternateKey = alternate ? `@_${alternate}` : undefined;
  const preferredValue = record[preferredKey];
  const alternateValue = alternateKey ? record[alternateKey] : undefined;
  if (typeof preferredValue === "string" && preferredValue !== "") {
    setAttrPreserve(record, preferred, street);
    return;
  }
  if (alternate && typeof alternateValue === "string" && alternateValue !== "") {
    setAttrPreserve(record, alternate, street);
    return;
  }
  if (preferredKey in record) {
    setAttrPreserve(record, preferred, street);
    return;
  }
  if (alternate && alternateKey && alternateKey in record) {
    setAttrPreserve(record, alternate, street);
    return;
  }
  setAttrPreserve(record, preferred, street);
}

function syncAddressLines(
  record: XmlRecord,
  address: ProfessionalAddress,
  streetPreferred: string,
  streetAlternate?: string,
): void {
  syncStreetAttr(record, address.street, streetPreferred, streetAlternate);
  setAttrPreserve(record, "CEP", address.postalCode);
  setAttrPreserve(record, "BAIRRO", address.neighborhood);
  setAttrPreserve(record, "DDD", address.areaCode);
  setAttrPreserve(record, "TELEFONE", address.phone);
  setAttrPreserve(record, "E-MAIL", address.email);
  setAttrPreserve(record, "HOME-PAGE", address.homepage);
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
  syncAddressLines(prof, address, "LOGRADOURO-COMPLEMENTO", "LOGRADOURO");
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
  deleteWhenEmpty = false,
): void {
  if (items.length === 0) {
    if (!deleteWhenEmpty) {
      return;
    }
    const container = containerTag ? asRecord(parent[containerTag]) : parent;
    if (!container) {
      return;
    }
    delete container[itemTag];
    if (containerTag && !hasChildElements(container)) {
      delete parent[containerTag];
    }
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

function syncBibliographicProduction(
  root: XmlRecord,
  cv: Curriculum,
  deleteWhenEmpty = false,
): void {
  if (!hasBibliographicItems(cv)) {
    if (!deleteWhenEmpty) {
      return;
    }
    const bibliographic = asRecord(root["PRODUCAO-BIBLIOGRAFICA"]);
    if (!bibliographic) {
      return;
    }
    for (const tag of OWNED_BIBLIOGRAPHIC_TAGS) {
      delete bibliographic[tag];
    }
    if (!hasChildElements(bibliographic)) {
      delete root["PRODUCAO-BIBLIOGRAFICA"];
    }
    return;
  }
  const bibliographic = ensureChild(root, "PRODUCAO-BIBLIOGRAFICA");
  const production = cv.bibliographicProduction;

  syncBibliographicList(
    bibliographic,
    "ARTIGOS-PUBLICADOS",
    "ARTIGO-PUBLICADO",
    production.journalArticles,
    deleteWhenEmpty,
  );
  syncBibliographicList(
    bibliographic,
    "TRABALHOS-EM-EVENTOS",
    "TRABALHO-EM-EVENTOS",
    production.conferencePapers,
    deleteWhenEmpty,
  );

  const books = production.booksAndChapters.filter((item) => item.type === "book");
  const chapters = production.booksAndChapters.filter(
    (item) => item.type === "book_chapter",
  );
  if (books.length === 0 && chapters.length === 0 && deleteWhenEmpty) {
    delete bibliographic["LIVROS-E-CAPITULOS"];
  } else {
    const booksContainer = ensureChild(bibliographic, "LIVROS-E-CAPITULOS");
    syncBibliographicList(booksContainer, null, bookItemTag("book"), books, deleteWhenEmpty);
    syncBibliographicList(
      booksContainer,
      null,
      bookItemTag("book_chapter"),
      chapters,
      deleteWhenEmpty,
    );
    if (deleteWhenEmpty && !hasChildElements(booksContainer)) {
      delete bibliographic["LIVROS-E-CAPITULOS"];
    }
  }

  syncBibliographicList(
    bibliographic,
    null,
    "OUTRA-PRODUCAO-BIBLIOGRAFICA",
    production.other,
    deleteWhenEmpty,
  );
  if (deleteWhenEmpty && production.other.length === 0) {
    delete bibliographic["DEMAIS-TIPOS-DE-PRODUCAO-BIBLIOGRAFICA"];
  }
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

const TECHNICAL_TITLE_ATTRIBUTES = [
  "TITULO-DO-SOFTWARE",
  "TITULO-PATENTE",
  "TITULO-DO-PRODUTO-TECNOLOGICO",
  "TITULO",
  "TITULO-DO-TRABALHO-TECNICO",
] as const;

const TECHNICAL_TITLE_BY_TYPE: Record<string, string> = {
  patent: "TITULO-PATENTE",
  technology_product: "TITULO-DO-PRODUTO-TECNOLOGICO",
  software: "TITULO-DO-SOFTWARE",
  technical_work: "TITULO-DO-TRABALHO-TECNICO",
};

function writeTechnicalTitle(basics: XmlRecord, item: TechnicalItem): void {
  const present = TECHNICAL_TITLE_ATTRIBUTES.find((name) => `@_${name}` in basics);
  if (present) {
    setAttrPreserve(basics, present, item.title);
    return;
  }
  const typed = TECHNICAL_TITLE_BY_TYPE[item.type];
  if (typed) {
    setAttrPreserve(basics, typed, item.title);
    return;
  }
  const hasAttributes = Object.keys(basics).some((key) => key.startsWith("@_"));
  if (!hasAttributes) {
    setAttrPreserve(basics, "TITULO", item.title);
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
  syncProductionEnvelope(record, item);
  writeTechnicalTitle(basics, item);
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

function syncTechnicalProduction(
  root: XmlRecord,
  items: TechnicalItem[],
  deleteWhenEmpty = false,
): void {
  if (items.length === 0) {
    if (deleteWhenEmpty) {
      delete root["PRODUCAO-TECNICA"];
    }
    return;
  }
  const container = ensureChild(root, "PRODUCAO-TECNICA");
  const topLevel = items.filter((item) => !item.containerTag);
  const demais = items.filter(
    (item) => item.containerTag === "DEMAIS-TIPOS-DE-PRODUCAO-TECNICA",
  );

  syncTechnicalGroup(container, topLevel);
  if (deleteWhenEmpty) {
    const present = new Set(topLevel.map(technicalTag));
    for (const tag of OWNED_TECHNICAL_TAGS) {
      if (!present.has(tag)) {
        delete container[tag];
      }
    }
  }
  if (demais.length > 0) {
    const demaisContainer = ensureChild(container, "DEMAIS-TIPOS-DE-PRODUCAO-TECNICA");
    syncTechnicalGroup(demaisContainer, demais);
    if (deleteWhenEmpty) {
      const present = new Set(demais.map(technicalTag));
      for (const tag of OWNED_DEMAIS_TECHNICAL_TAGS) {
        if (!present.has(tag)) {
          delete demaisContainer[tag];
        }
      }
    }
  } else if (deleteWhenEmpty) {
    delete container["DEMAIS-TIPOS-DE-PRODUCAO-TECNICA"];
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

function syncEventParticipants(
  node: XmlRecord,
  participants: EventParticipant[] | undefined,
): void {
  if (!participants || participants.length === 0) {
    return;
  }
  const existing = asArray(node["PARTICIPANTE-DE-EVENTOS-CONGRESSOS"]).flatMap((entry) => {
    const record = asRecord(entry);
    return record ? [record] : [];
  });
  const next = participants.map((participant, index) => {
    const record = existing[index] ?? {};
    setAttrPreserve(
      record,
      "NOME-COMPLETO-DO-PARTICIPANTE-DE-EVENTOS-CONGRESSOS",
      participant.name,
    );
    setAttrPreserve(
      record,
      "NOME-PARA-CITACAO-DO-PARTICIPANTE-DE-EVENTOS-CONGRESSOS",
      participant.citationName,
    );
    if (participant.order !== undefined) {
      setAttrPreserve(record, "ORDEM-PARTICIPANTE", String(participant.order));
    }
    return record;
  });
  writeArray(node, "PARTICIPANTE-DE-EVENTOS-CONGRESSOS", next);
}

function clearComplementaryLists(root: XmlRecord): void {
  const complement = asRecord(root["DADOS-COMPLEMENTARES"]);
  if (!complement) {
    return;
  }
  for (const tag of COMPLEMENTARY_LIST_TAGS) {
    delete complement[tag];
  }
  if (!hasChildElements(complement)) {
    delete root["DADOS-COMPLEMENTARES"];
  }
}

function syncComplementaryData(
  root: XmlRecord,
  cv: Curriculum,
  deleteWhenEmpty = false,
): void {
  const data = cv.complementary;
  const hasData =
    data.complementaryTraining.length > 0 ||
    data.eventParticipation.length > 0 ||
    data.additionalInstitutions.length > 0 ||
    data.additionalCourses.length > 0;
  if (!hasData) {
    if (deleteWhenEmpty) {
      clearComplementaryLists(root);
    }
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
        setAttrPreserve(node, "NIVEL", entry.level);
        setAttrPreserve(node, "CODIGO-INSTITUICAO", entry.institutionCode);
        setAttrPreserve(node, "CODIGO-ORGAO", entry.organCode);
        setAttrPreserve(node, "NOME-ORGAO", entry.organName);
        setAttrPreserve(node, "CODIGO-CURSO", entry.courseCode);
        setAttrPreserve(node, "NOME-CURSO-INGLES", entry.titleEnglish);
        setAttrPreserve(node, "SEQUENCIA-FORMACAO", entry.sequence);
      });
    }
  } else if (deleteWhenEmpty) {
    delete complement["FORMACAO-COMPLEMENTAR"];
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
        const detail =
          asRecord(node[`DETALHAMENTO-DA-${type}`]) ??
          asRecord(node[`DETALHAMENTO-DE-${type}`]) ??
          ensureChild(node, `DETALHAMENTO-DA-${type}`);
        syncProductionEnvelope(node, entry);
        setAttrPreserve(basics, "TITULO", entry.title);
        setAttrPreserve(basics, "ANO", entry.year);
        setAttrPreserve(detail, "NOME-DO-EVENTO", entry.eventName);
        setAttrPreserve(detail, "CIDADE-DO-EVENTO", entry.city);
        syncEventParticipants(node, entry.participants);
      });
    }
  } else if (deleteWhenEmpty) {
    delete complement["PARTICIPACAO-EM-EVENTOS-CONGRESSOS"];
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
  } else if (deleteWhenEmpty) {
    delete complement["INFORMACOES-ADICIONAIS-INSTITUICOES"];
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
  } else if (deleteWhenEmpty) {
    delete complement["INFORMACOES-ADICIONAIS-CURSOS"];
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

function syncAdvisories(
  root: XmlRecord,
  cv: Curriculum,
  deleteWhenEmpty = false,
): void {
  const completedEmpty = cv.advisories.completed.length === 0;
  const inProgressEmpty = cv.advisories.inProgress.length === 0;
  if (completedEmpty && inProgressEmpty) {
    if (!deleteWhenEmpty) {
      return;
    }
    const complement = asRecord(root["DADOS-COMPLEMENTARES"]);
    if (!complement) {
      return;
    }
    delete complement["ORIENTACOES-CONCLUIDAS"];
    delete complement["ORIENTACOES-EM-ANDAMENTO"];
    if (!hasChildElements(complement)) {
      delete root["DADOS-COMPLEMENTARES"];
    }
    return;
  }
  const complement = ensureChild(root, "DADOS-COMPLEMENTARES");
  if (completedEmpty && deleteWhenEmpty) {
    delete complement["ORIENTACOES-CONCLUIDAS"];
  } else {
    syncAdvisoryGroup(
      complement,
      "ORIENTACOES-CONCLUIDAS",
      COMPLETED_ADVISORY_TAGS,
      cv.advisories.completed,
    );
  }
  if (inProgressEmpty && deleteWhenEmpty) {
    delete complement["ORIENTACOES-EM-ANDAMENTO"];
  } else {
    syncAdvisoryGroup(
      complement,
      "ORIENTACOES-EM-ANDAMENTO",
      IN_PROGRESS_ADVISORY_TAGS,
      cv.advisories.inProgress,
    );
  }
}

/** Applies typed Curriculum fields onto the XML document tree before serialization. */
export function syncCvToDocument(cv: Curriculum, options?: SyncDocumentOptions): void {
  const sections = options?.sections;
  const selected = (id: CurriculumSectionId) => sectionSelected(sections, id);
  const deleteWhenEmpty = sections !== undefined;
  const root = cv.document;
  const dadosGerais = asRecord(root["DADOS-GERAIS"]) ?? {};
  root["DADOS-GERAIS"] = dadosGerais;

  if (selected("identification")) {
    setAttr(dadosGerais, "NOME-COMPLETO", cv.identification.fullName);
    setAttrPreserve(
      dadosGerais,
      "NOME-EM-CITACOES-BIBLIOGRAFICAS",
      cv.identification.citationName,
    );
    setAttrPreserve(dadosGerais, "NOME-CITACOES", cv.identification.citationName);
    syncSummaryAndOtherInfo(dadosGerais, cv);

    syncProfessionalAddress(dadosGerais, cv.identification.professionalAddress);
    if (cv.identification.addressContact || cv.identification.residentialAddress) {
      const endereco = ensureChild(dadosGerais, "ENDERECO");
      const contact = cv.identification.addressContact;
      if (contact) {
        setAttrPreserve(endereco, "FLAG-DE-PREFERENCIA", contact.preference);
        setAttrPreserve(endereco, "ELETRONICO", contact.electronic);
        setAttrPreserve(endereco, "OUTRA-FORMA-DE-CONTATO", contact.otherContact);
        setAttrPreserve(endereco, "REDE-SOCIAL", contact.socialNetwork);
      }
      if (cv.identification.residentialAddress) {
        let residential = asRecord(cv.identification.residentialAddress.raw);
        if (!residential || asRecord(endereco["ENDERECO-RESIDENCIAL"]) !== residential) {
          residential = ensureChild(endereco, "ENDERECO-RESIDENCIAL");
        }
        syncAddressLines(residential, cv.identification.residentialAddress, "LOGRADOURO");
        setAttrPreserve(residential, "CIDADE", cv.identification.residentialAddress.city);
        setAttrPreserve(residential, "UF", cv.identification.residentialAddress.state);
        setAttrPreserve(residential, "PAIS", cv.identification.residentialAddress.country);
      }
    }
    syncResearchAreas(dadosGerais, cv.identification.researchAreas);
    syncLanguages(dadosGerais, cv.identification.languages);
  }

  if (selected("academicBackground")) {
    syncAcademicBackground(dadosGerais, cv.academicBackground, deleteWhenEmpty);
  }
  if (selected("professionalActivities")) {
    syncProfessionalActivities(dadosGerais, cv.professionalActivities, deleteWhenEmpty);
  }
  if (selected("awards")) {
    syncAwards(dadosGerais, cv.awards);
  }
  if (selected("metadata")) {
    syncRootMetadata(root, cv);
  }
  if (selected("bibliographicProduction")) {
    syncBibliographicProduction(root, cv, deleteWhenEmpty);
  }
  if (selected("technicalProduction")) {
    syncTechnicalProduction(root, cv.technicalProduction, deleteWhenEmpty);
  }
  if (selected("complementary")) {
    syncComplementaryData(root, cv, deleteWhenEmpty);
  }
  if (selected("advisories")) {
    syncAdvisories(root, cv, deleteWhenEmpty);
  }
}
