---
title: Importar XML no Lattes
description: "Importar o XML editado na Plataforma Lattes (Importar XML, DTD, Enviar)."
---

# Importar XML na Plataforma Lattes

Depois de editar o XML no seu computador, envie o arquivo na Plataforma Lattes.

## Na interface

1. Login em [Plataforma Lattes](https://lattes.cnpq.br/) → **Atualizar currículo**.
2. **Importar** → **Importar XML**.
3. **Passo 1, enviar arquivo:** escolha o `.xml` gerado (`writeCurriculum`, CLI `set` ou `serialize -o`).
4. O sistema exige conformidade com a **DTD** do Currículo Lattes (saída deste toolkit segue export típico: `ISO-8859-1`, `CURRICULO-VITAE`).
5. **Enviar**, revisar o que a plataforma propõe alterar e **confirmar**.

## Checklist antes de importar

1. `lattes-toolkit validate curriculo.xml` (opcional; requer `xmllint`)
2. Conferir backup: `lattes-toolkit backup list`
3. Importar na Plataforma Lattes e revisar o diff proposto
4. Se algo falhar, `lattes-toolkit restore --last` no arquivo local

## Dica

Revise na UI antes de salvar. Depois, exporte de novo e compare com `parse` se quiser auditar.

## Relacionado

- [Ciclo de trabalho](./ciclo-de-trabalho.md)
- [Backups](./backups.md)
