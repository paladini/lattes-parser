# Modelo de dados

Pacote: `@paladini/lattes-toolkit`. O XML raiz é `CURRICULO-VITAE` (`NUMERO-IDENTIFICADOR`, `DATA-ATUALIZACAO`, `HORA-ATUALIZACAO`).

## Mapa principal

| XML | Campo TypeScript |
| --- | --- |
| `CURRICULO-VITAE@NUMERO-IDENTIFICADOR` | `Curriculum.id` |
| `DATA-ATUALIZACAO` + `HORA-ATUALIZACAO` | `Curriculum.updatedAt` |
| `DADOS-GERAIS@NOME-COMPLETO` | `identification.fullName` |
| `DADOS-GERAIS/RESUMO-CV` | `identification.summary` |
| `DADOS-GERAIS/ENDERECO` (`FLAG-DE-PREFERENCIA`, `ELETRONICO`, `REDE-SOCIAL`) | `identification.addressContact` |
| `DADOS-GERAIS/ENDERECO/ENDERECO-PROFISSIONAL` | `identification.professionalAddress` |
| `DADOS-GERAIS/ENDERECO/ENDERECO-RESIDENCIAL` | `identification.residentialAddress` |
| `DADOS-COMPLEMENTARES/FORMACAO-COMPLEMENTAR/*` | `complementary.complementaryTraining[]` |
| `DADOS-COMPLEMENTARES/PARTICIPACAO-EM-EVENTOS-CONGRESSOS/*` | `complementary.eventParticipation[]` |
| `DADOS-COMPLEMENTARES/PARTICIPACAO-EM-BANCA-*` | `complementary.boards[]` (`BoardParticipation`) |
| `DADOS-GERAIS/FORMACAO-ACADEMICA-TITULACAO/*` | `academicBackground[]` |
| `DADOS-GERAIS/ATUACOES-PROFISSIONAIS/*` | `professionalActivities[]` |
| `ATUACAO-PROFISSIONAL/ATIVIDADES-DE-PARTICIPACAO-EM-PROJETO/*` | `professionalActivities[].projectParticipations[]` |
| `ATUACAO-PROFISSIONAL/ATIVIDADES-DE-*` (direção, ensino, extensão, etc.) | `professionalActivities[].functionActivities[]` |
| `DADOS-GERAIS/AREAS-DE-ATUACAO/*` | `identification.researchAreas[]` |
| `DADOS-GERAIS/IDIOMAS/*` | `identification.languages[]` |
| `DADOS-GERAIS/LICENCAS/LICENCA` | `identification.licenses[]` |
| `DADOS-GERAIS/PREMIOS-TITULOS/*` | `awards[]` |
| `PRODUCAO-BIBLIOGRAFICA/ARTIGOS-PUBLICADOS/*` | `bibliographicProduction.journalArticles[]` |
| `PRODUCAO-BIBLIOGRAFICA/ARTIGOS-ACEITOS-PARA-PUBLICACAO/*` | `bibliographicProduction.acceptedArticles[]` |
| `PRODUCAO-BIBLIOGRAFICA/TEXTOS-EM-JORNAIS-OU-REVISTAS/*` | `bibliographicProduction.newspaperTexts[]` |
| `DEMAIS-TIPOS-DE-PRODUCAO-BIBLIOGRAFICA/TRADUCAO`, `PARTITURA-MUSICAL`, `PREFACIO-POSFACIO` | `bibliographicProduction.other[]` (`xmlTag`) |
| `PRODUCAO-BIBLIOGRAFICA/TRABALHOS-EM-EVENTOS/*` | `bibliographicProduction.conferencePapers[]` |
| `PRODUCAO-BIBLIOGRAFICA/LIVROS-E-CAPITULOS/*` | `bibliographicProduction.booksAndChapters[]` |
| `PRODUCAO-TECNICA/*` | `technicalProduction[]` (`TechnicalItem`) |
| `OUTRA-PRODUCAO/ORIENTACOES-CONCLUIDAS/*` | `advisories.completed[]` (leitura também aceita o bloco antigo em `DADOS-COMPLEMENTARES`) |
| `DADOS-COMPLEMENTARES/ORIENTACOES-EM-ANDAMENTO/*` | `advisories.inProgress[]` |
| `OUTRA-PRODUCAO/PRODUCAO-ARTISTICA-CULTURAL/*` e `DEMAIS-TRABALHOS` | `artisticProduction[]` (`ArtisticItem`) |

