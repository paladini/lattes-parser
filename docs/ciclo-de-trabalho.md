---
title: Ciclo de trabalho
description: Exportar XML do Currículo Lattes, editar localmente com CLI ou TypeScript, reimportar na Plataforma e usar backups.
---

# Ciclo de trabalho

Este toolkit assume que **você** controla exportação e importação na [Plataforma Lattes](https://lattes.cnpq.br/).

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

Cada gravação que substitui o XML dispara backup — ver [backups.md](./backups.md).

## 4. Reimportar (manual)

1. Na Plataforma: **Importar XML**.
2. Selecione o XML gerado (o mesmo arquivo editado ou um `-o` explícito).
3. **Revise** o que a UI propõe incorporar e **salve**.

A UI pode **mesclar** dados; não trate como “substituir 100% do servidor”. Detalhes: [importacao-lattes.md](./importacao-lattes.md).

## 5. Rollback local

Se a edição local ficou errada antes de reimportar:

```bash
lattes-parser restore --last
```

Isso não desfaz alterações já salvas na Plataforma — apenas o arquivo local.
