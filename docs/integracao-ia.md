---
title: Integração com IA
description: Skills e agentes editam o Currículo Lattes via patches tipados, backup e allowlist. Você importa o XML na Plataforma.
---

# Integração com IA

Use este pacote como **backend de arquivo** para skills (Cursor, Codex, scripts internos). O agente não acessa o CNPq; ele produz um **XML revisável** que você envia em **Importar XML**.

## Fluxo recomendado para skills

1. `readCurriculum(path)` ou parse do XML exportado.
2. `applyCurriculumPatches(cv, patches, { allowlist })` com lista fechada de paths permitidos.
3. `writeCurriculum(cv, path)` (backup em `.lattes-backup/` por padrão).
4. Re-parse do XML gerado para checar integridade.
5. Mostrar diff ao usuário (fora desta lib).
6. Usuário: **Importar XML** na Plataforma Lattes.

## Exemplo

```ts
import {
  readCurriculum,
  writeCurriculum,
  applyCurriculumPatches,
  type CurriculumPatch,
} from "@paladini/lattes-parser";
import { readFileSync } from "node:fs";

const cv = await readCurriculum(readFileSync("./curriculo.xml"));

const patches: CurriculumPatch[] = [
  { path: "identification.summary", value: "Resumo revisado pela skill." },
];

applyCurriculumPatches(cv, patches, {
  allowlist: ["identification.summary", "identification.otherRelevantInfo"],
});

await writeCurriculum(cv, "./curriculo.xml");
```

## Allowlist

Obrigatória em produção com IA: só paths explícitos. Patch fora da lista lança erro.

## Paths

Notação dot/bracket: `identification.summary`, `bibliographicProduction.journalArticles[0].title` (quando tipado).

## AGENTS.md

Instruções para agentes que editam este repositório: [AGENTS.md](https://github.com/paladini/lattes-parser/blob/main/AGENTS.md).
