# Cobertura de campos (XSD ↔ TypeScript)

Documento **vivo**, alinhado ao XSD [`CurriculoLattes_12_09_2022`](../DEFINITIONS/xml_cvbase_src_main_resources_CurriculoLattes_12_09_2022.xsd).

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
| Endereço profissional e residencial | 🟡 | `ProfessionalAddress` |
| Formação acadêmica (tags XSD principais) | ✅ | `AcademicDegree[]` |
| Atuação profissional + `VINCULOS` | 🟡 | `ProfessionalActivity`, `EmploymentLink[]` |
| Áreas de atuação | ✅ | `ResearchArea[]` |
| Idiomas (proficiências XSD) | ✅ | `LanguageEntry[]` |
| Prêmios (`PREMIO-TITULO`) | ✅ | `Award[]` |
| Licenças, PII estendida | ⬜ | `identification.unmapped` |

## PRODUÇÃO BIBLIOGRÁFICA

| Seção XML | Estado | Tipo TS |
| --- | --- | --- |
| Artigos, eventos, livros/capítulos (flat + aninhado) | 🟡 | `BibliographicItem[]` |
| Autores (`AUTORES` irmãos) | ✅ | `Author[]` |
| Aceitos, jornais, demais tipos XSD | ⬜ | `bibliographicProduction.unmapped` |

## PRODUÇÃO TÉCNICA

| Seção XML | Estado | Tipo TS |
| --- | --- | --- |
| Patente, produto, software, trabalho técnico | ✅ | `TechnicalItem[]` |
| `DEMAIS-TIPOS-DE-PRODUCAO-TECNICA` (apresentação, mídia, etc.) | 🟡 | `TechnicalItem[]` |
| Demais tags XSD | ⬜ | `document` |

## DADOS COMPLEMENTARES

| Seção XML | Estado | Tipo TS |
| --- | --- | --- |
| Formação complementar | ✅ | `ComplementaryTraining[]` |
| Participação em eventos | ✅ | `EventParticipation[]` |
| Informações adicionais instituições/cursos | ✅ | `AdditionalInstitution[]`, `AdditionalCourse[]` |
| Orientações | 🟡 | `Advisory[]` |
| Bancas, projetos | ⬜ | `complementary.unmapped` |

## OUTRA-PRODUCAO

| Seção XML | Estado | Tipo TS |
| --- | --- | --- |
| Produção artística/cultural | ⬜ | `Curriculum.unmapped` |

## Validação

- CLI: `lattes-toolkit validate arquivo.xml` (XSD via `xmllint`)
- Ver [schema-xsd.md](./schema-xsd.md)

## Contribuir

Abra issue **parse gap** ou PR com fixture sintética ou anonimizada + teste round-trip. Ver [CONTRIBUTING.md](https://github.com/paladini/lattes-toolkit/blob/main/CONTRIBUTING.md).
