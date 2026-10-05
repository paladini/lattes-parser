export { LattesId } from "./lattes-id.js";
export { parseCurriculum } from "./parse/parse-curriculum.js";
export { readCurriculum } from "./io/read-curriculum.js";
export { writeCurriculum } from "./io/write-curriculum.js";
export type { WriteCurriculumOptions } from "./io/write-curriculum.js";
export { serializeCurriculum } from "./serialize/serialize-curriculum.js";
export { syncCvToDocument } from "./serialize/sync-document.js";
export {
  backupBeforeWrite,
  listBackups,
  restoreBackup,
  restoreLatestBackup,
  DEFAULT_BACKUP_DIR,
  DEFAULT_RETENTION,
} from "./backup/store.js";
export type { BackupManifest, BackupRef } from "./backup/store.js";
export { getCurriculumValue, setCurriculumValue } from "./patch/paths.js";
export {
  applyCurriculumPatches,
} from "./patch/apply-patches.js";
export type { CurriculumPatch, ApplyPatchesOptions } from "./patch/apply-patches.js";
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
  XmlDocument,
} from "./types.js";
