# Extrator Lattes (opcional)

> **Núcleo do pacote:** parser offline. O Extrator é um **extra** para quem já tem credenciamento institucional.

O CNPq oferece o Extrator Lattes para IEPs integrarem sistemas ([gov.br](https://www.gov.br/pt-br/servicos/obter-acesso-ao-extrator-da-plataforma-lattes)). Requisitos usuais: IP fixo, termo de responsabilidade, WSDL autorizado.

## Instalação

```bash
npm install @paladini/lattes-parser soap
```

## Cliente

```ts
import { ExtratorClient } from "@paladini/lattes-parser/extrator";

const client = new ExtratorClient({
  wsdlUrl: process.env.LATTES_WSDL_URL!,
  endpointUrl: process.env.LATTES_SOAP_ENDPOINT,
});
```

A biblioteca **não** embute URL do CNPq nem credenciais.

## Métodos (v1)

| SOAP | API | Retorno |
| --- | --- | --- |
| `getCurriculoCompactado` | `getCurriculumCompacted(id)` | ZIP (`Uint8Array`) |
| `getCurriculoCompactado` | `getCurriculum(id)` | `Curriculum` parseado |
| `getDataAtualizacaoCV` | `getUpdatedAt(id)` | `string` |

## Falhas comuns

- IP não autorizado
- WSDL com endpoint desatualizado → use `endpointUrl`
- `SOAP_DEPENDENCY_MISSING` → instale `soap`

## Fora de escopo (v1)

`getIdentificadorCNPq`, `wsmodulocv`, grupos de pesquisa.
