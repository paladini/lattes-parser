---
layout: home
title: Editar XML do Currículo Lattes localmente
description: Exporte o XML na Plataforma Lattes, edite com CLI ou TypeScript com backup automático e reimporte manualmente. Toolkit open source não afiliado ao CNPq.
hero:
  name: Lattes XML Toolkit
  text: Edite o currículo no arquivo, reimporte na Plataforma
  tagline: Exportar → parse → editar → serialize → Importar XML (manual). Backups em .lattes-backup/
  image:
    src: /favicon.svg
    alt: Ícone do toolkit Lattes XML
  actions:
    - theme: brand
      text: Começar em 5 minutos
      link: /ciclo-de-trabalho
    - theme: alt
      text: Instalar no npm
      link: https://www.npmjs.com/package/@paladini/lattes-parser
features:
  - icon: 🔄
    title: Ciclo completo local
    details: Leia o XML exportado, altere campos tipados ou via unmapped, gere XML atualizado para reimportar.
  - icon: 💾
    title: Backup automático
    details: Antes de sobrescrever seu XML, snapshots versionados em .lattes-backup/ com restore pela CLI.
  - icon: 🛠️
    title: CLI e TypeScript
    details: lattes-parser set, get, parse ou writeCurriculum no seu script — sem digitar ID Lattes no fluxo por arquivo.
  - icon: ⚖️
    title: Projeto independente
    details: Não é produto do CNPq. Respeite termos de uso e LGPD; export/import na Plataforma permanecem humanos.
---

## Resumo para busca e assistentes (GEO)

> **O que é:** `@paladini/lattes-parser` é um toolkit Node.js/TypeScript para **editar localmente** o XML do Currículo Lattes exportado da Plataforma CNPq.
>
> **Fluxo:** (1) você **exporta** o XML com login na Plataforma; (2) edita com **CLI** (`lattes-parser set`) ou **código** (`writeCurriculum`); (3) **reimporta** o mesmo arquivo em **Importar XML**, revisa e salva.
>
> **O que não faz:** login automático, CAPTCHA, download público em massa ou upload automático ao CNPq.

## Instalação rápida

```bash
npm install @paladini/lattes-parser
npx lattes-parser init
npx lattes-parser set curriculo.xml identification.summary "Novo resumo"
```

Depois, reimporte `curriculo.xml` na Plataforma Lattes.

## Próximos passos

- [Ciclo de trabalho](./ciclo-de-trabalho.md) — passo a passo export → edit → import
- [Importar XML no Lattes](./importacao-lattes.md) — o que esperar da UI de merge
- [FAQ](./faq.md) — dúvidas comuns
- [Referência CLI](./cli.md)
