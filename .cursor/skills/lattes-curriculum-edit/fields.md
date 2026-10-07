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

- `academicBackground[0].level`
- `academicBackground[0].title`
- `academicBackground[0].institution`
- `academicBackground[0].startYear`
- `academicBackground[0].endYear`
- `academicBackground[0].status`
- `professionalActivities[0].institution`
- `professionalActivities[0].role`
- `professionalActivities[0].startYear`
- `professionalActivities[0].endYear`
- `professionalActivities[0].links[0].linkType`
- `professionalActivities[0].links[0].functionalRole`
- `professionalActivities[0].links[0].weeklyHours`

Employment links are partial coverage. Prefer editing fields that already exist on the item.

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

`ComplementaryTraining` includes `level`, `institutionCode`, `organCode`, `organName`, `courseCode`, and `titleEnglish`.

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

- Bancas and projects: `complementary.unmapped`
- Artistic and cultural production (`OUTRA-PRODUCAO`): `Curriculum.unmapped`
- PII attributes on `DADOS-GERAIS` (CPF, birth, identity documents, parentage): attributes on `document`, no typed field
- Licenses (`LICENCAS`): `document`
