# Allowlist paths

Typed fields an agent may patch. Source: the TypeScript model and [docs/cobertura-campos.md](../../../docs/cobertura-campos.md). This is not an XSD dump. To list XSD elements and attributes while maintaining the schema, run `npx tsx scripts/list-xsd-inventory.ts`.

`applyCurriculumPatches` allowlist entries must match the patch path exactly. `technicalProduction[0].title` does not allow index `1`. Replace `[0]` with the real index.

`sectionsFromPatchPaths` maps the first segment to a `CurriculumSectionId`: `identification`, `academicBackground`, `professionalActivities`, `bibliographicProduction`, `technicalProduction`, `complementary`, `advisories`, `awards`, `metadata`.

## Identification

`AddressContact` is `identification.addressContact`. `ProfessionalAddress` is used for both professional and residential addresses.

- `identification.summary`
- `identification.summaryEnglish`
- `identification.otherRelevantInfo`
- `identification.citationName`
- `identification.addressContact.preference`
- `identification.addressContact.electronic`
- `identification.addressContact.otherContact`
- `identification.addressContact.socialNetwork`
- `identification.professionalAddress.institution`
- `identification.professionalAddress.department`
- `identification.professionalAddress.city`
- `identification.professionalAddress.state`
- `identification.professionalAddress.country`
- `identification.professionalAddress.street`
- `identification.professionalAddress.postalCode`
- `identification.professionalAddress.neighborhood`
- `identification.professionalAddress.areaCode`
- `identification.professionalAddress.phone`
- `identification.professionalAddress.email`
- `identification.professionalAddress.homepage`
- `identification.residentialAddress.street`
- `identification.residentialAddress.postalCode`
- `identification.residentialAddress.neighborhood`
- `identification.residentialAddress.city`
- `identification.residentialAddress.state`
- `identification.residentialAddress.country`
- `identification.residentialAddress.areaCode`
- `identification.residentialAddress.phone`
- `identification.residentialAddress.email`
- `identification.residentialAddress.homepage`
- `identification.researchAreas[0].name`
- `identification.researchAreas[0].knowledgeArea`
- `identification.researchAreas[0].subArea`
- `identification.researchAreas[0].specialty`
- `identification.languages[0].language`
- `identification.languages[0].reading`
- `identification.languages[0].speaking`
- `identification.languages[0].writing`
- `identification.languages[0].comprehension`

## Academic background and professional activity

Formal education is `academicBackground[]`. `courseName` is `NOME-CURSO`. `title` is the conclusion work, written to the XSD attribute for `xmlTag` (TCC on `GRADUACAO`, monograph on `ESPECIALIZACAO`, dissertation or thesis on `MESTRADO` and `DOUTORADO`).

`xmlTag`: `GRADUACAO`, `ESPECIALIZACAO`, `APERFEICOAMENTO`, `MESTRADO`, `MESTRADO-PROFISSIONALIZANTE`, `DOUTORADO`, `POS-DOUTORADO`, `CURSO-TECNICO-PROFISSIONALIZANTE`, `ENSINO-MEDIO-SEGUNDO-GRAU`, `ENSINO-FUNDAMENTAL-PRIMEIRO-GRAU`, `RESIDENCIA-MEDICA`, `LIVRE-DOCENCIA`.

Replace the whole list only to remove an item. Keep parsed objects, including `raw`.

- `academicBackground`
- `academicBackground[0].xmlTag`
- `academicBackground[0].level`
- `academicBackground[0].courseName`
- `academicBackground[0].title`
- `academicBackground[0].institution`
- `academicBackground[0].startYear`
- `academicBackground[0].endYear`
- `academicBackground[0].status`

Professional experience is `professionalActivities[]`. With `links`, the job title is `functionalRole`, not `role`. Free-text bond notes live on `links[0].raw` as `@_OUTRAS-INFORMACOES`.

`functionActivities[0].category` must match `xmlContainerTag` and `xmlItemTag`:

