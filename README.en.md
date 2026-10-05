# @paladini/lattes-parser

Toolkit to parse and edit exported Plataforma Lattes curriculum XML programmatically, via CLI or automated AI agents.

Independent project, not affiliated with CNPq.

[Portuguese README](./README.md) · [Docs](https://paladini.github.io/lattes-parser/)

## Flow

1. Export XML from Plataforma Lattes.
2. Parse and edit programmatically (CLI, TypeScript, or AI agents with `applyCurriculumPatches` and allowlist). Round-trip serialize preserves `unmapped` nodes.
3. **Import XML** on the platform, review, save.

The library does not log in to CNPq. It only reads and writes local files.

## Install

```bash
npm install @paladini/lattes-parser
```

## License

MIT
