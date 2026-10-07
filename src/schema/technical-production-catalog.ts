/** XSD-aligned tags for technical production items (parse + serialize). */

export interface TechnicalTypeSpec {
  typeLabel: string;
  xmlTag: string;
  containerTag?: string;
  basicsTag: string;
  titleAttribute: string;
  yearAttribute: string;
}

const DEMAIS_CONTAINER = "DEMAIS-TIPOS-DE-PRODUCAO-TECNICA";

const TOP_LEVEL_SPECS: TechnicalTypeSpec[] = [
  {
    typeLabel: "patent",
    xmlTag: "PATENTE",
    basicsTag: "DADOS-BASICOS-DA-PATENTE",
    titleAttribute: "TITULO",
    yearAttribute: "ANO-DESENVOLVIMENTO",
  },
  {
    typeLabel: "technology_product",
    xmlTag: "PRODUTO-TECNOLOGICO",
    basicsTag: "DADOS-BASICOS-DO-PRODUTO-TECNOLOGICO",
    titleAttribute: "TITULO-DO-PRODUTO",
    yearAttribute: "ANO",
  },
  {
    typeLabel: "process_or_technique",
    xmlTag: "PROCESSOS-OU-TECNICAS",
    basicsTag: "DADOS-BASICOS-DO-PROCESSOS-OU-TECNICAS",
    titleAttribute: "TITULO-DO-PROCESSO",
    yearAttribute: "ANO",
  },
  {
    typeLabel: "software",
    xmlTag: "SOFTWARE",
    basicsTag: "DADOS-BASICOS-DO-SOFTWARE",
    titleAttribute: "TITULO-DO-SOFTWARE",
    yearAttribute: "ANO",
  },
  {
    typeLabel: "technical_work",
    xmlTag: "TRABALHO-TECNICO",
    basicsTag: "DADOS-BASICOS-DO-TRABALHO-TECNICO",
    titleAttribute: "TITULO-DO-TRABALHO-TECNICO",
    yearAttribute: "ANO",
  },
  {
    typeLabel: "registered_cultivar",
    xmlTag: "CULTIVAR-REGISTRADA",
    basicsTag: "DADOS-BASICOS-DA-CULTIVAR",
    titleAttribute: "DENOMINACAO",
    yearAttribute: "ANO-SOLICITACAO",
  },
  {
    typeLabel: "protected_cultivar",
    xmlTag: "CULTIVAR-PROTEGIDA",
    basicsTag: "DADOS-BASICOS-DA-CULTIVAR",
    titleAttribute: "DENOMINACAO",
    yearAttribute: "ANO-SOLICITACAO",
  },
  {
    typeLabel: "industrial_design",
    xmlTag: "DESENHO-INDUSTRIAL",
    basicsTag: "DADOS-BASICOS-DO-DESENHO-INDUSTRIAL",
    titleAttribute: "TITULO",
    yearAttribute: "ANO-DESENVOLVIMENTO",
  },
  {
    typeLabel: "trademark",
    xmlTag: "MARCA",
    basicsTag: "DADOS-BASICOS-DA-MARCA",
    titleAttribute: "TITULO",
    yearAttribute: "ANO-DESENVOLVIMENTO",
  },
  {
    typeLabel: "integrated_circuit_topography",
    xmlTag: "TOPOGRAFIA-DE-CIRCUITO-INTEGRADO",
    basicsTag: "DADOS-BASICOS-DA-TOPOGRAFIA-DE-CIRCUITO-INTEGRADO",
    titleAttribute: "TITULO",
    yearAttribute: "ANO-DESENVOLVIMENTO",
  },
];