| category | xmlContainerTag | xmlItemTag |
| --- | --- | --- |
| `direction_and_administration` | `ATIVIDADES-DE-DIRECAO-E-ADMINISTRACAO` | `DIRECAO-E-ADMINISTRACAO` |
| `research_and_development` | `ATIVIDADES-DE-PESQUISA-E-DESENVOLVIMENTO` | `PESQUISA-E-DESENVOLVIMENTO` |
| `teaching` | `ATIVIDADES-DE-ENSINO` | `ENSINO` |
| `internship` | `ATIVIDADES-DE-ESTAGIO` | `ESTAGIO` |
| `specialized_technical_service` | `ATIVIDADES-DE-SERVICO-TECNICO-ESPECIALIZADO` | `SERVICO-TECNICO-ESPECIALIZADO` |
| `university_extension` | `ATIVIDADES-DE-EXTENSAO-UNIVERSITARIA` | `EXTENSAO-UNIVERSITARIA` |
| `training_delivered` | `ATIVIDADES-DE-TREINAMENTO-MINISTRADO` | `TREINAMENTO-MINISTRADO` |
| `other_scientific_activity` | `OUTRAS-ATIVIDADES-TECNICO-CIENTIFICA` | `OUTRA-ATIVIDADE-TECNICO-CIENTIFICA` |
| `board_commission_consultancy` | `ATIVIDADES-DE-CONSELHO-COMISSAO-E-CONSULTORIA` | `CONSELHO-COMISSAO-E-CONSULTORIA` |

Tag-specific attributes (`CARGO-OU-FUNCAO`, `NOME-CURSO`, `TIPO-ENSINO`, and the rest) go in `specifics`. An empty `functionActivities` array deletes those XML blocks on that job.

- `professionalActivities`
- `professionalActivities[0].institution`
- `professionalActivities[0].institutionCode`
- `professionalActivities[0].role`
- `professionalActivities[0].startYear`
- `professionalActivities[0].endYear`
- `professionalActivities[0].links`
- `professionalActivities[0].links[0].linkType`
- `professionalActivities[0].links[0].functionalRole`
- `professionalActivities[0].links[0].weeklyHours`
- `professionalActivities[0].links[0].exclusive`
- `professionalActivities[0].links[0].startMonth`
- `professionalActivities[0].links[0].startYear`
- `professionalActivities[0].links[0].endMonth`
- `professionalActivities[0].links[0].endYear`
- `professionalActivities[0].links[0].raw`
- `professionalActivities[0].functionActivities`
- `professionalActivities[0].functionActivities[0].category`
- `professionalActivities[0].functionActivities[0].xmlContainerTag`
- `professionalActivities[0].functionActivities[0].xmlItemTag`
- `professionalActivities[0].functionActivities[0].periodFlag`
- `professionalActivities[0].functionActivities[0].startMonth`
- `professionalActivities[0].functionActivities[0].startYear`
- `professionalActivities[0].functionActivities[0].endMonth`
- `professionalActivities[0].functionActivities[0].endYear`
- `professionalActivities[0].functionActivities[0].organName`
- `professionalActivities[0].functionActivities[0].unitName`
- `professionalActivities[0].functionActivities[0].specifics`

## Bibliographic production

Typed coverage (`BibliographicItem` plus the production envelope). Arrays: `journalArticles`, `acceptedArticles`, `newspaperTexts`, `conferencePapers`, `booksAndChapters`, `other` (`xmlTag` for scores, prefaces, and translations).

- `bibliographicProduction.journalArticles[0].title`
- `bibliographicProduction.journalArticles[0].year`
- `bibliographicProduction.journalArticles[0].doi`
- `bibliographicProduction.journalArticles[0].journalOrEvent`
- `bibliographicProduction.journalArticles[0].authors`
- `bibliographicProduction.conferencePapers[0].title`
- `bibliographicProduction.booksAndChapters[0].title`

Accepted papers, newspapers, and other XSD bibliographic types stay in `bibliographicProduction.unmapped`.

## Technical production

`TechnicalItem` extends `ProductionEnvelope`: `basics`, `detail`, `keywords`, `knowledgeAreas`, `activitySectors`, `additionalInfo`, plus `title`, `year`, and `authors`.

