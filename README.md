# @paladini/lattes-parser

<p align="center">
  <b>Automatize a manutenção do seu Currículo Lattes: XML vira TypeScript, CLI e patches prontos para skill de IA.</b>
</p>

<p align="center">
  <a href="https://github.com/paladini/lattes-parser/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/paladini/lattes-parser/actions/workflows/ci.yml/badge.svg"></a>
  <a href="https://www.npmjs.com/package/@paladini/lattes-parser"><img alt="npm" src="https://img.shields.io/npm/v/@paladini/lattes-parser"></a>
  <a href="LICENSE"><img alt="license" src="https://img.shields.io/badge/license-MIT-green"></a>
</p>

Projeto independente, não afiliado ao CNPq. Uso conforme termo da Plataforma Lattes e LGPD.

[English README](./README.en.md) · **[Documentação](https://paladini.github.io/lattes-parser/)**

## Por que existe

Formulário web não escala. Você exporta o XML uma vez e passa a tratar o currículo como **código**: scripts, diff, CI interno, agente de IA com allowlist. Centenas de campos deixam de ser clique a clique.

**Seu fluxo:**

1. Exportar XML na Plataforma (login).
2. **Automatizar aqui:** parse, `set`, patches, skill de IA, backup em `.lattes-backup/`.
3. **Importar XML** na Plataforma, revisar e confirmar. Um upload substitui horas de formulário.

A biblioteca **não** faz login no CNPq por você. Ela faz o trabalho pesado no arquivo; você fecha o ciclo na UI oficial (Importar XML).

## Instalação

```bash
npm install @paladini/lattes-parser
```

## CLI em 30 segundos

```bash
lattes-parser init
lattes-parser parse curriculo.xml
lattes-parser set curriculo.xml identification.summary "Resumo atualizado em lote"
# .lattes-backup/ criado automaticamente
# Depois: Plataforma Lattes → Importar XML → enviar curriculo.xml
```

## TypeScript

```ts
import { readFileSync } from "node:fs";
import {
  readCurriculum,
  writeCurriculum,
  applyCurriculumPatches,
} from "@paladini/lattes-parser";

const cv = await readCurriculum(readFileSync("./curriculo.xml"));
applyCurriculumPatches(
  cv,
  [{ path: "identification.summary", value: "Texto gerado ou revisado pelo seu pipeline." }],
  { allowlist: ["identification.summary"] },
);
await writeCurriculum(cv, "./curriculo.xml");
```

## Skill de IA (contrato pronto)

`applyCurriculumPatches` + allowlist + backup antes de gravar. Fluxo documentado para Cursor, Codex e automações similares: [docs/integracao-ia.md](./docs/integracao-ia.md).

## O que você ganha

| Recurso | Benefício |
| --- | --- |
| `Curriculum` tipado + `unmapped` | Round-trip no XML sem perder tags raras |
| CLI `get` / `set` / `parse` | Edição em lote sem abrir o site |
| `writeCurriculum` | Serialize + backup automático |
| Extrator (opcional) | Pipelines institucionais com SOAP |

Mapa de campos: [docs/cobertura-campos.md](./docs/cobertura-campos.md).

## Documentação

| Doc | Conteúdo |
| --- | --- |
| [Ciclo de trabalho](./docs/ciclo-de-trabalho.md) | Export, automação local, Importar XML |
| [Importar XML](./docs/importacao-lattes.md) | Passo a passo na UI (DTD, Enviar) |
| [Integração IA](./docs/integracao-ia.md) | Patches seguros para agentes |
| [CLI](./docs/cli.md) | Referência de comandos |
| [Backups](./docs/backups.md) | `.lattes-backup` e restore |

## Licença

MIT. © Fernando Paladini
