export { LattesId } from "./lattes-id.js";
export { parseCurriculum } from "./parse/parse-curriculum.js";
export { readCurriculum } from "./io/read-curriculum.js";
export { writeCurriculum } from "./io/write-curriculum.js";
export type { WriteCurriculumOptions } from "./io/write-curriculum.js";
export { serializeCurriculum } from "./serialize/serialize-curriculum.js";
export type { SerializeCurriculumOptions } from "./serialize/serialize-curriculum.js";
export {
  syncCvToDocument,
  sectionsFromPatchPaths,
} from "./serialize/sync-document.js";
export type {
  CurriculumSectionId,
  SyncDocumentOptions,
} from "./serialize/sync-document.js";
export { validateCurriculumXml } from "./validate/validate-curriculum.js";
export type { ValidateCurriculumResult } from "./validate/validate-curriculum.js";
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
  KnowledgeAreaEntry,
  ProductionAdditionalInfo,
  ProductionEnvelope,
  Advisory,
  AdvisorySection,
  AcademicDegree,
  ProfessionalActivity,
  ResearchArea,
  LanguageEntry,
  ProfessionalAddress,
  AddressContact,
  Award,
  Author,
  ComplementaryData,
  ComplementaryTraining,
  CurriculumMetadata,
  EmploymentLink,
  EventParticipant,
  EventParticipation,
  AdditionalCourse,
  AdditionalInstitution,
  LattesDate,
  LattesDateTime,
  UnmappedNodes,
  XmlDocument,
} from "./types.js";
