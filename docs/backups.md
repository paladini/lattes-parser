# Backups automáticos

## Quando o backup roda

Antes de **sobrescrever** um arquivo XML de currículo existente:

- `writeCurriculum(cv, path)` (padrão `backup: true`)
- CLI `lattes-toolkit set …`
- CLI `lattes-toolkit serialize … -o arquivo.xml` (se o destino já existir)

Se o arquivo destino **não existe**, nenhum backup é criado.

## Onde ficam

Diretório padrão: **`.lattes-backup/`** ao lado do arquivo editado.

Layout:

```
.lattes-backup/
  2026-04-05T13-45-00-000Z/
    curriculo.xml
    manifest.json
```

`manifest.json` inclui caminho original, timestamp, SHA-256 e opcionalmente `curriculumId`.

## Configuração

- **`LATTES_TOOLKIT_BACKUP_DIR`**: caminho absoluto ou relativo para a raiz dos snapshots, no lugar de `.lattes-backup` ao lado do arquivo. Se essa variável não existir, `LATTES_PARSER_BACKUP_DIR` ainda é lida.
- Retenção padrão: **20** snapshots mais recentes por raiz de backup (`DEFAULT_RETENTION` na API).

## Comandos CLI

```bash
lattes-toolkit backup list
lattes-toolkit backup list ./meu-projeto
lattes-toolkit restore --last
lattes-toolkit restore 2026-04-05T13-45-00-000Z
```

`restore` grava de volta no `sourcePath` registrado no manifest (com backup prévio do estado atual).

## Git

Adicione `.lattes-backup/` ao `.gitignore` do seu projeto — snapshots são locais, não versionados.

## API

```ts
import { backupBeforeWrite, listBackups, restoreLatestBackup } from "@paladini/lattes-toolkit";
```
