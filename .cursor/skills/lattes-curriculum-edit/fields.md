# Allowlist paths

Typed fields an agent may patch. Source: the TypeScript model and [docs/cobertura-campos.md](../../../docs/cobertura-campos.md). This is not an XSD dump. To list XSD elements and attributes while maintaining the schema, run `npx tsx scripts/list-xsd-inventory.ts`.

`applyCurriculumPatches` allowlist entries must match the patch path exactly. `technicalProduction[0].title` does not allow index `1`. Replace `[0]` with the real index.

`sectionsFromPatchPaths` maps the first segment to a `CurriculumSectionId`: `identification`, `academicBackground`, `professionalActivities`, `bibliographicProduction`, `technicalProduction`, `artisticProduction`, `complementary`, `advisories`, `awards`, `metadata`.

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

### Research projects on a job

A research project is `professionalActivities[i].projectParticipations` (`PARTICIPACAO-EM-PROJETO` / `PROJETO-DE-PESQUISA`). It is not an article and not `technicalProduction`.

`syncProjectParticipations` does not delete the XML when `projectParticipations` is `undefined` or `[]`. To add or remove a project, copy the parsed array for that job and write the full list. Allowlist the array path, not only the new index.

`[0]` below is the shape. Replace it with the real index after parse.

- `professionalActivities[0].projectParticipations`
- `professionalActivities[0].projectParticipations[0].periodFlag`
- `professionalActivities[0].projectParticipations[0].startMonth`
- `professionalActivities[0].projectParticipations[0].startYear`
- `professionalActivities[0].projectParticipations[0].endMonth`
- `professionalActivities[0].projectParticipations[0].endYear`
- `professionalActivities[0].projectParticipations[0].organName`
- `professionalActivities[0].projectParticipations[0].unitName`
- `professionalActivities[0].projectParticipations[0].projects`
- `professionalActivities[0].projectParticipations[0].projects[0].name`
- `professionalActivities[0].projectParticipations[0].projects[0].nameEnglish`
- `professionalActivities[0].projectParticipations[0].projects[0].startYear`
- `professionalActivities[0].projectParticipations[0].projects[0].endYear`
- `professionalActivities[0].projectParticipations[0].projects[0].situation`
- `professionalActivities[0].projectParticipations[0].projects[0].nature`
- `professionalActivities[0].projectParticipations[0].projects[0].description`
- `professionalActivities[0].projectParticipations[0].projects[0].descriptionEnglish`
- `professionalActivities[0].projectParticipations[0].projects[0].projectIdentifier`
- `professionalActivities[0].projectParticipations[0].projects[0].teamMembers`
- `professionalActivities[0].projectParticipations[0].projects[0].teamMembers[0].name`
- `professionalActivities[0].projectParticipations[0].projects[0].teamMembers[0].citationName`
- `professionalActivities[0].projectParticipations[0].projects[0].teamMembers[0].integrationOrder`
- `professionalActivities[0].projectParticipations[0].projects[0].teamMembers[0].responsible`
- `professionalActivities[0].projectParticipations[0].projects[0].funders`
- `professionalActivities[0].projectParticipations[0].projects[0].funders[0].institutionName`
- `professionalActivities[0].projectParticipations[0].projects[0].funders[0].nature`

Round-trip sample (`test/fixtures/curriculum-research-project-sample.xml`): `situation` `EM_ANDAMENTO`, `nature` `PESQUISA`, `periodFlag` `ATUAL`, `responsible` `SIM`. A new project needs `name` and at least one `teamMembers` entry. Nested XSD blocks that are not listed here stay on `raw`; copy the parsed object instead of inventing keys.

## Bibliographic production

Six typed lists. Append at `bibliographicProduction.<list>[n]`, where `n` is the current length. `[0]` below is the shape.

Minimum new item: `type`, `title`, `year`, `authors`. For a rich envelope (`basics`, `detail`, `keywords`, `knowledgeAreas`, `activitySectors`), copy a similar item from `parse --json`. An empty `keywords`, `knowledgeAreas`, or `activitySectors` array deletes that XML node. Omit the field to leave it untouched.

