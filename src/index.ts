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
  requireSectionsFromPatchPaths,
} from "./serialize/sync-document.js";
export type {
  CurriculumSectionId,
  SyncDocumentOptions,
} from "./serialize/sync-document.js";
export { validateCurriculumXml } from "./validate/validate-curriculum.js";
export type {
  ValidateCurriculumOptions,
  ValidateCurriculumResult,
} from "./validate/validate-curriculum.js";
export {
  backupBeforeWrite,
  listBackups,
  resolveBackupSettings,
  restoreBackup,
  restoreLatestBackup,
  DEFAULT_BACKUP_DIR,
  DEFAULT_RETENTION,
} from "./backup/store.js";
export type { BackupManifest, BackupRef } from "./backup/store.js";
export { loadLattesConfig } from "./backup/config.js";
export type { LattesConfig } from "./backup/config.js";
export { diffCurricula, formatCurriculumDiff } from "./diff/diff-curriculum.js";
export type { CurriculumDiffEntry } from "./diff/diff-curriculum.js";
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
  ArtisticItem,
  TechnicalItem,
  KnowledgeAreaEntry,
  ProductionAdditionalInfo,
  ProductionEnvelope,
  Advisory,
  AdvisorySection,
  AcademicDegree,
  ProfessionalActivity,
  ProjectParticipation,
  ResearchProject,
  ResearchProjectFunder,
  ResearchProjectTeamMember,
  ResearchArea,
  LanguageEntry,
  License,
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
  BoardParticipant,
  BoardParticipation,
  AdditionalCourse,
  AdditionalInstitution,
  LattesDate,
  LattesDateTime,
  UnmappedNodes,
  XmlDocument,
} from "./types.js";
