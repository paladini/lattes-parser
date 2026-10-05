---
title: Importar XML no Lattes
description: "Último passo do fluxo automatizado - enviar o XML editado na Plataforma (Importar XML, DTD, Enviar)."
---

# Importar XML na Plataforma Lattes

Depois da automação local, você **fecha o ciclo** na UI oficial. É rápido: um arquivo substitui muitas telas de formulário.

## Na interface

1. Login em [Plataforma Lattes](https://lattes.cnpq.br/) → **Atualizar currículo**.
2. **Importar** → **Importar XML**.
3. **Passo 1, enviar arquivo:** escolha o `.xml` gerado (`writeCurriculum`, CLI `set` ou `serialize -o`).
4. O sistema exige conformidade com a **DTD** do Currículo Lattes (saída deste toolkit segue export típico: `ISO-8859-1`, `CURRICULO-VITAE`).
5. **Enviar**, revisar o que a plataforma propõe alterar e **confirmar**.

## Dica

Revise na UI antes de salvar. Depois, exporte de novo e compare com `parse` se quiser auditar.

## Relacionado

- [Ciclo de trabalho](./ciclo-de-trabalho.md)
- [Backups](./backups.md)
