---
title: Agentes de IA
description: Edição programática com applyCurriculumPatches e allowlist para agentes de IA automatizados.
---

# Agentes de IA

Use esta API quando um agente de IA (ou outro processo automatizado) for aplicar várias alterações no currículo. A **allowlist** limita quais paths podem ser modificados.

A biblioteca não envia o XML ao CNPq. Depois de gravar o arquivo, você usa **Importar XML** na Plataforma.

## Exemplo

```ts
import {
  readCurriculum,
  writeCurriculum,
  applyCurriculumPatches,
} from "@paladini/lattes-toolkit";
import { readFileSync } from "node:fs";

const cv = await readCurriculum(readFileSync("./curriculo.xml"));

applyCurriculumPatches(
  cv,
  [
    { path: "identification.summary", value: "Novo resumo." },
  ],
  { allowlist: ["identification.summary"] },
);

await writeCurriculum(cv, "./curriculo.xml");
```

## Fluxo sugerido

1. Ler o XML (`readCurriculum`).
2. Aplicar patches com allowlist explícita.
3. Gravar (`writeCurriculum`).
4. Parse de novo no arquivo gerado para conferir.
5. Importar o XML na Plataforma Lattes.

Paths: notação com ponto e colchetes, por exemplo `identification.summary` ou `technicalProduction[0].title` quando o campo existir no modelo.

Fluxo recomendado com validação:

1. `readCurriculum`
2. `applyCurriculumPatches` com allowlist (ou `lattes-toolkit patch arquivo.json`)
3. `writeCurriculum` com `{ validate: true }` se `xmllint` estiver disponível
4. Re-parse do arquivo gerado
5. Importar XML na Plataforma (manual)

Schema e campos: [schema-xsd.md](./schema-xsd.md), [cobertura-campos.md](./cobertura-campos.md).
