/** XSD tags under OUTRA-PRODUCAO / PRODUCAO-ARTISTICA-CULTURAL, plus DEMAIS-TRABALHOS. */

export interface ArtisticTypeSpec {
  typeLabel: string;
  xmlTag: string;
  /** Set when the item lives under PRODUCAO-ARTISTICA-CULTURAL. */
  containerTag?: string;
  basicsTag: string;
}

const CULTURAL = "PRODUCAO-ARTISTICA-CULTURAL";

export const ARTISTIC_TYPE_SPECS: readonly ArtisticTypeSpec[] = [
  {
    typeLabel: "artwork_presentation",
    xmlTag: "APRESENTACAO-DE-OBRA-ARTISTICA",
    containerTag: CULTURAL,
    basicsTag: "DADOS-BASICOS-DA-APRESENTACAO-DE-OBRA-ARTISTICA",
  },
  {
    typeLabel: "radio_or_tv_presentation",
    xmlTag: "APRESENTACAO-EM-RADIO-OU-TV",
    containerTag: CULTURAL,
    basicsTag: "DADOS-BASICOS-DA-APRESENTACAO-EM-RADIO-OU-TV",
  },
  {
    typeLabel: "musical_arrangement",
    xmlTag: "ARRANJO-MUSICAL",
    containerTag: CULTURAL,
    basicsTag: "DADOS-BASICOS-DO-ARRANJO-MUSICAL",
  },
  {
    typeLabel: "musical_composition",
    xmlTag: "COMPOSICAO-MUSICAL",
    containerTag: CULTURAL,
    basicsTag: "DADOS-BASICOS-DA-COMPOSICAO-MUSICAL",
  },
  {
    typeLabel: "artistic_short_course",
    xmlTag: "CURSO-DE-CURTA-DURACAO",
    containerTag: CULTURAL,
    basicsTag: "DADOS-BASICOS-DO-CURSO-DE-CURTA-DURACAO",
  },
  {
    typeLabel: "visual_artwork",
    xmlTag: "OBRA-DE-ARTES-VISUAIS",
    containerTag: CULTURAL,
    basicsTag: "DADOS-BASICOS-DA-OBRA-DE-ARTES-VISUAIS",
  },
  {
    typeLabel: "other_artistic",
    xmlTag: "OUTRA-PRODUCAO-ARTISTICA-CULTURAL",
    containerTag: CULTURAL,
    basicsTag: "DADOS-BASICOS-DE-OUTRA-PRODUCAO-ARTISTICA-CULTURAL",
  },
  {
    typeLabel: "sound_design",
    xmlTag: "SONOPLASTIA",
    containerTag: CULTURAL,
    basicsTag: "DADOS-BASICOS-DE-SONOPLASTIA",
  },
  {
    typeLabel: "performing_arts",
    xmlTag: "ARTES-CENICAS",
    containerTag: CULTURAL,
    basicsTag: "DADOS-BASICOS-DE-ARTES-CENICAS",
  },
  {
    typeLabel: "visual_arts",
    xmlTag: "ARTES-VISUAIS",
    containerTag: CULTURAL,
    basicsTag: "DADOS-BASICOS-DE-ARTES-VISUAIS",
  },
  {
    typeLabel: "music",
    xmlTag: "MUSICA",
    containerTag: CULTURAL,
    basicsTag: "DADOS-BASICOS-DA-MUSICA",
  },
  {
    typeLabel: "other_work",
    xmlTag: "DEMAIS-TRABALHOS",
    basicsTag: "DADOS-BASICOS-DE-DEMAIS-TRABALHOS",
  },
];

export const ARTISTIC_SPECS_BY_XML_TAG: Readonly<Record<string, ArtisticTypeSpec>> =
  Object.fromEntries(ARTISTIC_TYPE_SPECS.map((spec) => [spec.xmlTag, spec]));

export function artisticDetailTag(basicsTag: string): string {
  return basicsTag.replace("DADOS-BASICOS", "DETALHAMENTO");
}
