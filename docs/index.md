---
layout: home
title: Automatize seu Currículo Lattes via XML
description: Parse, CLI, TypeScript e patches para IA no XML exportado do Lattes. Feche o ciclo com Importar XML na Plataforma.
hero:
  name: Lattes XML Toolkit
  text: Seu currículo como código, não como formulário infinito
  tagline: Exportar → automatizar localmente (CLI, TS, skill de IA) → Importar XML na Plataforma
  image:
    src: /favicon.svg
    alt: Lattes XML Toolkit
  actions:
    - theme: brand
      text: Ver o fluxo completo
      link: /ciclo-de-trabalho
    - theme: alt
      text: Integração com IA
      link: /integracao-ia
features:
  - icon: ⚡
    title: Automação local de verdade
    details: Parse tipado, CLI set/get, serialize com backup. Escale edições que a UI não aguenta.
  - icon: 🤖
    title: Pronto para skill de IA
    details: applyCurriculumPatches com allowlist. Seu agente edita o modelo; você valida e importa o XML.
  - icon: 💾
    title: Backups automáticos
    details: Cada gravação versionada em .lattes-backup/. Restore com um comando.
  - icon: 📦
    title: Round-trip no XML
    details: Campos tipados + unmapped. Nada some no serialize.
---

## Instalação

```bash
npm install @paladini/lattes-parser
npx lattes-parser init
npx lattes-parser set curriculo.xml identification.summary "Atualizado pelo meu script"
```

Depois: **Importar XML** na Plataforma Lattes (arquivo pronto, DTD ok).

## Links úteis

- [Ciclo de trabalho](./ciclo-de-trabalho.md)
- [Importar XML na UI](./importacao-lattes.md)
- [Referência CLI](./cli.md)
- [FAQ](./faq.md)
