# Schema Lattes (XSD)

- [`xml_cvbase_src_main_resources_CurriculoLattes_12_09_2022.xsd`](./xml_cvbase_src_main_resources_CurriculoLattes_12_09_2022.xsd): XML Schema do Currículo Lattes (Extrator CNPq, 12/09/2022).

Exports pessoais (`Definitions_Lattes_Curriculum_*.xml`) ficam fora do Git (ver `.gitignore`). Para testes use [`test/fixtures/curriculum-real-anonymized.xml`](../test/fixtures/curriculum-real-anonymized.xml).

Validação opcional: `lattes-toolkit validate arquivo.xml` (requer `xmllint` no PATH).
