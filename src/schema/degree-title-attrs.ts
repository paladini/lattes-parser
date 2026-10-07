import type { DegreeTag } from "./degree-tags.js";

/** XSD attributes that carry the thesis, monograph, or conclusion work title (not the course name). */
export const DEGREE_CONCLUSION_TITLE_ATTRS = [
  "TITULO-DA-MONOGRAFIA",
  "TITULO-DA-DISSERTACAO-TESE",
  "TITULO-DO-TRABALHO-DE-CONCLUSAO-DE-CURSO",
  "TITULO-DA-RESIDENCIA-MEDICA",
  "TITULO-DO-TRABALHO",
] as const;

export type DegreeConclusionTitleAttr = (typeof DEGREE_CONCLUSION_TITLE_ATTRS)[number];

/** Primary conclusion-title attribute per formation tag (XSD). */
export const DEGREE_CONCLUSION_TITLE_ATTR: Partial<Record<DegreeTag, DegreeConclusionTitleAttr>> =
  {
    GRADUACAO: "TITULO-DO-TRABALHO-DE-CONCLUSAO-DE-CURSO",
    APERFEICOAMENTO: "TITULO-DA-MONOGRAFIA",
    ESPECIALIZACAO: "TITULO-DA-MONOGRAFIA",
    MESTRADO: "TITULO-DA-DISSERTACAO-TESE",
    "MESTRADO-PROFISSIONALIZANTE": "TITULO-DA-DISSERTACAO-TESE",
    DOUTORADO: "TITULO-DA-DISSERTACAO-TESE",
    "RESIDENCIA-MEDICA": "TITULO-DA-RESIDENCIA-MEDICA",
    "LIVRE-DOCENCIA": "TITULO-DO-TRABALHO",
    "POS-DOUTORADO": "TITULO-DO-TRABALHO",
  };

/** Formation tags that expose `NOME-CURSO` in the XSD. */
export const DEGREE_TAGS_WITH_COURSE_NAME: ReadonlySet<DegreeTag> = new Set([
  "CURSO-TECNICO-PROFISSIONALIZANTE",
  "GRADUACAO",
  "APERFEICOAMENTO",
  "ESPECIALIZACAO",
  "MESTRADO",
  "MESTRADO-PROFISSIONALIZANTE",
  "DOUTORADO",
]);

export function readDegreeConclusionTitle(
  attrs: Record<string, string | undefined>,
): string | undefined {
  for (const name of DEGREE_CONCLUSION_TITLE_ATTRS) {
    const value = attrs[name];
    if (value) {
      return value;
    }
  }
  return undefined;
}
