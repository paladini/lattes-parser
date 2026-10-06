# Modelo de dados

Pacote: `@paladini/lattes-toolkit`. O XML raiz é `CURRICULO-VITAE` (`NUMERO-IDENTIFICADOR`, `DATA-ATUALIZACAO`, `HORA-ATUALIZACAO`).

## Mapa principal (v1)

| XML | Campo TypeScript |
| --- | --- |
| `CURRICULO-VITAE@NUMERO-IDENTIFICADOR` | `Curriculum.id` |
| `DATA-ATUALIZACAO` + `HORA-ATUALIZACAO` | `Curriculum.updatedAt` |
| `DADOS-GERAIS@NOME-COMPLETO` | `identification.fullName` |
| `DADOS-GERAIS/RESUMO-CV` | `identification.summary` |
| `DADOS-GERAIS/ENDERECO/ENDERECO-PROFISSIONAL` | `identification.professionalAddress` |
| `DADOS-GERAIS/FORMACAO-ACADEMICA-TITULACAO/*` | `academicBackground[]` |
| `DADOS-GERAIS/ATUACOES-PROFISSIONAIS/*` | `professionalActivities[]` |
| `DADOS-GERAIS/AREAS-DE-ATUACAO/*` | `identification.researchAreas[]` |
| `DADOS-GERAIS/IDIOMAS/*` | `identification.languages[]` |
| `DADOS-GERAIS/PREMIOS-TITULOS/*` | `awards[]` |
| `PRODUCAO-BIBLIOGRAFICA/ARTIGOS-PUBLICADOS/*` | `bibliographicProduction.journalArticles[]` |
| `PRODUCAO-BIBLIOGRAFICA/TRABALHOS-EM-EVENTOS/*` | `bibliographicProduction.conferencePapers[]` |
| `PRODUCAO-BIBLIOGRAFICA/LIVROS-E-CAPITULOS/*` | `bibliographicProduction.booksAndChapters[]` |
| `PRODUCAO-TECNICA/*` | `technicalProduction[]` |
| `DADOS-COMPLEMENTARES/ORIENTACOES-*` | `advisories.completed` / `advisories.inProgress` |
| `OUTRA-PRODUCAO` (inteiro) | `unmapped.OUTRA-PRODUCAO` |

## Campos `unmapped`

Cada seção mapeada expõe `unmapped: Record<string, unknown>` com filhos XML ainda não modelados. A raiz `Curriculum.unmapped` guarda blocos de topo não tratados (ex.: `OUTRA-PRODUCAO`).

Isso evita perda silenciosa quando o CNPq adiciona tags novas.

## Encoding

Arquivos exportados frequentemente declaram `ISO-8859-1`. `readCurriculum()` detecta o encoding do cabeçalho XML e decodifica buffers antes do parse.

## Referência de schema

- XSD versionado: [`DEFINITIONS/xml_cvbase_src_main_resources_CurriculoLattes_12_09_2022.xsd`](https://github.com/paladini/lattes-toolkit/blob/main/DEFINITIONS/xml_cvbase_src_main_resources_CurriculoLattes_12_09_2022.xsd)
- Guia: [schema-xsd.md](./schema-xsd.md)
- CNPq (Extrator): [Portal Memória — Extração de dados](https://memoria.cnpq.br/web/portal-lattes/extracoes-de-dados)

Atributos importantes na raiz `CURRICULO-VITAE`: `SISTEMA-ORIGEM-XML`, `NUMERO-IDENTIFICADOR`, `DATA-ATUALIZACAO`, `HORA-ATUALIZACAO`.
