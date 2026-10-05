# Roadmap

Independent project — not a CNPq roadmap. Priorities may shift with community feedback.

## 1.1.x (current)

- [x] Serialize + `writeCurriculum` with `document` tree
- [x] Automatic `.lattes-backup/` before overwrite
- [x] CLI: init, parse, get, set, serialize, restore, backup list
- [x] Patch API + IA contract (docs)
- [ ] Broader `syncCvToDocument` for production sections

## Near term

- Expand XSD coverage (projects, boards, patents) — see [docs/cobertura-campos.md](./docs/cobertura-campos.md)
- CLI `patch` from JSON file
- Optional DTD validation flag (off by default)
- Example external AI skill (separate repo)

## Later

- Config file `lattes.config.json` (backup dir, retention)
- Richer diff helper for human review before import
- Performance tuning for very large XML exports

## Non-goals

- Automated login, CAPTCHA, or bulk public download
- Guaranteed server-side merge semantics on CNPq (document only)
