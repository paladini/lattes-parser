export { LattesId } from "./lattes-id.js";
export { parseCurriculum } from "./parse/parse-curriculum.js";
export { readCurriculum } from "./io/read-curriculum.js";
export {
  LattesError,
  InvalidLattesIdError,
  InvalidCurriculumXmlError,
  InvalidCurriculumArchiveError,
  ExtratorError,
} from "./errors.js";
export type {
  Curriculum,
  CurriculumIdentification,
  BibliographicProduction,
  BibliographicItem,
  TechnicalItem,
  Advisory,
  AdvisorySection,
  AcademicDegree,
  ProfessionalActivity,
  ResearchArea,
  LanguageEntry,
  ProfessionalAddress,
  Award,
  Author,
  LattesDate,
  LattesDateTime,
  UnmappedNodes,
} from "./types.js";
