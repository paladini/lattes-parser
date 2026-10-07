---
name: lattes-curriculum-edit
description: >-
  Edits an exported Lattes curriculum XML with lattes-toolkit. Use when the
  user mentions emprego, atuação, cargo, freelance, projeto de pesquisa,
  curso, formação, graduação, artigo, publicação, software, produção técnica,
  currículo Lattes desatualizado, or XML Lattes.
---

# Edição de currículo Lattes

Projeto independente. Formato XML da plataforma. Não fazer login no CNPq, CAPTCHA, scraping nem upload. A pessoa importa o XML na Plataforma Lattes.

Currículo desatualizado (vários blocos de uma vez): [playbooks.md](playbooks.md). Paths e allowlist: [fields.md](fields.md). Exemplos de patch: [examples.md](examples.md).

Emprego, artigo e software são listas diferentes. Publicação e software entram quando a pessoa pedir. Não colocar artigo em `technicalProduction` nem software em `journalArticles`.

## Fluxo

1. Confirmar o caminho do XML exportado. Não commitar esse arquivo.
2. Ler com `readCurriculum` ou `lattes-toolkit parse arquivo.xml --json`.
3. Inventariar a seção e achar o item por instituição, cargo, título ou anos. Não assumir índice `0`. O índice novo é o tamanho atual do array.
4. Aplicar `applyCurriculumPatches` ou `lattes-toolkit patch arquivo.xml patches.json` com allowlist de path exato. Preferir uma gravação por `CurriculumSectionId` (`sectionsFromPatchPaths`).
5. Gravar com `writeCurriculum` (backup ligado). A CLI já faz backup. Passar `sections: sectionsFromPatchPaths(...)`.
6. Ler o arquivo de novo e mostrar o que mudou (`lattes-toolkit diff` contra o snapshot, se existir).
7. A importação fica com a pessoa (`docs/importacao-lattes.md`).

`set` e `patch` da CLI sincronizam só a seção do path. Array vazio apaga o bloco XML daquela seção, com uma exceção: `projectParticipations: []` não apaga projetos. Ver a seção de projetos abaixo.

## Frase da pessoa e lista

| Frase | Lista |
| --- | --- |
| Vínculo, cargo, freelance | `professionalActivities` |
| Função dentro do emprego | `professionalActivities[i].functionActivities` |
| Projeto de pesquisa na atuação | `professionalActivities[i].projectParticipations` |
| Graduação, mestrado, doutorado | `academicBackground` |
| Curso curto | `complementary.complementaryTraining` |
| Artigo | `bibliographicProduction.journalArticles` |
| Trabalho publicado em evento | `bibliographicProduction.conferencePapers` |
| Livro ou capítulo | `bibliographicProduction.booksAndChapters` |
| Participação em congresso ou feira | `complementary.eventParticipation` |
| Software ou trabalho técnico | `technicalProduction` |
| Resumo | `identification.summary` |

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
- `projectParticipations`: `[]` só num emprego novo, sem projetos. Num emprego que já tem projeto, `[]` não apaga o XML.

### Remover

Substituir o array `professionalActivities` pelos itens que ficam, copiados do parse (com `raw`, `links` e `functionActivities`). Não reconstruir o que permanece. Allowlist: `professionalActivities`.

Não gravar `functionActivities: []` num emprego que já tem atividades, a menos que a pessoa queira apagá-las. `[]` remove os blocos `ATIVIDADES-DE-*`. `undefined` preserva o XML existente.

## Projetos na atuação

Projeto de pesquisa fica em `professionalActivities[i].projectParticipations`. Não é artigo nem `technicalProduction`.

`[]` e `undefined` não apagam o bloco. Para incluir ou remover, copiar o array parseado daquele emprego e gravar a lista completa. Allowlist: `professionalActivities[i].projectParticipations`. Campos e exemplos: [fields.md](fields.md), [examples.md](examples.md).

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

## Publicação, software e o resto

Quando a pessoa pedir artigo, livro, trabalho em evento, software ou trabalho técnico, usar as listas de [fields.md](fields.md) e os patches de [examples.md](examples.md). Congresso (participação), prêmio, orientação, banca e produção artística também estão na allowlist. Banca, orientação e produção artística só entram se a pessoa pedir. Copiar do parse o envelope de um item novo.

Não inventar path fora do modelo tipado. CPF, nascimento, documentos e filiação ficam fora da allowlist.
