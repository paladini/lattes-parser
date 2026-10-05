---
title: Importar XML no Lattes
description: Como reimportar o XML editado na Plataforma Lattes, revisar merge na UI e boas práticas antes de salvar.
---

# Importar XML na Plataforma Lattes

Este documento descreve o fluxo **humano** na UI e expectativas realistas — não garantias do CNPq.

## Passo a passo (geral)

1. Login na Plataforma Lattes.
2. Abra a área de **Importar XML** / importação de currículo (nome exato pode variar com atualizações da UI).
3. Selecione o arquivo produzido por este toolkit (`writeCurriculum` ou CLI).
4. Revise **cada seção** que a plataforma propõe alterar ou adicionar.
5. Confirme e **salve**.

## O que este toolkit garante do lado do arquivo

- XML com declaração `ISO-8859-1` coerente com exports típicos.
- **Round-trip lossless** no arquivo: o que foi parseado (incluindo `unmapped`) é reemitido no serialize, salvo mudanças que você fez nos campos tipados.
- Backups locais antes de sobrescrever — ver [backups.md](./backups.md).

## O que a Plataforma pode fazer (limitações)

- **Mesclar** itens em vez de substituir todo o currículo por um dump.
- Ignorar ou reinterpretar tags desconhecidas ou fora de ordem.
- Exigir revisão manual antes de persistir.
- Comportamento diferente entre versões da UI.

Feedback da comunidade ajuda a documentar casos reais — abra uma issue com descrição **sem anexar XML de terceiros**.

## Boas práticas

- Teste primeiro com uma **cópia** do XML e importação em ambiente controlado, se sua instituição permitir.
- Mantenha export anterior e backups `.lattes-backup/`.
- Após importar, exporte de novo e compare seções críticas.

## Relacionado

- [ciclo-de-trabalho.md](./ciclo-de-trabalho.md)
- [limitacoes.md](./limitacoes.md)
