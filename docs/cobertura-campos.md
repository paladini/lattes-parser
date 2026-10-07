# Cobertura de campos (XSD ↔ TypeScript)

Documento **vivo**, alinhado ao XSD [`CurriculoLattes_12_09_2022`](https://github.com/paladini/lattes-toolkit/blob/main/DEFINITIONS/xml_cvbase_src_main_resources_CurriculoLattes_12_09_2022.xsd).

## Legenda

| Estado | Significado |
| --- | --- |
| ✅ | Leitura + gravação tipada |
| 🟡 | Leitura parcial ou gravação parcial |
| ⬜ | Preservado em `document` / `unmapped` |

## DADOS-GERAIS

| Seção XML | Estado | Tipo TS |
| --- | --- | --- |
| Identificação (nome, citação, resumo XSD) | ✅ | `CurriculumIdentification` |
| Metadados raiz (`SISTEMA-ORIGEM-XML`, formatos) | ✅ | `CurriculumMetadata` |
| Endereço profissional, residencial e contato (`ELETRONICO`, `REDE-SOCIAL` no `ENDERECO`) | ✅ | `ProfessionalAddress`, `AddressContact` |
| Formação acadêmica (tags XSD principais) | ✅ | `AcademicDegree[]` |
| Atuação profissional + `VINCULOS` | 🟡 | `ProfessionalActivity`, `EmploymentLink[]` |
| Participação em projeto (`PROJETO-DE-PESQUISA`, equipe) | ✅ | `ProjectParticipation[]`, `ResearchProject[]` |
| Áreas de atuação | ✅ | `ResearchArea[]` |
| Idiomas (proficiências XSD) | ✅ | `LanguageEntry[]` |
| Prêmios (`PREMIO-TITULO`) | ✅ | `Award[]` |
| Licenças (`LICENCAS` / `LICENCA`) | ✅ | `identification.licenses` (`License[]`) |
| CPF, nascimento, documentos e filiação | ⬜ | atributos em `document` (`DADOS-GERAIS`); sem campo tipado |

## PRODUÇÃO BIBLIOGRÁFICA

| Seção XML | Estado | Tipo TS |
| --- | --- | --- |
| Artigos publicados, aceitos, textos em jornais, eventos, livros/capítulos, partitura, prefácio e tradução | ✅ | `BibliographicItem[]` (`acceptedArticles`, `newspaperTexts`, `other.xmlTag`) |
| Autores (`AUTORES` irmãos) | ✅ | `Author[]` |
| Aceitos, jornais, demais tipos XSD | ⬜ | `bibliographicProduction.unmapped` |

## PRODUÇÃO TÉCNICA

Leitura e gravação do envelope em `TechnicalItem`: `DADOS-BASICOS-*`, `DETALHAMENTO-*`, `PALAVRAS-CHAVE`, `AREAS-DO-CONHECIMENTO`, `SETORES-DE-ATIVIDADE` e `INFORMACOES-ADICIONAIS`.

| Seção XML | Estado | Tipo TS |
| --- | --- | --- |
| Patente, produto, software, trabalho técnico | ✅ | `TechnicalItem` |
| `DEMAIS-TIPOS-DE-PRODUCAO-TECNICA` (apresentação, mídia, manutenção de obra, outra produção técnica) | ✅ | `TechnicalItem` |
| Cultivar registrada/protegida, desenho industrial, marca, topografia de circuito, carta/mapa, maquete, relatório de pesquisa | ✅ | `TechnicalItem` (`DENOMINACAO` no cultivar) |

## DADOS COMPLEMENTARES

| Seção XML | Estado | Tipo TS |
| --- | --- | --- |
| Formação complementar (nível, códigos, órgão, título em inglês) | ✅ | `ComplementaryTraining[]` |
| Participação em eventos, incluindo feira, exposição e olimpíada | ✅ | `EventParticipation[]` |
| Informações adicionais instituições/cursos | ✅ | `AdditionalInstitution[]`, `AdditionalCourse[]` |
| Orientações | 🟡 | `Advisory[]` |
| Bancas de conclusão e bancas julgadoras | ✅ | `BoardParticipation[]` em `complementary.boards` |
| Projetos e demais atividades de atuação | ⬜ | `document` / `complementary.unmapped` |

## OUTRA-PRODUCAO

| Seção XML | Estado | Tipo TS |
| --- | --- | --- |
| Produção artística/cultural e `DEMAIS-TRABALHOS` | ✅ | `artisticProduction` (`ArtisticItem[]`). Orientações concluídas dentro de `OUTRA-PRODUCAO` continuam só no `document` |

## Validação

- CLI: `lattes-toolkit validate arquivo.xml` (XSD via `xmllint`). `validate --dtd arquivo.dtd` é opcional e não substitui o XSD.
- Ver [schema-xsd.md](./schema-xsd.md)

## Contribuir

Abra issue **parse gap** ou PR com fixture sintética ou anonimizada + teste round-trip. Ver [CONTRIBUTING.md](https://github.com/paladini/lattes-toolkit/blob/main/CONTRIBUTING.md).
