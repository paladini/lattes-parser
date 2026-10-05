---
layout: home
title: Editar XML do Currículo Lattes
description: "Toolkit para editar o XML exportado do Currículo Lattes de maneira programática, via CLI ou agentes de IA."
hero:
  name: lattes-toolkit
  text: Edição programática do XML exportado
  tagline: CLI, TypeScript ou agentes de IA. Você importa o arquivo na Plataforma.
  image:
    src: /favicon.svg
    alt: lattes-toolkit
  actions:
    - theme: brand
      text: Ciclo de trabalho
      link: /ciclo-de-trabalho
    - theme: alt
      text: Agentes de IA
      link: /integracao-ia
features:
  - icon: 📄
    title: Parse e serialize
    details: XML exportado vira TypeScript e volta ao disco com round-trip e unmapped preservado.
  - icon: 🛠️
    title: CLI
    details: lattes-toolkit parse, get, set e serialize no arquivo local.
  - icon: 🤖
    title: Agentes de IA
    details: applyCurriculumPatches com allowlist; você valida e importa o XML na Plataforma.
  - icon: 📤
    title: Importar XML
    details: Último passo manual na Plataforma Lattes após editar o arquivo.
---

## Instalar

```bash
npm install @paladini/lattes-toolkit
```

## Links

- [Ciclo de trabalho](./ciclo-de-trabalho.md)
- [Importar XML](./importacao-lattes.md)
- [FAQ](./faq.md)
