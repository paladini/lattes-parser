---
title: Ciclo de trabalho
description: Exportar XML, editar de forma programática (CLI, TypeScript ou agentes de IA), Importar XML na Plataforma.
---

# Ciclo de trabalho

Passos para editar o currículo fora dos formulários web e publicar via Importar XML.

## 1. Exportar (manual)

1. Acesse a Plataforma com login.
2. Abra seu currículo.
3. Use **Exportar** / **Exportar currículo** (XML), conforme a UI atual.

Guia complementar: [como-obter-o-xml.md](./como-obter-o-xml.md).

Salve o arquivo em uma pasta de trabalho (ex.: `./meu-lattes/curriculo.xml`).

## 2. Preparar o workspace (opcional)

```bash
lattes-parser init
```

Cria `.lattes-backup/` ao lado dos arquivos que você editar (ou na raiz indicada).

## 3. Inspecionar e editar (local)

```bash
lattes-parser parse curriculo.xml
lattes-parser get curriculo.xml identification.fullName
lattes-parser set curriculo.xml identification.summary "Novo texto"
```

Em TypeScript: `readCurriculum`, `setCurriculumValue`, `writeCurriculum`.

Cada gravação que substitui o XML dispara backup. Ver [backups.md](./backups.md).

## 4. Reimportar (manual)

1. Na Plataforma: **Importar** → **Importar XML**.
2. **Passo 1, enviar arquivo:** selecione o XML editado (DTD do Currículo Lattes) e **Enviar**.
3. Siga o assistente, **revise** alterações propostas e **salve** / envie ao CNPq.

Detalhes: [importacao-lattes.md](./importacao-lattes.md).

A UI pode **mesclar** dados; não trate como “substituir 100% do servidor”. Detalhes: [importacao-lattes.md](./importacao-lattes.md).

## 5. Rollback local

Se a edição local ficou errada antes de reimportar:

```bash
lattes-parser restore --last
```

Isso não desfaz alterações já salvas na Plataforma; só o arquivo local.
