---
title: Perguntas frequentes
description: Dúvidas sobre editar XML do Currículo Lattes localmente, reimportar na Plataforma, backups e limites do CNPq.
---

# Perguntas frequentes

## Posso atualizar meu Lattes editando o XML e reenviando?

**Sim — esse é o fluxo previsto.** A Plataforma Lattes oferece **Exportar** e **Importar XML**. Você:

1. Exporta o XML (com login).
2. Edita localmente com `@paladini/lattes-parser` (CLI ou TypeScript).
3. Usa **Importar XML** no site, **revisa** o que a plataforma propõe alterar e **salva**.

Este toolkit prepara o arquivo e cria **backup** antes de sobrescrever. **Enviar o arquivo ao CNPq continua sendo você**, na interface web.

## A biblioteca substitui editar no site?

Não totalmente. Ela brilha quando você quer **muitas alterações**, scripts, diff ou integração com código. A **confirmação final** e a **importação** ficam na Plataforma.

## A importação substitui 100% do currículo no servidor?

**Não necessariamente.** A UI pode **mesclar** ou incorporar itens. Trate o XML como fonte de verdade **local**; após importar, confira seção por seção. Detalhes: [Importar no Lattes](./importacao-lattes.md).

## Preciso do número Lattes (16 dígitos) para editar meu arquivo?

**Não no fluxo por arquivo.** Basta o XML exportado. O ID já está dentro do arquivo. O Extrator institucional é outro caminho (opcional).

## Quais campos posso editar?

- Campos **tipados** (resumo, nome, produções mapeadas, etc.) via `get`/`set` ou API.
- Qualquer tag ainda não tipada permanece em **`unmapped`** e volta no serialize (round-trip no arquivo).

Mapa: [Cobertura de campos](./cobertura-campos.md).

## E se eu errar a edição?

Use backup local:

```bash
lattes-parser restore --last
```

Veja [Backups](./backups.md). Isso **não desfaz** alterações já salvas na Plataforma.

## É oficial do CNPq?

**Não.** Projeto **independente**, open source (MIT). Marcas Lattes/CNPq referem-se aos serviços públicos.

## O toolkit baixa currículo de outras pessoas?

**Não** por scraping ou busca pública. Só lê arquivos que **você** (ou sua instituição via Extrator) já possui.

## Onde reportar bug ou gap de parse?

[Issues no GitHub](https://github.com/paladini/lattes-parser/issues) — use templates; **não** anexe XML real de terceiros.
