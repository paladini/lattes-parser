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

Arquivo opcional `lattes.config.json`, procurado a partir da pasta do XML e subindo até a raiz do disco. Sem rede e sem download.

```json
{
  "backupDir": "snapshots",
  "retention": 20
}
```

- `backupDir`: absoluto, ou relativo à pasta do XML. Sem config, continua `.lattes-backup/` ao lado do arquivo.
- `retention`: quantos snapshots daquele XML guardar. Ao passar do limite, os mais antigos **daquele arquivo** são apagados. Snapshots de outro XML no mesmo diretório ficam.
- Quem não tem o arquivo mantém o padrão: `.lattes-backup/` e 20 snapshots.
- **`LATTES_TOOLKIT_BACKUP_DIR`** ainda vence o `backupDir` do config. Se essa variável não existir, `LATTES_PARSER_BACKUP_DIR` ainda é lida. Um `backupDir` passado na API vence os dois.

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
