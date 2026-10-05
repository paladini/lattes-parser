---
title: Perguntas frequentes
description: Automatizar Currículo Lattes com XML, CLI, TypeScript e skills de IA.
---

# Perguntas frequentes

## Consigo automatizar a atualização do meu Lattes?

**Sim, a parte operacional.** Exporte o XML, deixe scripts ou uma skill de IA aplicarem dezenas de mudanças com backup e allowlist, gere o XML final e use **Importar XML** na Plataforma. Você revisa uma vez na UI em vez de repetir formulários.

## O que a biblioteca automatiza?

Parse, diff mental entre exports, edição em lote (`set`, patches), serialize, backups. Tudo no arquivo e no seu pipeline Node.js.

## O que continua humano?

Login na Plataforma e o clique em **Importar XML → Enviar → confirmar**. A lib não guarda sua senha nem simula browser (e não deve).

## Funciona com Cursor / agentes de IA?

Sim. Contrato em [Integração com IA](./integracao-ia.md): `readCurriculum`, `applyCurriculumPatches` com allowlist, `writeCurriculum`, re-parse para validar.

## Preciso do ID Lattes de 16 dígitos?

Não para o fluxo por arquivo. O XML exportado já traz o identificador.

## E campos que o parser ainda não tipou?

Ficam em `unmapped` e voltam no serialize. Cobertura cresce; mapa em [Cobertura de campos](./cobertura-campos.md).

## Desfazer edição local

```bash
lattes-parser restore --last
```

Ver [Backups](./backups.md).

## É oficial do CNPq?

Não. Toolkit open source independente (MIT).
