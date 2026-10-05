# Limitações e conformidade

## Escopo principal: parser offline

`@paladini/lattes-parser` existe para **ler arquivos que você já possui**:

- XML exportado manualmente na Plataforma Lattes
- ZIP/XML obtido por processo institucional (Extrator)

O fluxo típico é: **obter arquivo → parse → usar dados em seu sistema**. A biblioteca não participa da etapa “obter” quando isso exigiria navegador, login seu ou scraping público.

## O que a biblioteca faz

- Parse de XML oficial (`CURRICULO-VITAE`) para o tipo `Curriculum`
- Leitura de buffer/string, incluindo ZIP com um XML dentro
- Detecção de encoding (`ISO-8859-1`, etc.) e entidades XML
- Preservação de nós desconhecidos em `unmapped`
- (Opcional) Cliente SOAP para instituições com Extrator Lattes

## O que a biblioteca não faz

| Não faz | Por quê |
| --- | --- |
| Baixar currículo pela web pública | CAPTCHA, termo de uso, fragilidade |
| Login / editar currículo na Plataforma | Fora de escopo; use o site do CNPq |
| Consulta por CPF na v1 | Dado pessoal (LGPD) |
| Validação XSD completa | Schema grande e mutável; use `unmapped` + testes |
| Garantir 100% do schema | Best-effort; CNPq adiciona tags |

## Termos de uso

O termo da Plataforma Lattes proíbe robôs e coletores automáticos **sem permissão expressa do CNPq**. Não use esta biblioteca para contornar essas regras.

## Dados pessoais

Currículos contêm PII. Não abra issues com XML real de terceiros. Fixtures do repositório são **sintéticas**.

## Projeto independente

Sem vínculo ou endosso do CNPq. “Lattes” e “CNPq” referem-se aos serviços públicos correspondentes.
