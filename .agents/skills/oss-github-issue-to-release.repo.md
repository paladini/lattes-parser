# oss-github-issue-to-release — lattes-toolkit overrides

Read [AGENTS.md](../../AGENTS.md) and [RELEASING.md](../../RELEASING.md) first.

## Classification

Backlog issues #21–#32 use playbook **`maintainer-parse-gap`**.

## Branch and version

- Branch from updated `origin/main`: `feat/issue-<N>-<short-slug>`.
- Additive parse/sync: bump **minor** (`2.1.0`, `2.2.0`, …) in `package.json` + `CHANGELOG.md` in the same PR.
- Public API types stay in English; user docs in Portuguese (`README.md`, `docs/cobertura-campos.md`).

## Verification (required before PR)

```bash
npm ci
npm run typecheck
npm run lint
npm test
npm run build
```

## Release

After merge and **GATE-RELEASE**: GitHub Release tag `vX.Y.Z` matching `package.json`
(publish workflow runs `npm publish`).

## Fixtures

Only synthetic XML under `test/fixtures/`. Never commit `DEFINITIONS/Definitions_Lattes_Curriculum_*.xml`.

## PR linkage

Use `Closes #N` in the PR body for backlog issues.
