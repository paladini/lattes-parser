# Como obter o XML (fora desta biblioteca)

O `@paladini/lattes-parser` **não baixa** currículo na internet. Você precisa de um arquivo **já exportado**. Estes são os caminhos mais comuns:

## Export manual (pesquisador)

1. Acesse a [Plataforma Lattes](https://lattes.cnpq.br/) com login.
2. **Atualizar currículo** → **Exportar** → **XML** → **Confirmar**.
3. Salve o arquivo (`.xml` ou `.zip`, conforme o navegador).

Use esse arquivo com `parseCurriculum()` ou `readCurriculum()`.

## Arquivo da instituição (Extrator Lattes)

Universidades credenciadas podem baixar XML/ZIP via **Extrator Lattes** (SOAP, IP fixo). A biblioteca pode parsear o ZIP retornado por `getCurriculoCompactado`; o download em si exige credenciamento — veja [extrator.md](./extrator.md).

## O que evitar

- Automatizar o site público (CAPTCHA, termo de uso).
- Enviar XML de terceiros em issues ou PRs (LGPD).

Com o arquivo salvo, use `parseCurriculum()` ou `readCurriculum()`.
