# Changelog

All notable changes to this project will be documented in this file.

## 2.10.0 - 2026-10-06

### Added

- Optional `lattes.config.json` with `backupDir` and `retention`. The file is found by walking up from the XML directory. Defaults stay `.lattes-backup/` and 20 snapshots. Retention deletes only snapshots of the file being written. `LATTES_TOOLKIT_BACKUP_DIR` and an explicit `backupDir` option still override the config.

## 2.9.0 - 2026-10-06

### Added

- Completed advisories are read from `OUTRA-PRODUCAO` and from the legacy `DADOS-COMPLEMENTARES` location, then written under `OUTRA-PRODUCAO` without removing artistic production. In-progress advisories now include specialization, graduation, and scientific initiation, and `Advisory` carries the production envelope. Hand-built `Advisory` objects need the envelope fields (`basics`, `detail`, `keywords`, `knowledgeAreas`, `activitySectors`).

## 2.8.0 - 2026-10-06

### Added

- Typed artistic and cultural production as `artisticProduction` (`ArtisticItem`), including `DEMAIS-TRABALHOS`. Completed advisories and unknown siblings under `OUTRA-PRODUCAO` stay on the document tree. Hand-built `Curriculum` objects need `artisticProduction: []`.

## 2.7.0 - 2026-10-06

### Added

- Bibliographic production now types accepted articles (`acceptedArticles`), newspaper and magazine texts (`newspaperTexts`), and musical scores, prefaces, and translations on `other` with `xmlTag`. Items share the production envelope. Title attributes follow the XSD tag (`TITULO-DO-TEXTO` for newspaper texts, `TITULO` for translations). Hand-built `BibliographicProduction` objects need the new arrays, and each `BibliographicItem` needs the envelope fields.

## 2.6.0 - 2026-10-06

### Added

- Typed maternity and other leaves as `identification.licenses` (`LICENCAS` / `LICENCA`). CPF, birth date, documents, and family names stay on the document tree. Hand-built `CurriculumIdentification` objects need `licenses: []`.

## 2.5.0 - 2026-10-06

### Added

- Event participation now includes fairs, exhibitions, and olympiads (`PARTICIPACAO-EM-FEIRA`, `PARTICIPACAO-EM-EXPOSICAO`, `PARTICIPACAO-EM-OLIMPIADA`), with the same basics, detail, and `PARTICIPANTE-DE-EVENTOS-CONGRESSOS` shape as other events.

## 2.4.0 - 2026-10-06

### Added

- Typed technical production for registered and protected cultivars (`DENOMINACAO`), industrial design, trademarks, integrated-circuit topography, maps, scale models, and research reports. Unknown technical tags stay on the document tree.

## 2.3.0 - 2026-10-06

### Added

- Optional DTD check, off by default: `lattes-toolkit validate <file> --dtd <file.dtd>` and `validateCurriculumXml(xml, { dtd: true, dtdPath })`. The package does not ship or download a DTD. A missing file or missing `xmllint` returns `skipped`. The default command still validates the XSD only.

## 2.2.0 - 2026-10-06

### Added

- Typed parse and sync for research projects under professional activity (`ProjectParticipation`, `ResearchProject`, team members and funders) via `ATIVIDADES-DE-PARTICIPACAO-EM-PROJETO` / `PARTICIPACAO-EM-PROJETO` / `PROJETO-DE-PESQUISA`.

## 2.1.0 - 2026-10-06

### Added

- Typed parse and sync for thesis and judging boards under `DADOS-COMPLEMENTARES` (`complementary.boards`, `BoardParticipation`), including participants and production envelope fields (keywords, knowledge areas, and related metadata).

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
