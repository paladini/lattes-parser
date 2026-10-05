---
title: Perguntas frequentes
description: Toolkit para parsear e editar XML do Currículo Lattes via CLI ou agentes de IA.
---

# Perguntas frequentes

## Como atualizo meu currículo com este pacote?

Exporte o XML na Plataforma Lattes, edite o arquivo com a CLI, TypeScript ou um agente de IA (patches com allowlist), depois use **Importar XML** no site e confirme.

## Posso usar agentes de IA automatizados?

Sim. Use `readCurriculum`, `applyCurriculumPatches` com allowlist e `writeCurriculum`. Veja [Agentes de IA](./integracao-ia.md). O envio à Plataforma continua manual.

## A biblioteca envia o XML ao CNPq sozinha?

Não. Ela grava arquivos locais. O envio é feito por você na Plataforma (Importar XML).

## Preciso do número Lattes (16 dígitos)?

Não, se você já tem o XML exportado. O ID vem no arquivo.

## O que é `unmapped`?

Tags do XML que ainda não têm tipo dedicado. Elas são preservadas no serialize.

## Como desfazer uma edição no arquivo?

```bash
lattes-toolkit restore --last
```

Ver [Backups](./backups.md). Isso não altera o currículo já salvo na Plataforma.

## É produto do CNPq?

Não. Projeto open source independente (MIT).
