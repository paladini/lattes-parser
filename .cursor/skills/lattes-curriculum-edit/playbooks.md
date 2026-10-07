# Playbook: currículo desatualizado

Roteiro curto. Paths em [fields.md](fields.md). Patches em [examples.md](examples.md). Sem dump de XSD.

## Fluxo único

1. XML exportado local. Não commitar. Não fazer login no CNPq, CAPTCHA, scraping nem upload.
2. `lattes-toolkit parse arquivo.xml --json` (ou `readCurriculum`).
3. Inventário por seção, com os índices reais. O item novo usa o tamanho atual do array.
4. Patches com allowlist exata. Preferir uma gravação por `CurriculumSectionId` (`sectionsFromPatchPaths`).
5. Ordem: identificação (incluindo `identification.summary`) → atuação (emprego e os projetos daquele emprego juntos) → formação acadêmica e complementar → bibliográfica → técnica → eventos e prêmios.
6. Re-parse, `lattes-toolkit diff` contra o export original, import manual (`docs/importacao-lattes.md`). Backup antes de gravar.

## Perfis

Indústria ou freelance: `professionalActivities` (`CELETISTA`, `COLABORADOR`, `OUTRO`), `functionActivities`, `technicalProduction`, cursos complementares e `identification.summary`. Um app entregue a um cliente é o vínculo e, se a pessoa quiser o produto listado, um item em `technicalProduction`. Um não substitui o outro.

Acadêmico: artigos, trabalhos em eventos, projetos de pesquisa, formação. Eventos, prêmios e orientações só se a pessoa pedir.

Misto: a mesma ordem. Não misturar seções num único objeto de patch de um jeito que apague listas.

## O que costuma faltar

Resumo: `identification.summary` (e `summaryEnglish` se a pessoa pedir o texto em inglês).

Congresso, feira ou oficina (participação, não artigo): `complementary.eventParticipation[n]` com `type`, `title`, `year`, `eventName`, `city` e `participants`. `type` é a tag, por exemplo `PARTICIPACAO-EM-CONGRESSO`. Trabalho publicado no anais vai em `bibliographicProduction.conferencePapers`.

Prêmio: `awards[n]` com `title`, `year` e `promotingEntity`.

Orientação, banca e produção artística: só se a pessoa pedir. Copiar do parse o item parecido (envelope incluso). Orientação concluída grava em `OUTRA-PRODUCAO`. Banca é `complementary.boards`. Arte é `artisticProduction`, com `xmlTag` copiado, e não é artigo.

## Anti-padrões

- Substituir o emprego inteiro só para mudar o cargo.
- `functionActivities: []` sem querer apagar atividades.
- `projectParticipations: []` esperando apagar projetos. Não apaga. Copiar a lista parseada e gravar só o que fica.
- `academicBackground[].title` como nome do curso. O nome é `courseName` (`NOME-CURSO`).
- Artigo em `technicalProduction`, ou software em `journalArticles`.
- Inventar path para CPF, nascimento, documentos, filiação ou nó que só existe em `document` ou `unmapped`.
