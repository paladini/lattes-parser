# @paladini/lattes-parser

**Offline TypeScript parser** for official Brazilian *Currículo Lattes* XML (and Extrator ZIP files).

You obtain the file yourself (platform export or institutional Extrator). This package **parses** it into a typed `Curriculum` object. It does **not** scrape the public website, bypass CAPTCHA, or log into Lattes.

```bash
npm install @paladini/lattes-parser
```

```ts
import { parseCurriculum, readCurriculum } from "@paladini/lattes-parser";
```

See the [Portuguese README](./README.md) for full docs, limitations, and Extrator notes.

## License

MIT
