import {
  PROFESSIONAL_FUNCTION_COMMON_ATTRS,
  PROFESSIONAL_FUNCTION_COMMON_XML_ATTRS,
  PROFESSIONAL_FUNCTION_SPECS,
} from "../../schema/professional-function-catalog.js";
import type {
  ProfessionalFunctionEntry,
  ProjectParticipation,
  ResearchProject,
  ResearchProjectFunder,
  ResearchProjectTeamMember,
} from "../../types.js";
import { asArray, asRecord, attr, type XmlRecord } from "../xml-utils.js";

function mapTeamMembers(project: XmlRecord): ResearchProjectTeamMember[] {
  const teamRoot = asRecord(project["EQUIPE-DO-PROJETO"]);
  if (!teamRoot) {
    return [];
  }
  return asArray(teamRoot["INTEGRANTES-DO-PROJETO"]).flatMap((entry) => {
    const node = asRecord(entry);
    if (!node) {
      return [];
    }
    const name = attr(node, "NOME-COMPLETO");
    if (!name) {
      return [];
    }
    return [
      {
        name,
        citationName: attr(node, "NOME-PARA-CITACAO"),
        integrationOrder: attr(node, "ORDEM-DE-INTEGRACAO"),
        responsible: attr(node, "FLAG-RESPONSAVEL"),
        raw: node,
      },
    ];
  });
}

function mapFunders(project: XmlRecord): ResearchProjectFunder[] {
  const fundersRoot = asRecord(project["FINANCIADORES-DO-PROJETO"]);
  if (!fundersRoot) {
    return [];
  }
  return asArray(fundersRoot["FINANCIADOR-DO-PROJETO"]).flatMap((entry) => {
    const node = asRecord(entry);
    if (!node) {
      return [];
    }
    return [
      {
        sequence: attr(node, "SEQUENCIA-FINANCIADOR"),
        institutionCode: attr(node, "CODIGO-INSTITUICAO"),
        institutionName: attr(node, "NOME-INSTITUICAO"),
        nature: attr(node, "NATUREZA"),
        raw: node,
      },
    ];
  });
}

function mapResearchProject(record: XmlRecord): ResearchProject | undefined {
  const name = attr(record, "NOME-DO-PROJETO");
  if (!name) {
    return undefined;
  }
  return {
    name,
    nameEnglish: attr(record, "NOME-DO-PROJETO-INGLES"),
    startYear: attr(record, "ANO-INICIO"),
    endYear: attr(record, "ANO-FIM"),
    sequence: attr(record, "SEQUENCIA-PROJETO"),
    situation: attr(record, "SITUACAO"),
    nature: attr(record, "NATUREZA"),
    description: attr(record, "DESCRICAO-DO-PROJETO"),
    descriptionEnglish: attr(record, "DESCRICAO-DO-PROJETO-INGLES"),
    projectIdentifier: attr(record, "IDENTIFICADOR-PROJETO"),
    innovationPotential: attr(record, "FLAG-POTENCIAL-INOVACAO"),
    teamMembers: mapTeamMembers(record),
    funders: mapFunders(record),
    raw: record,
  };
}

function mapFunctionEntry(
  spec: (typeof PROFESSIONAL_FUNCTION_SPECS)[number],
  record: XmlRecord,
): ProfessionalFunctionEntry {
  const specifics: Record<string, string> = {};
  for (const [key, value] of Object.entries(record)) {
    if (!key.startsWith("@_") || typeof value !== "string") {
      continue;
    }
    const xmlName = key.slice(2);
    if (!PROFESSIONAL_FUNCTION_COMMON_XML_ATTRS.has(xmlName)) {
      specifics[xmlName] = value;
    }
  }
  return {
    category: spec.category,
    xmlContainerTag: spec.containerTag,
    xmlItemTag: spec.itemTag,
    sequence: attr(record, PROFESSIONAL_FUNCTION_COMMON_ATTRS.sequence),
    periodFlag: attr(record, PROFESSIONAL_FUNCTION_COMMON_ATTRS.periodFlag),
    startMonth: attr(record, PROFESSIONAL_FUNCTION_COMMON_ATTRS.startMonth),
    startYear: attr(record, PROFESSIONAL_FUNCTION_COMMON_ATTRS.startYear),
    endMonth: attr(record, PROFESSIONAL_FUNCTION_COMMON_ATTRS.endMonth),
    endYear: attr(record, PROFESSIONAL_FUNCTION_COMMON_ATTRS.endYear),
    organCode: attr(record, PROFESSIONAL_FUNCTION_COMMON_ATTRS.organCode),
    organName: attr(record, PROFESSIONAL_FUNCTION_COMMON_ATTRS.organName),
    unitCode: attr(record, PROFESSIONAL_FUNCTION_COMMON_ATTRS.unitCode),
    unitName: attr(record, PROFESSIONAL_FUNCTION_COMMON_ATTRS.unitName),
    specifics,
    raw: record,
  };
}

export function mapProfessionalFunctionActivities(
  activity: XmlRecord,
): ProfessionalFunctionEntry[] {
  const entries: ProfessionalFunctionEntry[] = [];
  for (const spec of PROFESSIONAL_FUNCTION_SPECS) {
    const container = asRecord(activity[spec.containerTag]);
    if (!container) {
      continue;
    }
    for (const entry of asArray(container[spec.itemTag])) {
      const record = asRecord(entry);
      if (!record) {
        continue;
      }
      entries.push(mapFunctionEntry(spec, record));
    }
  }
  return entries;
}

export function mapProjectParticipations(activity: XmlRecord): ProjectParticipation[] {
  const participationRoot = asRecord(activity["ATIVIDADES-DE-PARTICIPACAO-EM-PROJETO"]);
  if (!participationRoot) {
    return [];
  }

  const participations: ProjectParticipation[] = [];
  for (const entry of asArray(participationRoot["PARTICIPACAO-EM-PROJETO"])) {
    const record = asRecord(entry);
    if (!record) {
      continue;
    }
    const projects = asArray(record["PROJETO-DE-PESQUISA"]).flatMap((projectEntry) => {
      const projectRecord = asRecord(projectEntry);
      if (!projectRecord) {
        return [];
      }
      const mapped = mapResearchProject(projectRecord);
      return mapped ? [mapped] : [];
    });
    if (projects.length === 0) {
      continue;
    }
    participations.push({
      sequence: attr(record, "SEQUENCIA-FUNCAO-ATIVIDADE"),
      periodFlag: attr(record, "FLAG-PERIODO"),
      startMonth: attr(record, "MES-INICIO"),
      startYear: attr(record, "ANO-INICIO"),
      endMonth: attr(record, "MES-FIM"),
      endYear: attr(record, "ANO-FIM"),
      organCode: attr(record, "CODIGO-ORGAO"),
      organName: attr(record, "NOME-ORGAO"),
      unitCode: attr(record, "CODIGO-UNIDADE"),
      unitName: attr(record, "NOME-UNIDADE"),
      projects,
      raw: record,
    });
  }
  return participations;
}
