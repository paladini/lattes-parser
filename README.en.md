# @paladini/lattes-parser

**Independent toolkit** to edit *Plataforma Lattes* curriculum XML locally (CLI/TypeScript), with automatic backups. **Export and import on the platform stay manual.** Not affiliated with CNPq.

[Portuguese README](./README.md)

## Workflow

1. Export XML from the Lattes platform (logged in).
2. Parse, edit, serialize with this package.
3. Re-import via **Import XML**, review, and save.

See [docs/ciclo-de-trabalho.md](./docs/ciclo-de-trabalho.md) (Portuguese) and [docs/backups.md](./docs/backups.md).

## Install

```bash
npm install @paladini/lattes-parser
```

## CLI

```bash
lattes-parser init
lattes-parser set curriculo.xml identification.summary "Updated summary"
lattes-parser restore --last
```

## TypeScript

```ts
import { readCurriculum, writeCurriculum } from "@paladini/lattes-parser";
import { readFileSync } from "node:fs";

const cv = await readCurriculum(readFileSync("./curriculo.xml"));
await writeCurriculum(cv, "./curriculo.xml");
```

## Scope

- Parses and serializes the **platform XML format** (ISO-8859-1).
- Preserves unknown tags in `unmapped` for lossless round-trip.
- Does **not** automate login, CAPTCHA, public bulk download, or upload to CNPq.

Optional institutional Extrator SOAP client: `@paladini/lattes-parser/extrator`.

## License

MIT
