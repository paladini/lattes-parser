---
title: Ciclo de trabalho
description: Exportar o XML na Plataforma Lattes, editar os campos e importar o arquivo de volta.
---

# Ciclo de trabalho

O uso passa por exportação e importação na Plataforma Lattes. O toolkit lê e grava os campos no XML, neste computador.

## 1. Exportar (manual)

1. Acesse a Plataforma Lattes com login.
2. Abra seu currículo.
3. Use **Exportar** / **Exportar currículo** (XML), conforme a UI atual.

Guia complementar: [como-obter-o-xml.md](./como-obter-o-xml.md).

Salve o arquivo em uma pasta de trabalho (ex.: `./meu-lattes/curriculo.xml`).

## 2. Preparar o workspace (opcional)

```bash
lattes-toolkit init
```

Cria `.lattes-backup/` ao lado dos arquivos que você editar (ou na raiz indicada).

## 3. Inspecionar e editar (local)

```bash
lattes-toolkit parse curriculo.xml
lattes-toolkit get curriculo.xml identification.fullName
lattes-toolkit set curriculo.xml identification.summary "Novo texto"
```

Em TypeScript: `readCurriculum`, `setCurriculumValue`, `writeCurriculum`.

Cada gravação que substitui o XML dispara backup. Ver [backups.md](./backups.md).

## 4. Reimportar (manual)

1. Na Plataforma Lattes: **Importar** → **Importar XML**.
2. **Passo 1, enviar arquivo:** selecione o XML editado (DTD do Currículo Lattes) e **Enviar**.
3. Siga o assistente, **revise** alterações propostas e **salve** / envie ao CNPq.

Detalhes: [importacao-lattes.md](./importacao-lattes.md).

A UI pode **mesclar** dados; não trate como “substituir 100% do servidor”. Detalhes: [importacao-lattes.md](./importacao-lattes.md).

## 5. Rollback local

Se a edição local ficou errada antes de reimportar:

```bash
lattes-toolkit restore --last
```

Isso não desfaz alterações já salvas na Plataforma Lattes; só o arquivo local.
