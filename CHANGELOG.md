# Changelog

All notable changes to this project will be documented in this file.

## 1.0.0 — 2026-03-23

### Added

- `@paladini/lattes-parser`: offline parse of official Currículo Lattes XML and Extrator ZIP files
- Typed `Curriculum` model with `unmapped` nodes for forward compatibility
- `LattesId` helpers (16-digit ID and canonical URL; rejects CPF-like input)
- ISO-8859-1 / entity handling via `readCurriculum`
- Optional `@paladini/lattes-parser/extrator` SOAP client (`getCurriculum`, `getCurriculumCompacted`, `getUpdatedAt`)
- Documentation: limitations, how to obtain XML, data model, community files
