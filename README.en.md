# lattes-toolkit

<p align="center">
  <a href="https://github.com/paladini/lattes-toolkit/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/paladini/lattes-toolkit/actions/workflows/ci.yml/badge.svg"></a>
  <a href="https://www.npmjs.com/package/@paladini/lattes-toolkit"><img alt="npm" src="https://img.shields.io/npm/v/@paladini/lattes-toolkit"></a>
  <a href="LICENSE"><img alt="MIT license" src="https://img.shields.io/badge/license-MIT-green"></a>
  <a href="https://nodejs.org/"><img alt="Node.js 18 or later" src="https://img.shields.io/badge/node-%3E%3D18-339933"></a>
</p>

<p align="center">
  <b>Toolkit to edit exported Currículo Lattes XML programmatically, from the CLI or from AI agents.</b>
</p>

<p align="center">
  Independent project for the Plataforma Lattes XML format. Not affiliated with CNPq.<br>
  <a href="./README.md">Português</a>
  ·
  <a href="https://paladini.github.io/lattes-toolkit/">Docs</a>
  ·
  <a href="./CONTRIBUTING.md">Contributing</a>
</p>

The platform form is a poor fit for batch edits. lattes-toolkit reads
the XML you exported, changes the fields you name, and writes a file
ready for **Import XML**. Tags the typed model does not cover yet stay
in the file.

## Install

Node.js 18 or later.

```bash
npm install @paladini/lattes-toolkit
```

This adds the `lattes-toolkit` command to the project's
`node_modules/.bin`. Without a global install:

```bash
npx lattes-toolkit parse curriculo.xml
```

The package previously published as `@paladini/lattes-parser` is now
`@paladini/lattes-toolkit`. The CLI command is `lattes-toolkit`.

## Quick start

Export XML on Plataforma Lattes and save it as `curriculo.xml`.

### Command line

```bash
lattes-toolkit parse curriculo.xml
lattes-toolkit set curriculo.xml identification.summary "New summary"
```

`set` writes XML back to the same file. When the file already exists,
the toolkit copies the original into `.lattes-backup/` before
overwriting it.

On the platform, use **Import XML**, review the result, and save.

| Command | Effect |
| --- | --- |
| `parse` | Prints a JSON summary of an XML or ZIP file |
| `get` | Reads one field (`identification.summary`, lists with `[0]`) |
| `set` | Updates a field, serializes XML, and creates a backup |
| `serialize` | Turns a `Curriculum` JSON file into XML |
| `restore --last` | Restores the latest snapshot |

Full reference: [docs/cli.md](./docs/cli.md).

### TypeScript

```ts
import { readFileSync } from "node:fs";
import {
  readCurriculum,
  setCurriculumValue,
  writeCurriculum,
} from "@paladini/lattes-toolkit";

const cv = await readCurriculum(readFileSync("./curriculo.xml"));
setCurriculumValue(cv, "identification.summary", "New summary");
await writeCurriculum(cv, "./curriculo.xml");
```

`writeCurriculum` creates the backup and serializes back to platform
XML. Unmapped nodes stay on `unmapped` and round-trip into the file.

### AI agents

When an agent applies several edits, restrict the paths it can change:

1. Read the file with `readCurriculum`.
2. Apply `applyCurriculumPatches` with an allowlist.
3. Write with `writeCurriculum`.
4. Read the generated XML again and check the fields.
5. Import the file on the platform.

See [docs/integracao-ia.md](./docs/integracao-ia.md).

## Features

- Parse exported XML (`CURRICULO-VITAE`) into a `Curriculum` value
- Round-trip serialize: typed fields and unknown nodes
- CLI for scripts and local use
- Edit one path or apply several patches
- Backup under `.lattes-backup/` before overwrite
- Read XML or ZIP, with encoding detection
- Optional SOAP client for institutions that use Extrator, at
  `@paladini/lattes-toolkit/extrator`

## Flow

1. Export XML on Plataforma Lattes.
2. Edit the file on your computer with the CLI, TypeScript, or an agent
   that uses an allowlist.
3. Import the XML on the platform, review it, and save.

You sign in and upload the file on the platform. The toolkit reads and
writes local files.

## Documentation

| Guide | Contents |
| --- | --- |
| [Workflow](./docs/ciclo-de-trabalho.md) | Export, edit, and import |
| [CLI](./docs/cli.md) | Commands |
| [TypeScript API](./docs/api-typescript.md) | Public functions |
| [AI agents](./docs/integracao-ia.md) | Patches and allowlist |
| [Backups](./docs/backups.md) | Snapshots and restore |
| [Limits](./docs/limitacoes.md) | Scope and compliance |

Site: <https://paladini.github.io/lattes-toolkit/>

## Contributing

Issues and pull requests are welcome in Portuguese or English. Test
fixtures are synthetic XML. See [CONTRIBUTING.md](./CONTRIBUTING.md)
and the [code of conduct](./CODE_OF_CONDUCT.md).

## License

[MIT](./LICENSE) © Fernando Paladini
