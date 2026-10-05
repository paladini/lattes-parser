# Changelog

All notable changes to this project will be documented in this file.

## 1.1.0 — 2026-04-05

### Added

- **Serialize** `serializeCurriculum`, `writeCurriculum` with lossless `document` + `unmapped` round-trip
- **Backup** module: `.lattes-backup/`, `backupBeforeWrite`, `listBackups`, `restoreBackup`, `restoreLatestBackup`
- **CLI** `lattes-parser`: init, parse, get, set, serialize, backup list, restore
- **Patch** helpers: `getCurriculumValue`, `setCurriculumValue`, `applyCurriculumPatches` with allowlist
- `LattesId.canonicalUrl` accepts `{ id }` or `Curriculum`
- Docs: ciclo de trabalho, backups, importação, integração IA, cobertura de campos
- Tests: round-trip, backup, patch paths

### Changed

- Product positioning: local XML toolkit (export/import on platform remain manual)
- Terminology: independent project; avoid implying CNPq endorsement

## 1.0.0 — 2026-03-23

### Added

- Offline parse of Plataforma Lattes curriculum XML and Extrator ZIP files
- Typed `Curriculum` model with `unmapped` nodes
- `LattesId` helpers
- Optional `@paladini/lattes-parser/extrator` SOAP client
