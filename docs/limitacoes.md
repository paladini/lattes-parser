# Limitações e conformidade

## Escopo principal: toolkit XML local

`@paladini/lattes-toolkit` opera em **arquivos que você já possui**:

- XML exportado manualmente na Plataforma Lattes
- ZIP/XML obtido por processo institucional (Extrator)

Fluxo de produto: **exportar o XML na Plataforma Lattes → ler e gravar campos → importar o XML na Plataforma Lattes**. Exportação e importação são feitas por você. Guia da UI: [importacao-lattes.md](./importacao-lattes.md).

## O que a biblioteca faz

- Parse do formato XML da Plataforma Lattes (`CURRICULO-VITAE`) para o tipo `Curriculum`
- **Serialize** de volta para XML com round-trip via `document` + `unmapped`
- **Backup** automático antes de sobrescrever XML (`.lattes-backup/`)
- CLI workspace: `init`, `parse`, `get`, `set`, `serialize`, `validate`, `patch`, `restore`, `backup list`
- Leitura de buffer/string, incluindo ZIP com um XML dentro
- Detecção de encoding (`ISO-8859-1`, etc.) e entidades XML
- Preservação de nós desconhecidos em `unmapped`
- Patches com allowlist (`applyCurriculumPatches`) para edição em lote
- (Opcional) Cliente SOAP para instituições com Extrator Lattes
- XML pronto para você importar na Plataforma Lattes (revisão na UI)

## O que a biblioteca não faz

| Não faz | Por quê |
| --- | --- |
| Baixar currículo pela web pública | CAPTCHA, termo de uso, fragilidade |
| Login automático ou clicar **Enviar** no Importar XML por você | Fora de escopo; você faz na Plataforma Lattes após editar o arquivo |
| Upload automático / bot na UI do CNPq | Fora de escopo |
| Consulta por CPF na v1 | Dado pessoal (LGPD) |
| Validação XSD garantida em todo ambiente | Requer `xmllint`; a UI da Plataforma Lattes usa DTD |
| Garantir 100% do schema | Best-effort; CNPq adiciona tags |

## Termos de uso

O termo da Plataforma Lattes proíbe robôs e coletores automáticos **sem permissão expressa do CNPq**. Não use esta biblioteca para contornar essas regras.

## Dados pessoais

Currículos contêm PII. Não abra issues com XML real de terceiros. Fixtures do repositório são **sintéticas**.

## Projeto independente

Sem vínculo ou endosso do CNPq. “Lattes” e “CNPq” referem-se aos serviços públicos correspondentes.
