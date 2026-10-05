# Cobertura de campos (XSD ↔ TypeScript)

Documento **vivo**: meta é ampliar mappers em `src/parse/` mantendo `unmapped` como rede de segurança até cobertura total.

## Legenda

| Estado | Significado |
| --- | --- |
| ✅ | Seção principal mapeada para tipos |
| 🟡 | Parcial (subcampos em `unmapped`) |
| ⬜ | Ainda só via `unmapped` / raiz `document` |

## DADOS-GERAIS

| Seção XML | Estado | Tipo TS |
| --- | --- | --- |
| Identificação, resumo, endereço | ✅ | `CurriculumIdentification` |
| Formação acadêmica | ✅ | `AcademicDegree[]` |
| Atuação profissional | ✅ | `ProfessionalActivity[]` |
| Áreas de atuação | ✅ | `ResearchArea[]` |
| Idiomas | ✅ | `LanguageEntry[]` |
| Prêmios (em dados gerais) | 🟡 | parcial + `unmapped` |
| Demais tags | ⬜ | `identification.unmapped` |

## PRODUÇÃO

| Seção XML | Estado | Tipo TS |
| --- | --- | --- |
| Artigos | ✅ | `BibliographicItem[]` |
| Trabalhos em eventos | ✅ | `BibliographicItem[]` |
| Livros e capítulos | ✅ | `BibliographicItem[]` |
| Produção técnica (software) | 🟡 | `TechnicalItem[]` |
| Outras produções | ⬜ | `unmapped` / `document` |

## DADOS COMPLEMENTARES

| Seção XML | Estado | Tipo TS |
| --- | --- | --- |
| Orientações concluídas | ✅ | `Advisory[]` |
| Orientações em andamento | ✅ | `Advisory[]` |
| Projetos, bancas, etc. | ⬜ | roadmap |

## Serialize

Campos tipados sincronizados em `syncCvToDocument` hoje:

- `id`, `updatedAt`
- `identification.fullName`, `citationName`, `summary`, `otherRelevantInfo`

Demais alterações tipadas exigem estender `syncCvToDocument` ou editar via `document` (avançado).

## Contribuir

Abra issue **parse gap** ou PR com fixture sintética + teste round-trip. Ver [CONTRIBUTING.md](https://github.com/paladini/lattes-parser/blob/main/CONTRIBUTING.md).
