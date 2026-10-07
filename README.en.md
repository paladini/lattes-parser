# lattes-toolkit

<p align="center">
  <a href="https://github.com/paladini/lattes-toolkit/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/paladini/lattes-toolkit/actions/workflows/ci.yml/badge.svg"></a>
  <a href="https://www.npmjs.com/package/@paladini/lattes-toolkit"><img alt="npm" src="https://img.shields.io/npm/v/@paladini/lattes-toolkit"></a>
  <a href="LICENSE"><img alt="MIT license" src="https://img.shields.io/badge/license-MIT-green"></a>
  <a href="https://nodejs.org/"><img alt="Node.js 18 or later" src="https://img.shields.io/badge/node-%3E%3D18-339933"></a>
</p>

<p align="center">
  <b>A toolkit to edit a Currículo Lattes: read and write fields in the XML, from code, the CLI, or an AI agent.</b>
</p>

<p align="center">
  Independent project for the Plataforma Lattes XML format. Not affiliated with CNPq.<br>
  <a href="./README.md">Português</a>
  ·
  <a href="https://paladini.github.io/lattes-toolkit/">Docs</a>
  ·
  <a href="./CONTRIBUTING.md">Contributing</a>
</p>

Use it as an export and import process on Plataforma Lattes. You export the XML, lattes-toolkit reads the fields, changes the ones you name, and writes the file. You import that XML yourself, after signing in on Plataforma Lattes.

Identification, education, professional activity, bibliographic and technical production, complementary data, awards, and advisories are typed fields and are written in the Plataforma Lattes XML format (XSD dated 12 Sep 2022). Anything without a typed field stays in the file. Each overwrite of an existing XML file keeps a copy under `.lattes-backup/`. An optional `lattes.config.json` changes that folder and how many snapshots to keep.

## Install

Node.js 18 or later.

```bash
npm install @paladini/lattes-toolkit
```

```bash
npx lattes-toolkit parse curriculo.xml
```

The package previously published as `@paladini/lattes-parser` is now `@paladini/lattes-toolkit`.

## Use

Export XML on Plataforma Lattes and save it as `curriculo.xml`.

```bash
lattes-toolkit parse curriculo.xml
lattes-toolkit set curriculo.xml identification.summary "New summary"
```

`set` writes the same file and creates the backup. Import the file on Plataforma Lattes, review, and save.

| Command | Effect |
| --- | --- |
| `parse` | JSON summary of an XML or ZIP file |
| `get` | Reads one field (`identification.summary`, lists with `[0]`) |
| `set` | Updates one field and writes the XML |
| `patch` | Applies several fields from a JSON file with an allowlist |
| `serialize` | Turns a `Curriculum` JSON file into XML |
| `validate` | Checks the XML against the repo XSD (`xmllint`). `--dtd` uses a local DTD and is off by default |
| `restore --last` | Restores the latest snapshot |

Reference: [docs/cli.md](./docs/cli.md). Typed fields: [docs/cobertura-campos.md](./docs/cobertura-campos.md).

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

### AI agents

Restrict what the agent can change:

1. `readCurriculum`
2. `applyCurriculumPatches` with an allowlist
3. `writeCurriculum`
4. Read the generated XML and check the fields
5. Import the XML on Plataforma Lattes

Example: [docs/integracao-ia.md](./docs/integracao-ia.md). Institutions that use the Extrator SOAP client import `@paladini/lattes-toolkit/extrator`.

## Documentation

| Guide | Contents |
| --- | --- |
| [Workflow](./docs/ciclo-de-trabalho.md) | Export, edit, and import |
| [CLI](./docs/cli.md) | Commands |
| [TypeScript API](./docs/api-typescript.md) | Public functions |
| [Field coverage](./docs/cobertura-campos.md) | What is read and written |
| [XSD schema](./docs/schema-xsd.md) | Versioned schema and validation |
| [AI agents](./docs/integracao-ia.md) | Patches and allowlist |
| [Backups](./docs/backups.md) | Snapshots and restore |
| [Limits](./docs/limitacoes.md) | Scope and compliance |

Site: <https://paladini.github.io/lattes-toolkit/>

## Contributing

Issues and pull requests are welcome in Portuguese or English. Test fixtures are synthetic or anonymized XML. See [CONTRIBUTING.md](./CONTRIBUTING.md) and the [code of conduct](./CODE_OF_CONDUCT.md).

## License

[MIT](./LICENSE) © Fernando Paladini
