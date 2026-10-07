# Roadmap

Independent project — not a CNPq roadmap. Priorities may shift with community feedback.

## 2.0 (current)

- [x] Serialize + `writeCurriculum` with `document` tree
- [x] Automatic `.lattes-backup/` before overwrite
- [x] CLI: init, parse, get, set, serialize, restore, backup list, validate, patch
- [x] Patch API + IA contract (docs)
- [x] XSD-aligned sync for sections used in real exports (authors, summary, awards, technical production, complementary data)

## Near term

- Expand XSD coverage (boards, projects, artistic production, personal identification) - see [docs/cobertura-campos.md](./docs/cobertura-campos.md)
- [x] Optional DTD validation flag (off by default)
- Example external AI skill (separate repo)

## Later

- Config file `lattes.config.json` (backup dir, retention)
- Richer diff helper for human review before import
- Performance tuning for very large XML exports

## Non-goals

- Automated login, CAPTCHA, or bulk public download
- Guaranteed server-side merge semantics on CNPq (document only)