`journalOrEvent` is the journal title on articles and the event name on `conference_paper`. `booksAndChapters[].type` is `book` or `book_chapter`. `other[].xmlTag` distinguishes scores, prefaces, and translations (`PARTITURA-MUSICAL`, `PREFACIO-POSFACIO`, `TRADUCAO`, `OUTRA-PRODUCAO-BIBLIOGRAFICA`).

Tags outside this catalog stay in `bibliographicProduction.unmapped`. Accepted articles, newspaper texts, and `other` are typed. They do not belong in `unmapped`.

- `bibliographicProduction.journalArticles`
- `bibliographicProduction.journalArticles[0].type`
- `bibliographicProduction.journalArticles[0].title`
- `bibliographicProduction.journalArticles[0].year`
- `bibliographicProduction.journalArticles[0].doi`
- `bibliographicProduction.journalArticles[0].journalOrEvent`
- `bibliographicProduction.journalArticles[0].authors`
- `bibliographicProduction.journalArticles[0].keywords`
- `bibliographicProduction.acceptedArticles`
- `bibliographicProduction.acceptedArticles[0].type`
- `bibliographicProduction.acceptedArticles[0].title`
- `bibliographicProduction.acceptedArticles[0].year`
- `bibliographicProduction.acceptedArticles[0].doi`
- `bibliographicProduction.acceptedArticles[0].journalOrEvent`
- `bibliographicProduction.acceptedArticles[0].authors`
- `bibliographicProduction.acceptedArticles[0].keywords`
- `bibliographicProduction.newspaperTexts`
- `bibliographicProduction.newspaperTexts[0].type`
- `bibliographicProduction.newspaperTexts[0].title`
- `bibliographicProduction.newspaperTexts[0].year`
- `bibliographicProduction.newspaperTexts[0].doi`
- `bibliographicProduction.newspaperTexts[0].journalOrEvent`
- `bibliographicProduction.newspaperTexts[0].authors`
- `bibliographicProduction.newspaperTexts[0].keywords`
- `bibliographicProduction.conferencePapers`
- `bibliographicProduction.conferencePapers[0].type`
- `bibliographicProduction.conferencePapers[0].title`
- `bibliographicProduction.conferencePapers[0].year`
- `bibliographicProduction.conferencePapers[0].doi`
- `bibliographicProduction.conferencePapers[0].journalOrEvent`
- `bibliographicProduction.conferencePapers[0].authors`
- `bibliographicProduction.conferencePapers[0].keywords`
- `bibliographicProduction.booksAndChapters`
- `bibliographicProduction.booksAndChapters[0].type`
- `bibliographicProduction.booksAndChapters[0].title`
- `bibliographicProduction.booksAndChapters[0].year`
- `bibliographicProduction.booksAndChapters[0].doi`
- `bibliographicProduction.booksAndChapters[0].authors`
- `bibliographicProduction.booksAndChapters[0].keywords`
- `bibliographicProduction.other`
- `bibliographicProduction.other[0].type`
- `bibliographicProduction.other[0].xmlTag`
- `bibliographicProduction.other[0].title`
- `bibliographicProduction.other[0].year`
- `bibliographicProduction.other[0].authors`
- `bibliographicProduction.other[0].keywords`

`type` values: `journal_article`, `accepted_article`, `newspaper_text`, `conference_paper`, `book`, `book_chapter`, and for `other` the parsed label (`musical_score`, `preface`, `translation`, `other_bibliographic`).

## Technical production

`TechnicalItem` extends `ProductionEnvelope`: `basics`, `detail`, `keywords`, `knowledgeAreas`, `activitySectors`, `additionalInfo`, plus `type`, `xmlTag`, `title`, `year`, and `authors`.

Append at `technicalProduction[n]`, where `n` is the current length. Minimum new item: `type`, `title`, `year`, `authors`. Set `xmlTag` to the pair used by that `type` (software is `SOFTWARE`). Copy a similar parsed item when the envelope matters. Do not invent `xmlTag`.

`basics` and `detail` are string maps. Keys are XML attribute names without the `@_` prefix (for example `FINALIDADE` on a `DETALHAMENTO-*` node).

