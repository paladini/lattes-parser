/** XSD blocks under ATUACAO-PROFISSIONAL (excluding VINCULOS and project participation). */

export interface ProfessionalFunctionSpec {
  category: string;
  containerTag: string;
  itemTag: string;
}

export const PROFESSIONAL_FUNCTION_SPECS: readonly ProfessionalFunctionSpec[] = [
  {
    category: "direction_and_administration",
    containerTag: "ATIVIDADES-DE-DIRECAO-E-ADMINISTRACAO",
    itemTag: "DIRECAO-E-ADMINISTRACAO",
  },
  {
    category: "research_and_development",
    containerTag: "ATIVIDADES-DE-PESQUISA-E-DESENVOLVIMENTO",
    itemTag: "PESQUISA-E-DESENVOLVIMENTO",
  },
  {
    category: "teaching",
    containerTag: "ATIVIDADES-DE-ENSINO",
    itemTag: "ENSINO",
  },
  {
    category: "internship",
    containerTag: "ATIVIDADES-DE-ESTAGIO",
    itemTag: "ESTAGIO",
  },
  {
    category: "specialized_technical_service",
    containerTag: "ATIVIDADES-DE-SERVICO-TECNICO-ESPECIALIZADO",
    itemTag: "SERVICO-TECNICO-ESPECIALIZADO",
  },
  {
    category: "university_extension",
    containerTag: "ATIVIDADES-DE-EXTENSAO-UNIVERSITARIA",
    itemTag: "EXTENSAO-UNIVERSITARIA",
  },
  {
    category: "training_delivered",
    containerTag: "ATIVIDADES-DE-TREINAMENTO-MINISTRADO",
    itemTag: "TREINAMENTO-MINISTRADO",
  },
  {
    category: "other_scientific_activity",
    containerTag: "OUTRAS-ATIVIDADES-TECNICO-CIENTIFICA",
    itemTag: "OUTRA-ATIVIDADE-TECNICO-CIENTIFICA",
  },
  {
    category: "board_commission_consultancy",
    containerTag: "ATIVIDADES-DE-CONSELHO-COMISSAO-E-CONSULTORIA",
    itemTag: "CONSELHO-COMISSAO-E-CONSULTORIA",
  },
];

export const PROFESSIONAL_FUNCTION_COMMON_ATTRS = {
  sequence: "SEQUENCIA-FUNCAO-ATIVIDADE",
  periodFlag: "FLAG-PERIODO",
  startMonth: "MES-INICIO",
  startYear: "ANO-INICIO",
  endMonth: "MES-FIM",
  endYear: "ANO-FIM",
  organCode: "CODIGO-ORGAO",
  organName: "NOME-ORGAO",
  unitCode: "CODIGO-UNIDADE",
  unitName: "NOME-UNIDADE",
} as const;

export const PROFESSIONAL_FUNCTION_COMMON_XML_ATTRS: ReadonlySet<string> = new Set(
  Object.values(PROFESSIONAL_FUNCTION_COMMON_ATTRS),
);

export const PROFESSIONAL_FUNCTION_SPECS_BY_CONTAINER: Readonly<
  Record<string, ProfessionalFunctionSpec>
> = Object.fromEntries(
  PROFESSIONAL_FUNCTION_SPECS.map((spec) => [spec.containerTag, spec]),
);
