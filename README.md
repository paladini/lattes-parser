# @paladini/lattes-parser

<p align="center">
  <b>Parser TypeScript para XML oficial do Currículo Lattes — offline, tipado, previsível.</b>
</p>

<p align="center">
  <a href="https://github.com/paladini/lattes-parser/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/paladini/lattes-parser/actions/workflows/ci.yml/badge.svg"></a>
  <a href="https://www.npmjs.com/package/@paladini/lattes-parser"><img alt="npm" src="https://img.shields.io/npm/v/@paladini/lattes-parser"></a>
  <a href="LICENSE"><img alt="license" src="https://img.shields.io/badge/license-MIT-green"></a>
</p>

Você **exporta** o currículo (XML ou ZIP do Extrator). Esta biblioteca **interpreta** o arquivo e devolve um objeto `Curriculum` em TypeScript. Ela **não** abre o site do CNPq, **não** resolve CAPTCHA e **não** substitui login na Plataforma Lattes.

> **Independente do CNPq.** Respeite o [termo de uso](https://memoria.cnpq.br/web/portal-lattes/termo-de-uso) e a LGPD. Detalhes em [docs/limitacoes.md](./docs/limitacoes.md).

[English README](./README.en.md)

## Instalação

```bash
npm install @paladini/lattes-parser
```

Cliente SOAP do Extrator (opcional):

```bash
npm install @paladini/lattes-parser soap
```

## De onde vem o arquivo?

| Origem | Quem obtém o XML | Esta lib |
| --- | --- | --- |
| Export manual na Plataforma Lattes | Você (login → Exportar → XML) | Só faz parse |
| ZIP do Extrator institucional | Sua universidade (credenciada) | Parse + cliente SOAP opcional |
| Download público / scraping | — | **Não suportado** |

Passo a passo do export manual: [docs/como-obter-o-xml.md](./docs/como-obter-o-xml.md).

## Uso

```ts
import { readFileSync } from "node:fs";
import { parseCurriculum, readCurriculum, LattesId } from "@paladini/lattes-parser";

// XML exportado (encoding ISO-8859-1 é detectado)
const xml = readFileSync("./curriculo.xml", "latin1");
const cv = parseCurriculum(xml);

console.log(cv.identification.fullName);
console.log(cv.bibliographicProduction.journalArticles);

// Ou XML / ZIP em buffer (ex.: ZIP do getCurriculoCompactado)
const cvFromZip = await readCurriculum(readFileSync("./curriculo.zip"));

LattesId.canonicalUrl("8907059238612691");
// → https://lattes.cnpq.br/8907059238612691
```

### Extrator (instituições credenciadas)

```ts
import { ExtratorClient } from "@paladini/lattes-parser/extrator";

const client = new ExtratorClient({
  wsdlUrl: process.env.LATTES_WSDL_URL!,
  endpointUrl: process.env.LATTES_SOAP_ENDPOINT,
});

const cv = await client.getCurriculum("8907059238612691");
```

## O que entra no `Curriculum`

Formação, atuação, áreas, idiomas, produção bibliográfica e técnica, orientações, prêmios. Tags ainda não mapeadas ficam em `unmapped` — o schema do CNPq muda; nada some em silêncio.

Mapa completo: [docs/modelo.md](./docs/modelo.md).

## Documentação

| Doc | Conteúdo |
| --- | --- |
| [Como obter o XML](./docs/como-obter-o-xml.md) | Export manual vs Extrator |
| [Limitações](./docs/limitacoes.md) | O que a lib não faz |
| [Extrator](./docs/extrator.md) | SOAP institucional |
| [Modelo](./docs/modelo.md) | XML → TypeScript |
| [Contribuir](./CONTRIBUTING.md) | PRs, testes, fixtures sintéticas |

## Licença

MIT — © Fernando Paladini
