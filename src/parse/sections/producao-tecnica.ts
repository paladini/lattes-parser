import type { TechnicalItem } from "../../types.js";
import { mapAuthors } from "../authors.js";
import { parseProductionEnvelope } from "../production/envelope.js";
import { asArray, asRecord, attr, type XmlRecord } from "../xml-utils.js";

const TOP_LEVEL_TECH: Array<[string, string]> = [
  ["PATENTE", "patent"],
  ["PRODUTO-TECNOLOGICO", "technology_product"],
  ["PROCESSOS-OU-TECNICAS", "process_or_technique"],
  ["SOFTWARE", "software"],
  ["TRABALHO-TECNICO", "technical_work"],
];

const DEMAIS_TECH: Array<[string, string]> = [
  ["APRESENTACAO-DE-TRABALHO", "presentation"],
  ["MIDIA-SOCIAL-WEBSITE-BLOG", "media_social_website_blog"],
  ["MANUTENCAO-DE-OBRA-ARTISTICA", "artwork_maintenance"],
  ["OUTRA-PRODUCAO-TECNICA", "other_technical"],
  ["CURSO-DE-CURTA-DURACAO-MINISTRADO", "short_course"],
  ["DESENVOLVIMENTO-DE-MATERIAL-DIDATICO-OU-INSTRUCIONAL", "instructional_material"],
  ["EDITORACAO", "editing"],
  ["ORGANIZACAO-DE-EVENTO", "event_organization"],
  ["PROGRAMA-DE-RADIO-OU-TV", "radio_tv_program"],
];

function titleFromTechnicalRecord(record: XmlRecord): string | undefined {
  for (const [key, value] of Object.entries(record)) {
    if (!key.startsWith("DADOS-BASICOS")) {
      continue;
    }
    const basics = asRecord(value);
    if (!basics) {
      continue;
    }
    const title =
      attr(basics, "TITULO-DO-SOFTWARE") ??
      attr(basics, "TITULO-DO-TRABALHO-TECNICO") ??
      attr(basics, "TITULO-PATENTE") ??
      attr(basics, "TITULO-DO-PRODUTO-TECNOLOGICO") ??
      attr(basics, "TITULO") ??
      attr(basics, "TITULO-INGLES");
    if (title) {
      return title;
    }
  }
  return attr(record, "TITULO");
}

function yearFromTechnicalRecord(record: XmlRecord): string | undefined {
  for (const [key, value] of Object.entries(record)) {
    if (!key.startsWith("DADOS-BASICOS")) {
      continue;
    }
    const basics = asRecord(value);
    if (basics) {
      const year = attr(basics, "ANO") ?? attr(basics, "ANO-DO-TRABALHO");
      if (year) {
        return year;
      }
    }
  }
  return undefined;
}

function mapTechnicalEntries(
  entries: unknown[],
  typeLabel: string,
  xmlTag: string,
  containerTag?: string,
): TechnicalItem[] {
  return entries.flatMap((entry) => {
    const record = asRecord(entry);
    if (!record) {
      return [];
    }
    const title = titleFromTechnicalRecord(record);
    if (!title) {
      return [];
    }
    return [
      {
        type: typeLabel,
        xmlTag,
        containerTag,
        title,
        year: yearFromTechnicalRecord(record),
        sequence: attr(record, "SEQUENCIA-PRODUCAO"),
        authors: mapAuthors(record),
        ...parseProductionEnvelope(record),
        raw: record,
      },
    ];
  });
}

export function mapTechnicalProduction(node: unknown): TechnicalItem[] {
  const root = asRecord(node);
  if (!root) {
    return [];
  }

  const items: TechnicalItem[] = [];
  for (const [tag, label] of TOP_LEVEL_TECH) {
    items.push(...mapTechnicalEntries(asArray(root[tag]), label, tag));
  }

  const demais = asRecord(root["DEMAIS-TIPOS-DE-PRODUCAO-TECNICA"]);
  if (demais) {
    for (const [tag, label] of DEMAIS_TECH) {
      items.push(
        ...mapTechnicalEntries(
          asArray(demais[tag]),
          label,
          tag,
          "DEMAIS-TIPOS-DE-PRODUCAO-TECNICA",
        ),
      );
    }
  }

  return items;
}