const DEMAIS_SPECS: TechnicalTypeSpec[] = [
  {
    typeLabel: "presentation",
    xmlTag: "APRESENTACAO-DE-TRABALHO",
    containerTag: DEMAIS_CONTAINER,
    basicsTag: "DADOS-BASICOS-DA-APRESENTACAO-DE-TRABALHO",
    titleAttribute: "TITULO",
    yearAttribute: "ANO",
  },
  {
    typeLabel: "media_social_website_blog",
    xmlTag: "MIDIA-SOCIAL-WEBSITE-BLOG",
    containerTag: DEMAIS_CONTAINER,
    basicsTag: "DADOS-BASICOS-DA-MIDIA-SOCIAL-WEBSITE-BLOG",
    titleAttribute: "TITULO",
    yearAttribute: "ANO",
  },
  {
    typeLabel: "artwork_maintenance",
    xmlTag: "MANUTENCAO-DE-OBRA-ARTISTICA",
    containerTag: DEMAIS_CONTAINER,
    basicsTag: "DADOS-BASICOS-DE-MANUTENCAO-DE-OBRA-ARTISTICA",
    titleAttribute: "TITULO",
    yearAttribute: "ANO",
  },
  {
    typeLabel: "other_technical",
    xmlTag: "OUTRA-PRODUCAO-TECNICA",
    containerTag: DEMAIS_CONTAINER,
    basicsTag: "DADOS-BASICOS-DE-OUTRA-PRODUCAO-TECNICA",
    titleAttribute: "TITULO",
    yearAttribute: "ANO",
  },
  {
    typeLabel: "short_course",
    xmlTag: "CURSO-DE-CURTA-DURACAO-MINISTRADO",
    containerTag: DEMAIS_CONTAINER,
    basicsTag: "DADOS-BASICOS-DE-CURSOS-CURTA-DURACAO-MINISTRADO",
    titleAttribute: "TITULO",
    yearAttribute: "ANO",
  },
  {
    typeLabel: "instructional_material",
    xmlTag: "DESENVOLVIMENTO-DE-MATERIAL-DIDATICO-OU-INSTRUCIONAL",
    containerTag: DEMAIS_CONTAINER,
    basicsTag: "DADOS-BASICOS-DO-MATERIAL-DIDATICO-OU-INSTRUCIONAL",
    titleAttribute: "TITULO",
    yearAttribute: "ANO",
  },
  {
    typeLabel: "editing",
    xmlTag: "EDITORACAO",
    containerTag: DEMAIS_CONTAINER,
    basicsTag: "DADOS-BASICOS-DE-EDITORACAO",
    titleAttribute: "TITULO",
    yearAttribute: "ANO",
  },
  {
    typeLabel: "event_organization",
    xmlTag: "ORGANIZACAO-DE-EVENTO",
    containerTag: DEMAIS_CONTAINER,
    basicsTag: "DADOS-BASICOS-DA-ORGANIZACAO-DE-EVENTO",
    titleAttribute: "TITULO",
    yearAttribute: "ANO",
  },
  {
    typeLabel: "radio_tv_program",
    xmlTag: "PROGRAMA-DE-RADIO-OU-TV",
    containerTag: DEMAIS_CONTAINER,
    basicsTag: "DADOS-BASICOS-DO-PROGRAMA-DE-RADIO-OU-TV",
    titleAttribute: "TITULO",
    yearAttribute: "ANO",
  },
  {
    typeLabel: "map_or_chart",
    xmlTag: "CARTA-MAPA-OU-SIMILAR",
    containerTag: DEMAIS_CONTAINER,
    basicsTag: "DADOS-BASICOS-DE-CARTA-MAPA-OU-SIMILAR",
    titleAttribute: "TITULO",
    yearAttribute: "ANO",
  },
  {
    typeLabel: "scale_model",
    xmlTag: "MAQUETE",
    containerTag: DEMAIS_CONTAINER,
    basicsTag: "DADOS-BASICOS-DA-MAQUETE",
    titleAttribute: "TITULO",
    yearAttribute: "ANO",
  },
  {
    typeLabel: "research_report",
    xmlTag: "RELATORIO-DE-PESQUISA",
    containerTag: DEMAIS_CONTAINER,
    basicsTag: "DADOS-BASICOS-DO-RELATORIO-DE-PESQUISA",
    titleAttribute: "TITULO",
    yearAttribute: "ANO",
  },
];

export const TECHNICAL_TYPE_SPECS: readonly TechnicalTypeSpec[] = [
  ...TOP_LEVEL_SPECS,
  ...DEMAIS_SPECS,
];

export const TECHNICAL_SPECS_BY_TYPE: Readonly<Record<string, TechnicalTypeSpec>> =
  Object.fromEntries(TECHNICAL_TYPE_SPECS.map((spec) => [spec.typeLabel, spec]));

export const TECHNICAL_SPECS_BY_XML_TAG: Readonly<Record<string, TechnicalTypeSpec>> =
  Object.fromEntries(TECHNICAL_TYPE_SPECS.map((spec) => [spec.xmlTag, spec]));

/** Title attributes tried when reading basics (includes legacy misspellings). */
export const TECHNICAL_TITLE_READ_ATTRIBUTES: readonly string[] = [
  "TITULO-DO-SOFTWARE",
  "TITULO-DO-TRABALHO-TECNICO",
  "TITULO-DO-PRODUTO",
  "TITULO-DO-PROCESSO",
  "TITULO-DO-PRODUTO-TECNOLOGICO",
  "TITULO-PATENTE",
  "TITULO",
  "TITULO-INGLES",
  "DENOMINACAO",
];

export const TECHNICAL_YEAR_READ_ATTRIBUTES: readonly string[] = [
  "ANO",
  "ANO-DESENVOLVIMENTO",
  "ANO-DO-TRABALHO",
  "ANO-SOLICITACAO",
];

export function technicalSpecForItem(type: string, xmlTag?: string): TechnicalTypeSpec | undefined {
  if (xmlTag && TECHNICAL_SPECS_BY_XML_TAG[xmlTag]) {
    return TECHNICAL_SPECS_BY_XML_TAG[xmlTag];
  }
  return TECHNICAL_SPECS_BY_TYPE[type];
}
