# Integração com IA (v1 — contrato)

Este repositório **não** inclui um agente LLM. A v1 define tipos, fluxo e documentação para **skills externas** (Cursor, Codex, etc.) editarem currículos com segurança.

## Fluxo recomendado

1. Ler XML: `readCurriculum` / `parseCurriculum`.
2. Backup implícito: `writeCurriculum(cv, path)` ou `backupBeforeWrite` explícito.
3. Aplicar mudanças: `applyCurriculumPatches(cv, patches, { allowlist })`.
4. Validar: `serializeCurriculum` + `parseCurriculum` no resultado.
5. Entregar diff legível ao usuário (fora desta lib).
6. Usuário **importa manualmente** na Plataforma — nunca upload automático.

## Patches

```ts
import {
  applyCurriculumPatches,
  type CurriculumPatch,
} from "@paladini/lattes-parser";

const patches: CurriculumPatch[] = [
  { path: "identification.summary", value: "Texto revisado pela IA." },
];

applyCurriculumPatches(cv, patches, {
  allowlist: ["identification.summary", "identification.otherRelevantInfo"],
});
```

Paths usam notação **dot/bracket** (`journalArticles[0].title` quando o campo existir no modelo tipado).

## Allowlist

Skills devem restringir paths editáveis à lista acordada com o usuário. Patches fora da allowlist lançam erro.

## AGENTS.md

Instruções para agentes de código neste repo: [../AGENTS.md](../AGENTS.md).

## Futuro

- DSL de patch mais rica
- Validação DTD opcional
- Exemplos de skill em repositório separado
