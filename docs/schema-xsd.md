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

[`test/fixtures/curriculum-real-anonymized.xml`](https://github.com/paladini/lattes-toolkit/blob/main/test/fixtures/curriculum-real-anonymized.xml) espelha um export real, com nome, resumo, data de nascimento, data de emissão e CEP em valores sintéticos. Gere de novo com:

```bash
npx tsx scripts/anonymize-curriculum-xml.ts
```

(coloque o export local em `DEFINITIONS/Definitions_Lattes_Curriculum_*.xml` antes de rodar.)
