# AGENTS.md

Guidance for humans and coding agents working in this repository.

## Product intent

**lattes-toolkit** (`@paladini/lattes-toolkit`, CLI `lattes-toolkit`): parse and edit exported XML programmatically (CLI, TypeScript, automated AI agents with allowlist). User imports XML on the platform UI. Files only; no CNPq login automation.

- Always create **backup** before overwriting curriculum XML (`writeCurriculum`, CLI `set`, CLI `serialize -o` when target exists).
- **Never** implement login, CAPTCHA, scraping, or automated upload to CNPq without explicit maintainer decision.
- Wording: **independent project** — not “official CNPq toolkit”. Use “platform XML format”.

## Layout

- `src/parse/` — XML → `Curriculum`; preserve unknown nodes in `unmapped`
- `src/serialize/` — `Curriculum` → XML via `document` tree + `syncCvToDocument`
- `src/io/` — read/write, encoding, ZIP
- `src/backup/` — `.lattes-backup/` snapshots
- `src/patch/` — path get/set, `applyCurriculumPatches` (optional allowlist)
- `src/cli.ts` — workspace-oriented commands
- `src/extrator/` — optional SOAP; peer `soap`
- `test/fixtures/` — synthetic XML + `curriculum-real-anonymized.xml` (no PII)
- `DEFINITIONS/` — XSD versionado; exports pessoais gitignored

## Conventions

- Public API and types: **English**
- User-facing README: **Portuguese** (`README.md`); English mirror `README.en.md`
- Parser/serialize changes: add or extend **round-trip** tests with synthetic fixtures
- Run `npm test` and `npm run build` before finishing

## Programmatic edits

When applying batch edits:

1. `readCurriculum` or parse existing file
2. `backupBeforeWrite` / `writeCurriculum` (backup on)
3. Prefer `applyCurriculumPatches` with an **allowlist**
4. Re-parse serialized output to validate
5. User performs **Import XML** on the platform — never upload from this repo

See [docs/integracao-ia.md](./docs/integracao-ia.md).

## Out of scope

- Scraping buscatextual / HTML Lattes pages
- CPF → Lattes ID lookup
- Full XSD validation (optional future work)