- `technicalProduction`
- `technicalProduction[0].type`
- `technicalProduction[0].xmlTag`
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

`EventParticipation` extends `ProductionEnvelope` and adds `participants: EventParticipant[]` (`name`, `citationName`, `order`). Append at `complementary.eventParticipation[n]`, where `n` is the current length. `type` is the XML tag: `PARTICIPACAO-EM-CONGRESSO`, `PARTICIPACAO-EM-ENCONTRO`, `PARTICIPACAO-EM-SEMINARIO`, `PARTICIPACAO-EM-SIMPOSIO`, `PARTICIPACAO-EM-OFICINA`, `PARTICIPACAO-EM-FEIRA`, `PARTICIPACAO-EM-EXPOSICAO`, `PARTICIPACAO-EM-OLIMPIADA`, `OUTRAS-PARTICIPACOES-EM-EVENTOS-CONGRESSOS`. This list is participation in an event, not a published conference paper (`bibliographicProduction.conferencePapers`).

- `complementary.eventParticipation`
- `complementary.eventParticipation[0].type`
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

### Boards

`BoardParticipation` is `complementary.boards`. Use it only when the person asks for a thesis board or a judging board. `kind` is `thesis` or `judging`. `xmlTag` is the parsed tag (for example `PARTICIPACAO-EM-BANCA-DE-MESTRADO` or `BANCA-JULGADORA-PARA-CONCURSO-PUBLICO`). For a new item, copy a similar board from `parse --json` so the envelope stays intact.

- `complementary.boards`
- `complementary.boards[0].kind`
- `complementary.boards[0].xmlTag`
- `complementary.boards[0].title`
- `complementary.boards[0].year`
- `complementary.boards[0].candidateName`
- `complementary.boards[0].institution`
- `complementary.boards[0].participants`

## Advisories and awards

Advisories include the production envelope. Completed items serialize under `OUTRA-PRODUCAO`. In-progress items stay under `DADOS-COMPLEMENTARES`. Use these lists only when the person asks. For a new item, copy a similar advisory from `parse --json` (including `type` and the envelope). `type` is the XML tag, such as `ORIENTACOES-CONCLUIDAS-PARA-MESTRADO` or `ORIENTACAO-EM-ANDAMENTO-DE-GRADUACAO`.

- `advisories.completed`
- `advisories.completed[0].title`
- `advisories.completed[0].studentName`
- `advisories.completed[0].year`
- `advisories.completed[0].type`
- `advisories.inProgress`
- `advisories.inProgress[0].title`
- `advisories.inProgress[0].studentName`
- `advisories.inProgress[0].year`
- `advisories.inProgress[0].type`

Awards append at `awards[n]`, where `n` is the current length. An empty `awards` array removes the prizes block.

- `awards`
- `awards[0].title`
- `awards[0].year`
- `awards[0].promotingEntity`

## Artistic production

`artisticProduction` is cultural or artistic work (`ArtisticItem`). It is not an article. Use it only when the person asks. Append at `artisticProduction[n]`. Set `xmlTag` from a similar parsed item (for example `OBRA-DE-ARTES-VISUAIS`). Do not invent the tag. Copy the envelope from `parse --json` when the item is new.

- `artisticProduction`
- `artisticProduction[0].title`
- `artisticProduction[0].year`
- `artisticProduction[0].xmlTag`
- `artisticProduction[0].type`
- `artisticProduction[0].authors`

## Unmapped (do not invent typed paths)

These stay on `document` or `unmapped`. Do not add allowlist paths for them. If a node exists only on `document` or `unmapped`, leave it there.

- PII on `DADOS-GERAIS`: CPF, birth, identity documents, and parentage. No typed field.
- Bond free text only through `links[].raw`, keeping every `@_` key already on the parsed object and changing `@_OUTRAS-INFORMACOES` when that is the note. Do not invent another path for that text.
- Nested siblings under a function activity (`DISCIPLINA` and similar): `functionActivities[].raw`
- ORCID and PCD: not typed. Do not invent a path.
