# Contributing to @paladini/lattes-parser

Thanks for considering a contribution — issues, pull requests, and discussion are welcome. This project is an **independent local toolkit** for the **platform Lattes XML format**: parse, edit, serialize, with backups. Read this page before opening a PR.

## Ways to contribute

- **Report a parse gap.** Open an issue with a **synthetic** minimal snippet (never a real person's curriculum).
- **Improve mappings** in `src/parse/` and extend `syncCvToDocument` when typed fields should round-trip through serialize.
- **Round-trip tests.** Changes that affect XML I/O should include `parse → serialize → parse` coverage on synthetic fixtures.
- **Documentation.** Workflow, backups, import expectations, field coverage.
- **Fix bugs** in I/O, encoding, dates, backup/restore, or the optional Extrator client.

## Language on GitHub

Issues and PR descriptions may be **Portuguese or English**. Maintainer review comments are often in **English**.

## Project layout

```
src/
  parse/       XML → Curriculum
  serialize/   Curriculum → XML
  io/          read/write, encoding, ZIP
  backup/      .lattes-backup snapshots
  patch/       path get/set, applyCurriculumPatches
  cli.ts       lattes-parser commands
  extrator/    optional SOAP (peer: soap)
test/fixtures/ synthetic XML only
docs/          workflow, backups, import, IA contract
```

## Invariants

1. **Core stays offline.** Parse/serialize must not require network.
2. **No scraping / CAPTCHA / automated platform upload** in this repository.
3. **Fixtures are synthetic.** Do not commit real Lattes XML from third parties (LGPD).
4. **Backups before overwrite** of existing curriculum XML paths (API + CLI).
5. **Public API and types in English**; main README in Portuguese.

## Before opening a PR

```bash
npm install
npm run typecheck
npm run lint
npm test
npm run build
```

CI runs on Node 20 and 22.

## Releasing

Maintainers publish to npm — see [RELEASING.md](RELEASING.md).

## Code of conduct

[CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
