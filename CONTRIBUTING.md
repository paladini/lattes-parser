# Contributing to @paladini/lattes-parser

Thanks for considering a contribution — issues, pull requests, and discussion are welcome. This project is focused: **parse official Lattes XML offline**. Read this page before opening a PR.

## Ways to contribute

- **Report a parse gap.** Real XML exports sometimes expose tags we do not map yet. Open an issue with a **synthetic** minimal snippet (never a real person's curriculum).
- **Improve mappings.** New sections in `src/parse/` with tests in `test/fixtures/`.
- **Documentation.** Clarify offline workflow, limitations, or Extrator setup.
- **Fix bugs** in I/O, encoding, dates, or the optional Extrator client.

Open an issue before a large mapping change if you are unsure which XML branches to support in v1.

## Language on GitHub

You may open issues and PR descriptions in **Portuguese or English**. Maintainer review comments on GitHub are in **English** so the record stays accessible to all contributors.

## Project layout

```
src/
  parse/          XML → Curriculum mappers
  io/             encoding, ZIP, readCurriculum
  extrator/       optional SOAP client (peer: soap)
test/
  fixtures/       synthetic XML only — no real CVs
docs/             limitations, model, how to obtain XML
```

## Invariants

1. **Core stays offline.** `parseCurriculum` / `readCurriculum` must not require network.
2. **No scraping / CAPTCHA / public download helpers** in this repository.
3. **Fixtures are synthetic.** Do not commit real Lattes XML from third parties (LGPD).
4. **Public API and types in English**; main README in Portuguese.

## Before opening a PR

```bash
npm install
npm run typecheck
npm run lint
npm test
npm run build
```

CI runs the same checks on Node 20 and 22.

## Releasing

Maintainers publish to npm — see [RELEASING.md](RELEASING.md).

## Code of conduct

Participation is governed by our [Code of Conduct](CODE_OF_CONDUCT.md).
