---
title: Importar XML no Lattes
description: Enviar o XML editado na Plataforma Lattes (Importar XML), conformidade com a DTD e revisão antes de salvar.
---

# Importar XML na Plataforma Lattes

Depois de editar o arquivo com este toolkit, você **reimporta manualmente** na Plataforma. O envio do arquivo é feito **por você**, logado na UI — a biblioteca não faz upload.

## Passo a passo na UI

1. Acesse [Plataforma Lattes](https://lattes.cnpq.br/) e abra **Atualizar currículo** (login).
2. No menu, use **Importar** → **Importar XML** (ou equivalente na UI atual).
3. **Passo 1 — enviar arquivo:** selecione o `.xml` gerado localmente (`writeCurriculum`, CLI `set`, ou `serialize -o`).
4. A UI exige que o arquivo esteja de acordo com a **DTD do Currículo Lattes** (exports típicos e saída deste toolkit seguem `ISO-8859-1` e estrutura `CURRICULO-VITAE`).
5. Clique em **Enviar** e siga os passos seguintes do assistente (revisão, confirmação).
6. **Revise** o que a plataforma propõe alterar ou incorporar e **salve** / envie ao CNPq conforme a UI.

Nomes de botões podem mudar entre versões; o fluxo essencial é **escolher arquivo → enviar → revisar → confirmar**.

## O que este toolkit garante no arquivo

- Declaração `ISO-8859-1` e árvore `CURRICULO-VITAE` coerente com exports típicos.
- **Round-trip** no disco: parse + serialize preserva `unmapped` e campos tipados sincronizados, salvo edições que você fez.
- **Backup** local antes de sobrescrever — [backups.md](./backups.md).

## Expectativas realistas (CNPq)

- A importação pode **mesclar** ou incorporar itens; não trate como substituir 100% do banco por um dump.
- Tags fora do esperado ou ordem diferente podem ser ignoradas ou exigir revisão.
- Sempre confira na UI antes de confirmar.

## Boas práticas

- Mantenha export anterior e snapshots em `.lattes-backup/`.
- Após importar, **exporte de novo** e compare seções críticas (ou use `parse` localmente).
- Não anexe XML real de terceiros em issues.

## Relacionado

- [Ciclo de trabalho](./ciclo-de-trabalho.md)
- [Limitações](./limitacoes.md)
- [FAQ](./faq.md)