## Formação acadêmica (`AcademicDegree`)

| Campo | Origem no XML |
| --- | --- |
| `courseName` | `NOME-CURSO` (nome do curso ou programa) |
| `title` | Título de conclusão na tag correta (`TITULO-DO-TRABALHO-DE-CONCLUSAO-DE-CURSO` em `GRADUACAO`, `TITULO-DA-MONOGRAFIA`, `TITULO-DA-DISSERTACAO-TESE`, etc.) |
| `xmlTag` | Tag XSD (`GRADUACAO`, `MESTRADO`, …) |

## Atividades dentro do vínculo (`ProfessionalFunctionEntry`)

Cada item de `functionActivities` corresponde a uma linha em um bloco `ATIVIDADES-DE-*`. Período e órgão são campos próprios; demais atributos XSD da função ficam em `specifics`. Filhos aninhados (por exemplo `DISCIPLINA` no ensino) permanecem em `raw`.

## Produção técnica (`TechnicalItem`)

Cada item de `technicalProduction` mantém `title` e `year` lidos dos atributos de `DADOS-BASICOS-*`, mais `authors`. O restante do bloco XSD fica no mesmo objeto:

| Campo | Origem no XML |
| --- | --- |
| `basics` | Atributos do primeiro filho `DADOS-BASICOS*` (nome sem o prefixo `@_`) |
| `detail` | Atributos do primeiro filho `DETALHAMENTO*` |
| `keywords` | `PALAVRAS-CHAVE` (`PALAVRA-CHAVE-1` a `PALAVRA-CHAVE-6`) |
| `knowledgeAreas` | `AREAS-DO-CONHECIMENTO` / `AREA-DO-CONHECIMENTO-1` a `3` (`majorArea`, `area`, `subArea`, `specialty`) |
| `activitySectors` | `SETORES-DE-ATIVIDADE` (`SETOR-DE-ATIVIDADE-1` a `3`) |
| `additionalInfo` | `INFORMACOES-ADICIONAIS` (`description`, `descriptionEnglish`) |

Na gravação, o título volta para o atributo de título que já existe no nó (`TITULO-DO-SOFTWARE`, `TITULO-DO-PRODUTO`, `TITULO-DO-PROCESSO`, `TITULO`, `TITULO-DO-TRABALHO-TECNICO` ou `DENOMINACAO` no cultivar, conforme o XSD de cada tipo). Atributos desconhecidos e filhos como `AUTORES` permanecem no nó. Uma tag de produção técnica que o catálogo não lista continua só no `document`.

## Campos `unmapped`

Cada seção mapeada expõe `unmapped: Record<string, unknown>` com filhos XML ainda não modelados. A raiz `Curriculum.unmapped` guarda blocos de topo não tratados. `OUTRA-PRODUCAO` é parseada em `artisticProduction` e orientações concluídas; o que sobrar permanece no `document`.

Isso evita perda silenciosa quando o CNPq adiciona tags novas.

## Encoding

Arquivos exportados frequentemente declaram `ISO-8859-1`. `readCurriculum()` detecta o encoding do cabeçalho XML e decodifica buffers antes do parse.

## Referência de schema

- XSD versionado: [`DEFINITIONS/xml_cvbase_src_main_resources_CurriculoLattes_12_09_2022.xsd`](https://github.com/paladini/lattes-toolkit/blob/main/DEFINITIONS/xml_cvbase_src_main_resources_CurriculoLattes_12_09_2022.xsd)
- Guia: [schema-xsd.md](./schema-xsd.md)
- CNPq (Extrator): [Portal Memória - Extração de dados](https://memoria.cnpq.br/web/portal-lattes/extracoes-de-dados)

Atributos importantes na raiz `CURRICULO-VITAE`: `SISTEMA-ORIGEM-XML`, `NUMERO-IDENTIFICADOR`, `DATA-ATUALIZACAO`, `HORA-ATUALIZACAO`.
