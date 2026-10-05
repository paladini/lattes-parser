---
title: Referência CLI
description: Comandos lattes-parser — init, parse, get, set, serialize, backup list e restore para editar XML Lattes localmente.
---

# Referência CLI

Instalação global (opcional):

```bash
npm install -g @paladini/lattes-parser
```

Ou via `npx` sem instalar globalmente.

## Comandos

### `lattes-parser init [dir]`

Cria `.lattes-backup/` no diretório de trabalho.

### `lattes-parser parse <arquivo.xml|zip>`

Resumo JSON no stdout. Opções:

- `--json` — objeto `Curriculum` completo

### `lattes-parser get <arquivo> <caminho>`

Lê um campo com notação dot/bracket, por exemplo:

```bash
lattes-parser get curriculo.xml identification.summary
lattes-parser get curriculo.xml bibliographicProduction.journalArticles[0].title
```

### `lattes-parser set <arquivo> <caminho> <valor>`

Altera o campo, **serializa o XML** no mesmo arquivo e cria **backup** se o arquivo já existia.

```bash
lattes-parser set curriculo.xml identification.summary "Novo resumo profissional."
```

Valores JSON (objetos/arrays) podem ser passados como string JSON.

### `lattes-parser serialize <curriculo.json> -o <saida.xml>`

Converte JSON `Curriculum` (com `document`) em XML. Backup se `saida.xml` já existir.

### `lattes-parser backup list [dir]`

Lista manifests em `.lattes-backup/`.

### `lattes-parser restore [--last|<id>] [dir]`

Restaura snapshot para o caminho original do manifest.

```bash
lattes-parser restore --last
lattes-parser restore 2026-04-05T13-45-00-000Z
```

## Fluxo típico

```bash
lattes-parser init
lattes-parser set meu.xml identification.summary "Texto atualizado"
# Reimportar meu.xml na Plataforma Lattes (Importar XML)
```

## Variáveis de ambiente

| Variável | Efeito |
| --- | --- |
| `LATTES_PARSER_BACKUP_DIR` | Raiz customizada para snapshots |

Mais: [Backups](./backups.md), [Ciclo de trabalho](./ciclo-de-trabalho.md).
