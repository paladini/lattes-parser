# @paladini/lattes-parser

**Automate Lattes CV maintenance:** exported XML becomes TypeScript, CLI, and AI-ready patches. Finish with **Import XML** on the platform (you stay logged in; the library does not).

Independent project, not affiliated with CNPq.

[Portuguese README](./README.md) · **[Docs](https://paladini.github.io/lattes-parser/)**

## Flow

1. Export XML from Plataforma Lattes.
2. Parse, batch-edit, or run an AI skill with `applyCurriculumPatches` (allowlist + backups).
3. **Import XML** on the platform, review, save.

## Install

```bash
npm install @paladini/lattes-parser
```

## Example

```ts
import { readFileSync } from "node:fs";
import { readCurriculum, writeCurriculum, applyCurriculumPatches } from "@paladini/lattes-parser";

const cv = await readCurriculum(readFileSync("./curriculo.xml"));
applyCurriculumPatches(cv, [{ path: "identification.summary", value: "Updated in batch." }], {
  allowlist: ["identification.summary"],
});
await writeCurriculum(cv, "./curriculo.xml");
```

[AI integration contract](./docs/integracao-ia.md) · [Import XML guide](./docs/importacao-lattes.md)

## License

MIT
