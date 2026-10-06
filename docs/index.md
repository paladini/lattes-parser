---
layout: home
title: Editar XML do Currículo Lattes
description: "Toolkit para ler e gravar campos do Currículo Lattes no XML exportado, por código, CLI ou agente de IA."
hero:
  name: lattes-toolkit
  text: Leitura e gravação de campos no XML
  tagline: Exporte na Plataforma Lattes, edite aqui e importe o XML de volta.
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
    details: XML exportado vira TypeScript; ao gravar, os campos tipados editados são escritos no arquivo e o restante permanece em unmapped.
  - icon: 🛠️
    title: CLI
    details: lattes-toolkit parse, get, set, patch, validate e serialize no arquivo local.
  - icon: 🤖
    title: Agentes de IA
    details: applyCurriculumPatches com allowlist. Depois você importa o XML na Plataforma Lattes.
  - icon: 📤
    title: Exportar e importar
    details: Você exporta o XML na Plataforma Lattes, edita os campos e importa o arquivo de volta.
---

## Instalar

```bash
npm install @paladini/lattes-toolkit
```

## Links

- [Ciclo de trabalho](./ciclo-de-trabalho.md)
- [Importar XML](./importacao-lattes.md)
- [FAQ](./faq.md)
