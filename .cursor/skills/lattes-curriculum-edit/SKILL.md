---
name: lattes-curriculum-edit
description: Edit an exported Lattes curriculum XML file with lattes-toolkit using an allowlist and a backup before write. Use when changing identification, technical production, complementary training, events, or other typed curriculum fields.
---

# Lattes curriculum edit

Independent project for the platform XML format. Do not log in to CNPq, solve CAPTCHA, scrape, or upload the file. The user imports the XML on the platform.

Read [fields.md](fields.md) for allowlist paths and [docs/integracao-ia.md](../../../docs/integracao-ia.md) for the patch flow.

1. `readCurriculum` (or parse the existing file).
2. `applyCurriculumPatches` with an explicit `allowlist`. The allowlist is an exact path match.
3. `writeCurriculum` so a backup is created before overwrite (`backup` defaults to on). Pass `sections: sectionsFromPatchPaths(...)` to sync only the sections those paths touch.
4. Re-parse the written file. Optionally `validate: true` when `xmllint` is available.
5. Leave import to the user.

Do not patch unmapped areas listed in fields.md (bancas, artistic `OUTRA-PRODUCAO`, PII on `DADOS-GERAIS`, licenses).
