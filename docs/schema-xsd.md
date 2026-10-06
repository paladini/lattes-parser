---
title: Schema XSD no repositório
description: Como usar o XSD CurriculoLattes 12/09/2022, validação e diferença em relação à importação na Plataforma Lattes.
---

# Schema XSD

O arquivo [`DEFINITIONS/xml_cvbase_src_main_resources_CurriculoLattes_12_09_2022.xsd`](https://github.com/paladini/lattes-toolkit/blob/main/DEFINITIONS/xml_cvbase_src_main_resources_CurriculoLattes_12_09_2022.xsd) é a referência de schema usada pelo toolkit para alinhar parse, sync e validação.

Referência oficial CNPq: [Portal Memória - Extração de dados](https://memoria.cnpq.br/web/portal-lattes/extracoes-de-dados).

## Validar um XML

```bash
lattes-toolkit validate curriculo.xml
```

Usa `xmllint --schema` quando disponível. Se `xmllint` não estiver instalado, o comando informa `skipped` em vez de falhar o fluxo local.

O pacote publicado inclui esse XSD. A validação procura `DEFINITIONS/` no diretório atual e, se o arquivo não estiver lá, usa o schema que vem junto com o pacote.

O XSD versionado é o de 12/09/2022, com quatro atributos que o export atual da plataforma já envia e aquele arquivo original não declarava: `PCD` em `DADOS-GERAIS`, e `ELETRONICO`, `OUTRA-FORMA-DE-CONTATO` e `REDE-SOCIAL` em `ENDERECO`. Sem isso, `xmllint` recusa o fixture anonimizado. A tela Importar XML ainda valida por DTD, não por este XSD.

Na API:

```ts
import { validateCurriculumXml } from "@paladini/lattes-toolkit";

const result = validateCurriculumXml(xmlString);
```

`writeCurriculum(cv, path, { validate: true })` valida antes de gravar (falha se `xmllint` ausente).

## DTD (Plataforma Lattes) vs XSD (Extrator)

A UI **Importar XML** exige conformidade com a **DTD** do currículo. O XSD do Extrator é a gramática mais completa para integração e testes neste projeto. Passar na validação XSD **não garante** aceite na UI, mas reduz erros estruturais.

Histórico DTD / ontologia: [CONSCIENTIAS-LMPL](http://lmpl.cnpq.br/lmpl/?go=cv.jsp).

## Convenções comuns

| Padrão | Exemplo |
| --- | --- |
| Datas | `DDMMAAAA` em atributos como `DATA-ATUALIZACAO` |
| Flags | `SIM` / `NAO` |
| Autores | Vários elementos irmãos `<AUTORES .../>` (atributos no próprio elemento) |
| Raiz | `SISTEMA-ORIGEM-XML="LATTES_OFFLINE"` |

## Fixture anonimizada

[`test/fixtures/curriculum-real-anonymized.xml`](https://github.com/paladini/lattes-toolkit/blob/main/test/fixtures/curriculum-real-anonymized.xml) espelha um export real, com identificador Lattes (`NUMERO-IDENTIFICADOR` e `NRO-ID-CNPQ`), nome, resumo, data de nascimento, data de emissão e CEP em valores sintéticos. Gere de novo com:

```bash
npx tsx scripts/anonymize-curriculum-xml.ts
```

(coloque o export local em `DEFINITIONS/Definitions_Lattes_Curriculum_*.xml` antes de rodar.)
