# Roadmap

Independent project — not a CNPq roadmap. Priorities may shift with community feedback.

## 2.0 (current)

- [x] Serialize + `writeCurriculum` with `document` tree
- [x] Automatic `.lattes-backup/` before overwrite
- [x] CLI: init, parse, get, set, serialize, restore, backup list, validate, patch, diff
- [x] Patch API + IA contract (docs)
- [x] XSD-aligned sync for sections used in real exports (authors, summary, awards, technical production, complementary data)

## Near term

- [x] Typed board participation, research projects, artistic production (2.1–2.9)
- [x] Typed professional function blocks under `ATUACAO-PROFISSIONAL` (2.12)
- Expand XSD coverage: optional non-PI identification fields (ORCID, PCD); nested project sub-blocks - see [docs/cobertura-campos.md](./docs/cobertura-campos.md)
- [x] Optional DTD validation flag (off by default)
- Example external AI skill (separate repo)

## Later

- [x] Config file `lattes.config.json` (backup dir, retention)
- [x] Richer diff helper for human review before import
- [x] Performance tuning for very large XML exports (technical sync no longer scans every sibling per item; parser left as-is after measurement)

## Non-goals

- Automated login, CAPTCHA, or bulk public download
- Guaranteed server-side merge semantics on CNPq (document only)
