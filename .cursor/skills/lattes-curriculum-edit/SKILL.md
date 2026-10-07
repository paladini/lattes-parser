---
name: lattes-curriculum-edit
description: >-
  Edit an exported Lattes curriculum XML with lattes-toolkit. Changes a job
  title or bond text, adds or removes a professional experience, and adds,
  edits, or removes formal education and complementary courses. Use when the
  user mentions emprego, experiência profissional, atuação, cargo, curso,
  formação, graduação, or updating a Lattes XML. Academic papers are out of
  the default scope.
---

# Edição de currículo Lattes

Projeto independente. Formato XML da plataforma. Não fazer login no CNPq, CAPTCHA, scraping nem upload. A pessoa importa o XML na Plataforma Lattes.

Foco: experiência profissional e cursos/formação. Produção bibliográfica, técnica e artística só entra se a pessoa pedir explicitamente.

Paths e allowlist: [fields.md](fields.md). Exemplos de patch: [examples.md](examples.md).

## Fluxo

1. Confirmar o caminho do XML exportado. Não commitar esse arquivo.
2. Ler com `readCurriculum` ou `lattes-toolkit parse arquivo.xml --json`.
3. Achar o item por instituição, cargo e anos. Não assumir índice `0`.
4. Aplicar `applyCurriculumPatches` ou `lattes-toolkit patch arquivo.xml patches.json` com allowlist de path exato.
5. Gravar com `writeCurriculum` (backup ligado). A CLI já faz backup. Passar `sections: sectionsFromPatchPaths(...)`.
6. Ler o arquivo de novo e mostrar o que mudou (`lattes-toolkit diff` contra o snapshot, se existir).
7. A importação fica com a pessoa.

`set` e `patch` da CLI sincronizam só a seção do path. Array vazio nessa seção apaga o bloco XML correspondente.

## Experiência profissional

Lista: `professionalActivities[]` (`ATUACAO-PROFISSIONAL`).

Não existe um campo único chamado descrição. Usar:

- Cargo informado: `links[i].functionalRole` (`OUTRO-ENQUADRAMENTO-FUNCIONAL-INFORMADO`).
- Tipo de vínculo: `links[i].linkType` (`SERVIDOR_PUBLICO`, `CELETISTA`, `SERVIDOR_PUBLICO_OU_CELETISTA`, `PROFESSOR_VISITANTE`, `COLABORADOR`, `BOLSISTA_RECEM_DOUTOR`, `OUTRO`, `LIVRE`).
- Texto livre do vínculo: `links[i].raw["@_OUTRAS-INFORMACOES"]`. Não é campo tipado. Preservar `raw`.
- `role`, `startYear` e `endYear` no emprego só gravam `CARGO` e anos quando `links` está vazio. Com vínculo, alterar `role` não muda o XML.

Atividades dentro do emprego: `functionActivities[]`. Cada item precisa de `category`, `xmlContainerTag` e `xmlItemTag` (tabela em [fields.md](fields.md)). Cargo da função, curso ministrado e afins vão em `specifics` (chaves XML, sem `@_`). `periodFlag` é `ATUAL` ou `ANTERIOR`.

### Alterar

Patch só no campo. Não substituir o emprego inteiro.

### Incluir

Acrescentar em `professionalActivities[n]`, com `n` igual ao tamanho atual. Objeto novo:

- `institution`
- `links`: pelo menos um vínculo (`linkType`, `functionalRole`, mês/ano)
- `functionActivities`: `[]` ou as funções reais
- `projectParticipations`: `[]`

### Remover

Substituir o array `professionalActivities` pelos itens que ficam, copiados do parse (com `raw`, `links` e `functionActivities`). Não reconstruir o que permanece. Allowlist: `professionalActivities`.

Não gravar `functionActivities: []` num emprego que já tem atividades, a menos que a pessoa queira apagá-las. `[]` remove os blocos `ATIVIDADES-DE-*`. `undefined` preserva o XML existente.

## Cursos e formação

Dois lugares. Não misturar.

| O que a pessoa diz | Lista | Nome do curso | Tag |
| --- | --- | --- | --- |
| Graduação, mestrado, doutorado, especialização acadêmica, técnico | `academicBackground[]` | `courseName` (`NOME-CURSO`) | `xmlTag`: `GRADUACAO`, `ESPECIALIZACAO`, `MESTRADO`, `DOUTORADO`, etc. |
| Curso curto, extensão, aperfeiçoamento complementar | `complementary.complementaryTraining[]` | `title` (`NOME-CURSO`) | `type`: ver [fields.md](fields.md) |

Em `academicBackground`, `title` é o trabalho de conclusão (TCC, monografia, dissertação), não o nome do curso. A gravação usa o atributo XSD da tag.

Alterar um campo: patch no path do índice certo.

Incluir: append no próximo índice, com `xmlTag` ou `type`, nome, instituição e anos.

Remover: substituir o array inteiro (`academicBackground` ou `complementary.complementaryTraining`) pelos itens copiados do parse. Allowlist é o path do array.

## Fora do foco

Artigo, livro, software, patente e produção artística não são experiência profissional. Se a pessoa pedir, usar `bibliographicProduction`, `technicalProduction` ou `artisticProduction` em [fields.md](fields.md). Não inventar path fora do modelo tipado.