`basics` and `detail` are string maps. Keys are XML attribute names without the `@_` prefix (for example `FINALIDADE` on a `DETALHAMENTO-*` node).

- `technicalProduction[0].title`
- `technicalProduction[0].year`
- `technicalProduction[0].authors`
- `technicalProduction[0].basics`
- `technicalProduction[0].detail`
- `technicalProduction[0].detail.FINALIDADE`
- `technicalProduction[0].keywords`
- `technicalProduction[0].knowledgeAreas`
- `technicalProduction[0].knowledgeAreas[0].majorArea`
- `technicalProduction[0].knowledgeAreas[0].area`
- `technicalProduction[0].knowledgeAreas[0].subArea`
- `technicalProduction[0].knowledgeAreas[0].specialty`
- `technicalProduction[0].activitySectors`
- `technicalProduction[0].additionalInfo.description`
- `technicalProduction[0].additionalInfo.descriptionEnglish`

`keywords` is `string[]` (up to six `PALAVRA-CHAVE-*` values). `activitySectors` is `string[]` (up to three sectors).

## Complementary data

`ComplementaryTraining` is a short course, extension, or complementary specialization. `title` is the course name. `type` is one of `FORMACAO-COMPLEMENTAR-CURSO-DE-CURTA-DURACAO`, `FORMACAO-COMPLEMENTAR-DE-EXTENSAO-UNIVERSITARIA`, `FORMACAO-COMPLEMENTAR-DE-APERFEICOAMENTO`, `FORMACAO-COMPLEMENTAR-DE-ESPECIALIZACAO`, `OUTROS`.

Replace `complementary.complementaryTraining` only to remove an item. Keep parsed objects.

- `complementary.complementaryTraining`
- `complementary.complementaryTraining[0].type`
- `complementary.complementaryTraining[0].title`
- `complementary.complementaryTraining[0].titleEnglish`
- `complementary.complementaryTraining[0].level`
- `complementary.complementaryTraining[0].institution`
- `complementary.complementaryTraining[0].institutionCode`
- `complementary.complementaryTraining[0].organCode`
- `complementary.complementaryTraining[0].organName`
- `complementary.complementaryTraining[0].courseCode`
- `complementary.complementaryTraining[0].workload`
- `complementary.complementaryTraining[0].startYear`
- `complementary.complementaryTraining[0].endYear`
- `complementary.complementaryTraining[0].status`

`EventParticipation` extends `ProductionEnvelope` and adds `participants: EventParticipant[]` (`name`, `citationName`, `order`).

- `complementary.eventParticipation[0].title`
- `complementary.eventParticipation[0].year`
- `complementary.eventParticipation[0].eventName`
- `complementary.eventParticipation[0].city`
- `complementary.eventParticipation[0].participants`
- `complementary.eventParticipation[0].keywords`
- `complementary.eventParticipation[0].knowledgeAreas`
- `complementary.eventParticipation[0].detail`
- `complementary.additionalInstitutions[0].institutionCode`
- `complementary.additionalInstitutions[0].acronym`
- `complementary.additionalCourses[0].courseCode`
- `complementary.additionalCourses[0].institutionName`

## Advisories and awards

Advisories include the production envelope. Completed items serialize under `OUTRA-PRODUCAO`; in-progress items stay under `DADOS-COMPLEMENTARES`.

- `advisories.completed[0].title`
- `advisories.completed[0].studentName`
- `advisories.completed[0].year`
- `advisories.inProgress[0].title`
- `awards[0].title`
- `awards[0].year`
- `awards[0].promotingEntity`

## Unmapped (do not invent typed paths)

These stay on `document` or `unmapped`. Do not add allowlist paths for them.

- PII attributes on `DADOS-GERAIS` (CPF, birth, identity documents, parentage): attributes on `document`, no typed field
- Bond free text other than `@_OUTRAS-INFORMACOES` copied through `links[].raw`
- Nested siblings under a function activity (`DISCIPLINA` and similar): `functionActivities[].raw`
