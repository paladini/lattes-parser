# lattes-toolkit

<p align="center">
  <a href="https://github.com/paladini/lattes-toolkit/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/paladini/lattes-toolkit/actions/workflows/ci.yml/badge.svg"></a>
  <a href="https://www.npmjs.com/package/@paladini/lattes-toolkit"><img alt="npm" src="https://img.shields.io/npm/v/@paladini/lattes-toolkit"></a>
  <a href="LICENSE"><img alt="licença MIT" src="https://img.shields.io/badge/license-MIT-green"></a>
  <a href="https://nodejs.org/"><img alt="Node.js 18 ou superior" src="https://img.shields.io/badge/node-%3E%3D18-339933"></a>
</p>

<p align="center">
  <b>Toolkit para editar o XML exportado do Currículo Lattes de maneira programática, via CLI ou agentes de IA.</b>
</p>

<p align="center">
  Projeto independente para o formato XML da Plataforma Lattes. Não afiliado ao CNPq.<br>
  <a href="./README.en.md">English</a>
  ·
  <a href="https://paladini.github.io/lattes-toolkit/">Documentação</a>
  ·
  <a href="./CONTRIBUTING.md">Contribuir</a>
</p>

O formulário da Plataforma não foi feito para alteração em lote. O
lattes-toolkit lê o XML que você exportou, altera os campos que você
indicar e grava um arquivo pronto para **Importar XML**. Tags que o
modelo tipado ainda não cobre permanecem no arquivo.

## Instalação

Node.js 18 ou superior.

```bash
npm install @paladini/lattes-toolkit
```

O comando `lattes-toolkit` entra no `node_modules/.bin` do projeto.
Sem instalação global:

```bash
npx lattes-toolkit parse curriculo.xml
```

O pacote publicado antes como `@paladini/lattes-parser` passa a se
chamar `@paladini/lattes-toolkit`. O comando da CLI é `lattes-toolkit`.

## Início rápido

Exporte o XML na Plataforma Lattes e salve como `curriculo.xml`.

### Linha de comando

```bash
lattes-toolkit parse curriculo.xml
lattes-toolkit set curriculo.xml identification.summary "Novo resumo"
```

`set` grava o XML no mesmo arquivo. Se o arquivo já existe, o toolkit
copia o original para `.lattes-backup/` antes de sobrescrever.

Na Plataforma, use **Importar XML**, revise o resultado e salve.

| Comando | Efeito |
| --- | --- |
| `parse` | Mostra um resumo JSON do arquivo (XML ou ZIP) |
| `get` | Lê um campo (`identification.summary`, listas com `[0]`) |
| `set` | Altera um campo, serializa o XML e cria backup |
| `serialize` | Converte um JSON `Curriculum` em XML |
| `validate` | Valida o XML contra o XSD em `DEFINITIONS/` (`xmllint`) |
| `patch` | Aplica patches em lote a partir de JSON com allowlist |
| `restore --last` | Restaura o snapshot mais recente |

A referência completa está em [docs/cli.md](./docs/cli.md).

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

`writeCurriculum` faz o backup e serializa de volta para o XML da
Plataforma. Nós ainda não mapeados ficam em `unmapped` e voltam no
arquivo.

### Agentes de IA

Quando um agente for aplicar várias alterações, limite os caminhos:

1. Leia o arquivo com `readCurriculum`.
2. Aplique `applyCurriculumPatches` com uma allowlist.
3. Grave com `writeCurriculum`.
4. Leia o XML gerado de novo e confira os campos.
5. Importe o arquivo na Plataforma.

O exemplo está em [docs/integracao-ia.md](./docs/integracao-ia.md).

## Recursos

- Parse do XML exportado (`CURRICULO-VITAE`) para o tipo `Curriculum`
- Serialize alinhado ao XSD 12/09/2022: campos tipados e nós desconhecidos (ver [cobertura de campos](./docs/cobertura-campos.md))
- CLI para script e uso local (`validate`, `patch`, etc.)
- Edição por caminho, um campo ou vários patches
- Backup em `.lattes-backup/` antes de sobrescrever
- Leitura de XML ou ZIP, com detecção de encoding
- Cliente SOAP opcional para instituições com Extrator, em
  `@paladini/lattes-toolkit/extrator`

## Fluxo

1. Exporte o XML na Plataforma Lattes.
2. Edite o arquivo neste computador, pela CLI, por TypeScript ou por um
   agente com allowlist.
3. Importe o XML na Plataforma, revise e salve.

Login e o envio do arquivo acontecem na Plataforma, feitos por você. O
toolkit lê e grava arquivos locais.

## Documentação

| Guia | Conteúdo |
| --- | --- |
| [Ciclo de trabalho](./docs/ciclo-de-trabalho.md) | Exportar, editar e importar |
| [CLI](./docs/cli.md) | Comandos |
| [API TypeScript](./docs/api-typescript.md) | Funções públicas |
| [Agentes de IA](./docs/integracao-ia.md) | Patches e allowlist |
| [Backups](./docs/backups.md) | Snapshots e restore |
| [Limitações](./docs/limitacoes.md) | Escopo e conformidade |

Site: <https://paladini.github.io/lattes-toolkit/>

## Contribuir

Issues e pull requests são bem-vindos, em português ou inglês. Fixtures
de teste são XML sintético. Veja [CONTRIBUTING.md](./CONTRIBUTING.md) e
o [código de conduta](./CODE_OF_CONDUCT.md).

## Licença

[MIT](./LICENSE) © Fernando Paladini
