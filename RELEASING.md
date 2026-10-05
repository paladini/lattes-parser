# Releasing @paladini/lattes-parser

Maintainer checklist for npm and GitHub Releases.

## Preconditions

- `main` is green on CI
- `package.json` version bumped (semver)
- `CHANGELOG.md` updated for user-visible changes

## Local verification

```bash
npm ci
npm run typecheck
npm run lint
npm test
npm run build
```

## Publish to npm

Scoped public package:

```bash
npm publish --access public
```

Requires `NPM_TOKEN` with publish rights to `@paladini` scope (CI uses `secrets.npm_token` on release).

## GitHub Release

1. Create a GitHub Release tagged `vX.Y.Z` matching `package.json`.
2. The [publish workflow](.github/workflows/publish.yml) runs `npm publish` on `release: created`.

## Version policy

- **1.x:** Parser-focused API; breaking XML mapping changes may be minor if additive; breaking public TypeScript API → major.
- Extrator subpath follows the same semver as the root package.
