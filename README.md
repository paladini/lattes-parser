# lattes-toolkit

<p align="center">
  <a href="https://github.com/paladini/lattes-toolkit/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/paladini/lattes-toolkit/actions/workflows/ci.yml/badge.svg"></a>
  <a href="https://www.npmjs.com/package/@paladini/lattes-toolkit"><img alt="npm" src="https://img.shields.io/npm/v/@paladini/lattes-toolkit"></a>
  <a href="LICENSE"><img alt="licença MIT" src="https://img.shields.io/badge/license-MIT-green"></a>
  <a href="https://nodejs.org/"><img alt="Node.js 18 ou superior" src="https://img.shields.io/badge/node-%3E%3D18-339933"></a>
</p>

<p align="center">
  <b>Toolkit para editar o Currículo Lattes: lê e grava campos no XML, por código, CLI ou agente de IA.</b>
</p>

<p align="center">
  Projeto independente para o formato XML da Plataforma Lattes. Não afiliado ao CNPq.<br>
  <a href="./README.en.md">English</a>
  ·
  <a href="https://paladini.github.io/lattes-toolkit/">Documentação</a>
  ·
  <a href="./CONTRIBUTING.md">Contribuir</a>
</p>

O uso passa por exportação e importação na Plataforma Lattes. Você exporta o XML, o lattes-toolkit lê os campos, altera o que você indicar e grava o arquivo. A importação do XML, com login, é feita por você na Plataforma Lattes.

Identificação, formação, atuação, produção bibliográfica e técnica, dados complementares, prêmios e orientações entram no modelo tipado e saem no XML no formato da Plataforma Lattes (XSD de 12/09/2022). O que ainda não tem campo tipado permanece no arquivo. Cada gravação por cima de um XML existente deixa uma cópia em `.lattes-backup/`.

## Instalação

Node.js 18 ou superior.

```bash
npm install @paladini/lattes-toolkit
```

```bash
npx lattes-toolkit parse curriculo.xml
```

O pacote publicado antes como `@paladini/lattes-parser` agora se chama `@paladini/lattes-toolkit`.

## Uso

Exporte o XML na Plataforma Lattes e salve como `curriculo.xml`.

```bash
lattes-toolkit parse curriculo.xml
lattes-toolkit set curriculo.xml identification.summary "Novo resumo"
```

`set` grava no mesmo arquivo e cria o backup. Importe o arquivo na Plataforma Lattes, revise e salve.

| Comando | Efeito |
| --- | --- |
| `parse` | Resumo JSON do arquivo (XML ou ZIP) |
| `get` | Lê um campo (`identification.summary`, listas com `[0]`) |
| `set` | Altera um campo e grava o XML |
| `patch` | Aplica vários campos a partir de um JSON com allowlist |
| `serialize` | Converte um JSON `Curriculum` em XML |
| `validate` | Confere o XML com o XSD do repositório (`xmllint`) |
| `restore --last` | Restaura o snapshot mais recente |

Referência: [docs/cli.md](./docs/cli.md). Campos tipados: [docs/cobertura-campos.md](./docs/cobertura-campos.md).

### TypeScript

```ts
import { readFileSync } from "node:fs";
import {
  readCurriculum,
  setCurriculumValue,
  writeCurriculum,
} from "@paladini/lattes-toolkit";

const cv = await readCurriculum(readFileSync("./curriculo.xml"));
setCurriculumValue(cv, "identification.summary", "Novo resumo");
await writeCurriculum(cv, "./curriculo.xml");
```

### Agentes de IA

Limite o que o agente pode mudar:

1. `readCurriculum`
2. `applyCurriculumPatches` com allowlist
3. `writeCurriculum`
4. Ler o XML gerado e conferir os campos
5. Importar o XML na Plataforma Lattes

Exemplo em [docs/integracao-ia.md](./docs/integracao-ia.md). Instituições com Extrator SOAP usam `@paladini/lattes-toolkit/extrator`.

## Documentação

| Guia | Conteúdo |
| --- | --- |
| [Ciclo de trabalho](./docs/ciclo-de-trabalho.md) | Exportar, editar e importar |
| [CLI](./docs/cli.md) | Comandos |
| [API TypeScript](./docs/api-typescript.md) | Funções públicas |
| [Cobertura de campos](./docs/cobertura-campos.md) | O que é lido e gravado |
| [Schema XSD](./docs/schema-xsd.md) | Schema versionado e validação |
| [Agentes de IA](./docs/integracao-ia.md) | Patches e allowlist |
| [Backups](./docs/backups.md) | Snapshots e restore |
| [Limitações](./docs/limitacoes.md) | Escopo e conformidade |

Site: <https://paladini.github.io/lattes-toolkit/>

## Contribuir

Issues e pull requests são bem-vindos, em português ou inglês. Fixtures de teste são XML sintético ou anonimizado. Veja [CONTRIBUTING.md](./CONTRIBUTING.md) e o [código de conduta](./CODE_OF_CONDUCT.md).

## Licença

[MIT](./LICENSE) © Fernando Paladini
