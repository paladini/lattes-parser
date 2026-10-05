# AGENTS.md

Guidance for humans and coding agents working in this repository.

## Product intent

**Offline parser first.** Users export XML (or receive ZIP from Extrator). This library converts that file into typed JavaScript objects. Do not add public web download, CAPTCHA handling, or Lattes login automation.

## Layout

- `src/parse/` — XML mapping; keep best-effort, preserve unknown nodes in `unmapped`
- `src/io/` — encoding detection, ZIP extraction
- `src/extrator/` — optional SOAP; requires peer dependency `soap`
- `test/fixtures/` — **synthetic XML only**

## Conventions

- Public exports and types: **English**
- User-facing README: **Portuguese** (`README.md`); English mirror in `README.en.md`
- Run `npm test` and `npm run build` before finishing parser changes

## Out of scope (do not implement without explicit maintainer decision)

- Scraping buscatextual / HTML Lattes pages
- CPF → Lattes ID lookup
- XSD validation of full CNPq schema
