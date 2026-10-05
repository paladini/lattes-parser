# @paladini/lattes-parser

<p align="center">
  <b>Toolkit para parsear e editar o XML do Currículo Lattes de maneira programática, permitindo fazer edições no seu Lattes via CLI ou Agentes de IA automatizados.</b>
</p>

<p align="center">
  <a href="https://github.com/paladini/lattes-parser/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/paladini/lattes-parser/actions/workflows/ci.yml/badge.svg"></a>
  <a href="https://www.npmjs.com/package/@paladini/lattes-parser"><img alt="npm" src="https://img.shields.io/npm/v/@paladini/lattes-parser"></a>
  <a href="LICENSE"><img alt="license" src="https://img.shields.io/badge/license-MIT-green"></a>
</p>

Projeto independente, não afiliado ao CNPq.

[English README](./README.en.md) · [Documentação](https://paladini.github.io/lattes-parser/)

## Fluxo

1. Exporte o XML na Plataforma Lattes.
2. Parse e edição programática: CLI (`parse`, `get`, `set`), TypeScript ou agente de IA com `applyCurriculumPatches` e allowlist. Serialize com round-trip (campos tipados + `unmapped`).
3. Na Plataforma, **Importar XML**, revise e salve.

A biblioteca não faz login no CNPq. Ela só lê e grava arquivos locais.

## Instalação

```bash
npm install @paladini/lattes-parser
```

## CLI

```bash
lattes-parser init
lattes-parser parse curriculo.xml
lattes-parser set curriculo.xml identification.summary "Novo resumo"
```

Depois, importe `curriculo.xml` na Plataforma (Importar XML).

## TypeScript

```ts
import { readFileSync } from "node:fs";
import { readCurriculum, writeCurriculum, setCurriculumValue } from "@paladini/lattes-parser";

const cv = await readCurriculum(readFileSync("./curriculo.xml"));
setCurriculumValue(cv, "identification.summary", "Novo resumo");
await writeCurriculum(cv, "./curriculo.xml");
```

## Agentes de IA

Contrato recomendado: `readCurriculum` → patches com **allowlist** → `writeCurriculum` → re-parse para validar → você importa o XML na Plataforma. Detalhes em [docs/integracao-ia.md](./docs/integracao-ia.md).

## Recursos

- Parse para `Curriculum` (tipado + `unmapped`)
- Serialize com round-trip no XML exportado
- CLI `lattes-parser`
- `applyCurriculumPatches` com allowlist
- Backups em `.lattes-backup/` antes de sobrescrever (opcional)
- Cliente Extrator opcional (instituições)

## Documentação

| Doc | Conteúdo |
| --- | --- |
| [Ciclo de trabalho](./docs/ciclo-de-trabalho.md) | Exportar, editar, importar |
| [Importar XML](./docs/importacao-lattes.md) | Na Plataforma Lattes |
| [Agentes de IA](./docs/integracao-ia.md) | Patches e allowlist |
| [CLI](./docs/cli.md) | Comandos |
| [Backups](./docs/backups.md) | Restore |
| [Limitações](./docs/limitacoes.md) | Escopo |

## Licença

MIT. © Fernando Paladini
