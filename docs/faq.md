---
title: Perguntas frequentes
description: Toolkit para parsear e editar XML do Currículo Lattes via CLI ou agentes de IA.
---

# Perguntas frequentes

## Como atualizo meu currículo com este pacote?

Exporte o XML na Plataforma Lattes, edite os campos com a CLI, TypeScript ou um agente de IA (patches com allowlist) e importe o arquivo de volta na Plataforma Lattes.

## Posso usar agentes de IA automatizados?

Sim. Use `readCurriculum`, `applyCurriculumPatches` com allowlist e `writeCurriculum`. Veja [Agentes de IA](./integracao-ia.md). A importação na Plataforma Lattes continua manual.

## A biblioteca envia o XML ao CNPq sozinha?

Não. Ela lê e grava arquivos locais. A importação do XML é feita por você na Plataforma Lattes.

## Preciso do número Lattes (16 dígitos)?

Não, se você já tem o XML exportado. O ID vem no arquivo.

## O que é `unmapped`?

Tags do XML que ainda não têm tipo dedicado. Elas são preservadas no serialize.

## Como desfazer uma edição no arquivo?

```bash
lattes-toolkit restore --last
```

Ver [Backups](./backups.md). Isso não altera o currículo já salvo na Plataforma Lattes.

## É produto do CNPq?

Não. Projeto open source independente (MIT).
