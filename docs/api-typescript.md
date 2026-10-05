---
title: API TypeScript
description: readCurriculum, writeCurriculum, serializeCurriculum e applyCurriculumPatches para editar XML Lattes em Node.js.
---

# API TypeScript

```bash
npm install @paladini/lattes-toolkit
```

## Ler e gravar

```ts
import { readFileSync } from "node:fs";
import {
  readCurriculum,
  writeCurriculum,
  setCurriculumValue,
  LattesId,
} from "@paladini/lattes-toolkit";

const cv = await readCurriculum(readFileSync("./curriculo.xml"));
setCurriculumValue(cv, "identification.summary", "Resumo atualizado.");
await writeCurriculum(cv, "./curriculo.xml"); // backup automático

console.log(LattesId.canonicalUrl(cv));
```

## Serialize sem gravar

```ts
import { parseCurriculum, serializeCurriculum } from "@paladini/lattes-toolkit";

const cv = parseCurriculum(xmlString);
const updatedXml = serializeCurriculum(cv);
```

`Curriculum.document` é preenchido no parse e necessário para round-trip.

## Patches (CLI e agentes de IA)

```ts
import { applyCurriculumPatches } from "@paladini/lattes-toolkit";

applyCurriculumPatches(
  cv,
  [{ path: "identification.summary", value: "Texto revisado." }],
  { allowlist: ["identification.summary"] },
);
```

Detalhes: [Agentes de IA](./integracao-ia.md).

## Extrator (instituições)

```ts
import { ExtratorClient } from "@paladini/lattes-toolkit/extrator";
```

Ver [Extrator institucional](./extrator.md).
