# @paladini/lattes-parser

<p align="center">
  <b>Toolkit independente para editar localmente o XML do Currículo Lattes (CLI/TypeScript), com backup automático.</b>
</p>

<p align="center">
  <a href="https://github.com/paladini/lattes-parser/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/paladini/lattes-parser/actions/workflows/ci.yml/badge.svg"></a>
  <a href="https://www.npmjs.com/package/@paladini/lattes-parser"><img alt="npm" src="https://img.shields.io/npm/v/@paladini/lattes-parser"></a>
  <a href="LICENSE"><img alt="license" src="https://img.shields.io/badge/license-MIT-green"></a>
</p>

> **Projeto independente — não é produto, ferramenta nem endosso do CNPq.** As marcas Lattes e CNPq referem-se aos serviços públicos. Respeite o [termo de uso](https://memoria.cnpq.br/web/portal-lattes/termo-de-uso) e a LGPD. Detalhes em [docs/limitacoes.md](./docs/limitacoes.md).

[English README](./README.en.md)

## Problema e solução

A Plataforma Lattes edita bem na interface web, mas o **XML exportado** é a interface natural para revisão em lote, scripts e (no futuro) assistentes de IA. Este toolkit cobre o ciclo **local**:

1. **Você exporta** o XML na Plataforma (login → Exportar).
2. **Parse, edite e serialize** aqui (CLI ou TypeScript).
3. **Você importa** de volta em Importar XML, revisa e salva.

**Exportar e importar na Plataforma são sempre manuais.** O toolkit não faz login, CAPTCHA, download público em massa nem envio automático ao CNPq.

Fluxo detalhado: [docs/ciclo-de-trabalho.md](./docs/ciclo-de-trabalho.md). Limites da UI de importação: [docs/importacao-lattes.md](./docs/importacao-lattes.md).

## Backup automático

Antes de sobrescrever um XML de trabalho, uma cópia vai para `.lattes-backup/` (versionado por timestamp). Como listar e restaurar: [docs/backups.md](./docs/backups.md).

## Instalação

```bash
npm install @paladini/lattes-parser
```

CLI global (opcional):

```bash
npm install -g @paladini/lattes-parser
```

## Quick start (CLI)

```bash
lattes-parser init
lattes-parser parse meu-curriculo.xml
lattes-parser get meu-curriculo.xml identification.summary
lattes-parser set meu-curriculo.xml identification.summary "Novo resumo profissional"
# backup criado em .lattes-backup/ — reimporte meu-curriculo.xml na Plataforma
lattes-parser backup list
lattes-parser restore --last
```

## Quick start (TypeScript)

```ts
import { readFileSync } from "node:fs";
import {
  readCurriculum,
  writeCurriculum,
  LattesId,
  setCurriculumValue,
} from "@paladini/lattes-parser";

const cv = await readCurriculum(readFileSync("./curriculo.xml"));
setCurriculumValue(cv, "identification.summary", "Texto atualizado.");
await writeCurriculum(cv, "./curriculo.xml"); // backup automático

console.log(LattesId.canonicalUrl(cv));
```

## Editar “qualquer campo”

- **Campos tipados** — `identification`, produções, orientações, etc. (crescem com o tempo; mapa em [docs/cobertura-campos.md](./docs/cobertura-campos.md)).
- **`unmapped`** — tags ainda não mapeadas permanecem no modelo e voltam ao XML no serialize (round-trip lossless no arquivo).

Integração com skills de IA (contrato, allowlist, backup): [docs/integracao-ia.md](./docs/integracao-ia.md).

## De onde vem o arquivo?

| Origem | Quem obtém o XML | Este toolkit |
| --- | --- | --- |
| Export manual na Plataforma Lattes | Você | Parse + edit + serialize |
| ZIP do Extrator institucional | Instituição credenciada | Idem + cliente SOAP opcional |
| Download público / scraping | — | **Não suportado** |

Passo a passo do export: [docs/como-obter-o-xml.md](./docs/como-obter-o-xml.md).

### Extrator (rodapé — instituições)

Alternativa para **obter** XML via credenciamento CNPq; não substitui o fluxo “meu currículo” na UI. Ver [docs/extrator.md](./docs/extrator.md).

## Documentação

| Doc | Conteúdo |
| --- | --- |
| [Ciclo de trabalho](./docs/ciclo-de-trabalho.md) | Export → editar → reimportar |
| [Backups](./docs/backups.md) | `.lattes-backup`, restore |
| [Importação no Lattes](./docs/importacao-lattes.md) | UI + expectativas de merge |
| [Cobertura de campos](./docs/cobertura-campos.md) | XSD ↔ tipos |
| [Integração IA](./docs/integracao-ia.md) | Patches seguros |
| [Modelo](./docs/modelo.md) | XML → TypeScript |
| [Limitações](./docs/limitacoes.md) | Escopo e avisos |
| [ROADMAP](./ROADMAP.md) | Próximos passos |
| [Contribuir](./CONTRIBUTING.md) | PRs, round-trip, fixtures sintéticas |

## Comunidade

Issues e PRs são bem-vindos. Código de conduta: [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md). Segurança: [SECURITY.md](./SECURITY.md).

## Licença

MIT — © Fernando Paladini
