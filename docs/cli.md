---
title: Referência CLI
description: "Comandos do lattes-toolkit: init, parse, get, set, serialize, backup list e restore para editar XML Lattes localmente."
---

# Referência CLI

Instalação global (opcional):

```bash
npm install -g @paladini/lattes-toolkit
```

Ou via `npx` sem instalar globalmente.

## Comandos

### `lattes-toolkit init [dir]`

Cria `.lattes-backup/` no diretório de trabalho.

### `lattes-toolkit parse <arquivo.xml|zip>`

Resumo JSON no stdout. Opções:

- `--json` — objeto `Curriculum` completo

### `lattes-toolkit get <arquivo> <caminho>`

Lê um campo com notação dot/bracket, por exemplo:

```bash
lattes-toolkit get curriculo.xml identification.summary
lattes-toolkit get curriculo.xml bibliographicProduction.journalArticles[0].title
```

### `lattes-toolkit set <arquivo> <caminho> <valor>`

Altera o campo, **serializa o XML** no mesmo arquivo e cria **backup** se o arquivo já existia.

```bash
lattes-toolkit set curriculo.xml identification.summary "Novo resumo profissional."
```

Valores JSON (objetos/arrays) podem ser passados como string JSON.

### `lattes-toolkit serialize <curriculo.json> -o <saida.xml>`

Converte JSON `Curriculum` (com `document`) em XML. Backup se `saida.xml` já existir.

### `lattes-toolkit backup list [dir]`

Lista manifests em `.lattes-backup/`.

### `lattes-toolkit restore [--last|<id>] [dir]`

Restaura snapshot para o caminho original do manifest.

```bash
lattes-toolkit restore --last
lattes-toolkit restore 2026-04-05T13-45-00-000Z
```

## Fluxo típico

```bash
lattes-toolkit init
lattes-toolkit set meu.xml identification.summary "Texto atualizado"
# Reimportar meu.xml na Plataforma Lattes (Importar XML)
```

## Variáveis de ambiente

| Variável | Efeito |
| --- | --- |
| `LATTES_TOOLKIT_BACKUP_DIR` | Raiz customizada para snapshots. `LATTES_PARSER_BACKUP_DIR` ainda vale se a variável nova não existir. |

Mais: [Backups](./backups.md), [Ciclo de trabalho](./ciclo-de-trabalho.md).
