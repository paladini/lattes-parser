---
layout: home
title: Toolkit XML Currículo Lattes
description: "Toolkit para parsear e editar o XML do Currículo Lattes de maneira programática, permitindo fazer edições no seu Lattes via CLI ou Agentes de IA automatizados."
hero:
  name: Lattes XML Toolkit
  text: Parse e edição programática do XML
  tagline: CLI, TypeScript ou agentes de IA automatizados. Round-trip no arquivo e Importar XML na Plataforma.
  image:
    src: /favicon.svg
    alt: Lattes XML Toolkit
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
    details: parse, get, set e serialize para edições scriptadas.
  - icon: 🤖
    title: Agentes de IA
    details: applyCurriculumPatches com allowlist; você valida e importa o XML na Plataforma.
  - icon: 📤
    title: Importar XML
    details: Último passo manual na Plataforma Lattes após editar o arquivo.
---

## Instalar

```bash
npm install @paladini/lattes-parser
```

## Links

- [Ciclo de trabalho](./ciclo-de-trabalho.md)
- [Importar XML](./importacao-lattes.md)
- [FAQ](./faq.md)
