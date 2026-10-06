# Changelog

All notable changes to this project will be documented in this file.

## 2.0.0 - 2026-10-06

### Breaking

- `Curriculum` now requires `metadata` and `complementary`.
- Professional activity is written through `links` (`VINCULOS`), not a `CARGO` attribute on the parent element.
- Awards serialize as `PREMIO-TITULO`. Citation names serialize as `NOME-EM-CITACOES-BIBLIOGRAFICAS`. Authors serialize as sibling `AUTORES` elements, matching the XSD.
- Summary text is written to `RESUMO-CV` attributes (`TEXTO-RESUMO-CV-RH` and `TEXTO-RESUMO-CV-RH-EN`).

### Added

- Typed parse and sync aligned with CurriculoLattes XSD 12/09/2022 and real export layouts: technical production (including `DEMAIS-TIPOS-DE-PRODUCAO-TECNICA`), complementary training, events, additional institutions and courses, academic degree tags, languages, and addresses.
- Selective sync so complex sections that were not edited are left in place.
- `validateCurriculumXml`, CLI `lattes-toolkit validate` (optional `xmllint`), and `writeCurriculum(..., { validate: true })`.
- CLI `lattes-toolkit patch` with an allowlist.
- Versioned XSD under `DEFINITIONS/`, anonymized golden fixture, and schema docs.

XSD validation does not guarantee that Plataforma Lattes will accept the file. The import UI still documents a DTD. Real curriculum exports with personal data stay gitignored.

## 1.2.0 - 2026-10-05

### Changed

- Renamed the package from `@paladini/lattes-parser` to `@paladini/lattes-toolkit`. The CLI command is `lattes-toolkit`.
- Backup directory override prefers `LATTES_TOOLKIT_BACKUP_DIR`. `LATTES_PARSER_BACKUP_DIR` still applies when the new variable is unset.
- README in Brazilian Portuguese, with an English mirror of the same guide.

## 1.1.1 - 2026-04-05

### Changed

- README and docs site: developer and AI-first positioning; Import XML as the closing step of an automated local workflow.

## 1.1.0 - 2026-04-05

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

## 1.0.0 - 2026-03-23

### Added

- Offline parse of Plataforma Lattes curriculum XML and Extrator ZIP files
- Typed `Curriculum` model with `unmapped` nodes
- `LattesId` helpers
- Optional `@paladini/lattes-parser/extrator` SOAP client
