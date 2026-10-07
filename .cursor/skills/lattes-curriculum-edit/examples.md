# Exemplos de patch

Allowlist é match exato do `path`. Troque `[0]` pelo índice real depois do parse.

CLI:

```bash
lattes-toolkit patch curriculo.xml patches.json
```

`patches.json`:

```json
{
  "allowlist": ["professionalActivities[0].links[0].functionalRole"],
  "patches": [
    {
      "path": "professionalActivities[0].links[0].functionalRole",
      "value": "Engenheiro de software"
    }
  ]
}
```

## Mudar cargo e texto do vínculo

Dois paths, duas entradas na allowlist.

```json
{
  "allowlist": [
    "professionalActivities[1].links[0].functionalRole",
    "professionalActivities[1].links[0].raw"
  ],
  "patches": [
    {
      "path": "professionalActivities[1].links[0].functionalRole",
      "value": "Staff engineer"
    },
    {
      "path": "professionalActivities[1].links[0].raw",
      "value": { "@_OUTRAS-INFORMACOES": "Liderança do time de plataforma." }
    }
  ]
}
```

Ao substituir `raw`, copiar as chaves `@_` que já existiam no parse e só alterar `@_OUTRAS-INFORMACOES`.

## Incluir experiência

`n` é o tamanho atual de `professionalActivities`.

```json
{
  "allowlist": ["professionalActivities[2]"],
  "patches": [
    {
      "path": "professionalActivities[2]",
      "value": {
        "institution": "Empresa Exemplo",
        "links": [
          {
            "linkType": "CELETISTA",
            "functionalRole": "Engenheiro de software",
            "weeklyHours": "40",
            "startMonth": "03",
            "startYear": "2021",
            "endMonth": "11",
            "endYear": "2024"
          }
        ],
        "projectParticipations": [],
        "functionActivities": [
          {
            "category": "specialized_technical_service",
            "xmlContainerTag": "ATIVIDADES-DE-SERVICO-TECNICO-ESPECIALIZADO",
            "xmlItemTag": "SERVICO-TECNICO-ESPECIALIZADO",
            "periodFlag": "ANTERIOR",
            "startMonth": "03",
            "startYear": "2021",
            "endMonth": "11",
            "endYear": "2024",
            "specifics": { "SERVICO-REALIZADO": "Desenvolvimento de APIs" }
          }
        ]
      }
    }
  ]
}
```

Confira no XSD o nome do atributo em `specifics` daquela tag antes de inventar a chave.

## Remover experiência

Um patch no array inteiro. O `value` são os objetos que ficam, iguais ao parse, sem o emprego removido. Não montar de novo instituição e vínculos à mão.

```json
{
  "allowlist": ["professionalActivities"],
  "patches": [
    { "path": "professionalActivities", "value": [] }
  ]
}
```

O `value: []` acima apaga todas as atuações. Na prática o array traz só os itens mantidos.

## Incluir graduação

`courseName` é o curso. `title` é o TCC.

```json
{
  "allowlist": ["academicBackground[1]"],
  "patches": [
    {
      "path": "academicBackground[1]",
      "value": {
        "xmlTag": "GRADUACAO",
        "level": "GRADUACAO",
        "courseName": "Ciencia da Computacao",
        "title": "Projeto de conclusao",
        "institution": "Universidade Exemplo",
        "startYear": "2010",
        "endYear": "2014",
        "status": "CONCLUIDO"
      }
    }
  ]
}
```

`status`: `EM_ANDAMENTO`, `CONCLUIDO` ou `INCOMPLETO`.

## Incluir curso curto

```json
{
  "allowlist": ["complementary.complementaryTraining[0]"],
  "patches": [
    {
      "path": "complementary.complementaryTraining[0]",
      "value": {
        "type": "FORMACAO-COMPLEMENTAR-CURSO-DE-CURTA-DURACAO",
        "title": "Kubernetes para operadores",
        "institution": "Escola Exemplo",
        "workload": "40",
        "startYear": "2023",
        "endYear": "2023",
        "status": "CONCLUIDO"
      }
    }
  ]
}
```

## Remover um curso

Mesma regra da experiência: substituir `academicBackground` ou `complementary.complementaryTraining` pela lista parseada sem o item. Allowlist é o path do array, sem índice.

## Incluir projeto num emprego

O índice do emprego é o do parse. O `value` é a lista `projectParticipations` já parseada, mais a participação nova. `[]` não apaga o bloco. Referência de campos: `test/fixtures/curriculum-research-project-sample.xml` (`situation` `EM_ANDAMENTO`, `nature` `PESQUISA`, `responsible` `SIM`).

```json
{
  "allowlist": ["professionalActivities[0].projectParticipations"],
  "patches": [
    {
      "path": "professionalActivities[0].projectParticipations",
      "value": [
        {
          "periodFlag": "ATUAL",
          "startYear": "2021",
          "projects": [
            {
              "name": "Plataforma de dados abertos",
              "startYear": "2021",
              "endYear": "2024",
              "situation": "EM_ANDAMENTO",
              "nature": "PESQUISA",
              "teamMembers": [
                {
                  "name": "Integrante Um",
                  "citationName": "UM, I.",
                  "integrationOrder": "1",
                  "responsible": "SIM"
                }
              ],
              "funders": []
            }
          ]
        }
      ]
    }
  ]
}
```

No currículo real, o array começa com as participações copiadas do parse. O objeto acima é o item acrescentado, no formato do round-trip.

## Alterar nome do projeto e responsável

Dois paths. Troque os índices pelos do parse.

```json
{
  "allowlist": [
    "professionalActivities[0].projectParticipations[0].projects[0].name",
    "professionalActivities[0].projectParticipations[0].projects[0].teamMembers[0].responsible"
  ],
  "patches": [
    {
      "path": "professionalActivities[0].projectParticipations[0].projects[0].name",
      "value": "Plataforma de dados abertos"
    },
    {
      "path": "professionalActivities[0].projectParticipations[0].projects[0].teamMembers[0].responsible",
      "value": "SIM"
    }
  ]
}
```

## Remover projeto

Substituir `professionalActivities[i].projectParticipations` pelos itens que ficam, copiados do parse. Não usar `[]`: array vazio não remove o bloco XML.

## Freelance com entrega para um cliente

`n` é o tamanho atual de `professionalActivities`. Instituição é o nome do cliente. `linkType` `COLABORADOR` ou `OUTRO`. O projeto fica nessa atuação.

Se a pessoa também quiser o produto listado (um app, por exemplo), isso é outro patch, em `technicalProduction`. O vínculo não substitui o software, e o software não substitui o vínculo.

```json
{
  "allowlist": ["professionalActivities[2]"],
  "patches": [
    {
      "path": "professionalActivities[2]",
      "value": {
        "institution": "Cliente Exemplo",
        "links": [
          {
            "linkType": "COLABORADOR",
            "functionalRole": "Desenvolvimento sob demanda",
            "startMonth": "01",
            "startYear": "2024",
            "endMonth": "06",
            "endYear": "2024"
          }
        ],
        "functionActivities": [],
        "projectParticipations": [
          {
            "periodFlag": "ATUAL",
            "startYear": "2024",
            "projects": [
              {
                "name": "App de pedidos",
                "startYear": "2024",
                "endYear": "2024",
                "situation": "EM_ANDAMENTO",
                "nature": "PESQUISA",
                "teamMembers": [
                  {
                    "name": "Pessoa Exemplo",
                    "citationName": "EXEMPLO, P.",
                    "integrationOrder": "1",
                    "responsible": "SIM"
                  }
                ],
                "funders": []
              }
            ]
          }
        ]
      }
    }
  ]
}
```

## Artigo publicado

`n` é o tamanho atual de `bibliographicProduction.journalArticles`. Não use `[0]` como se o artigo novo fosse sempre o primeiro. Forma de referência: `test/fixtures/curriculum-bibliography-extra-sample.xml`.

```json
{
  "allowlist": ["bibliographicProduction.journalArticles[2]"],
  "patches": [
    {
      "path": "bibliographicProduction.journalArticles[2]",
      "value": {
        "type": "journal_article",
        "title": "Artigo publicado",
        "year": "2020",
        "doi": "10.1000/pub",
        "journalOrEvent": "Revista A",
        "authors": [
          { "name": "Autora Exemplo", "citationName": "EXEMPLO, A.", "order": 1 }
        ]
      }
    }
  ]
}
```

## Trabalho em evento (publicação)

`journalOrEvent` grava `NOME-DO-EVENTO`. Isto não é participação em congresso.

```json
{
  "allowlist": ["bibliographicProduction.conferencePapers[1]"],
  "patches": [
    {
      "path": "bibliographicProduction.conferencePapers[1]",
      "value": {
        "type": "conference_paper",
        "title": "Trabalho nos anais",
        "year": "2023",
        "journalOrEvent": "Simposio Sintetico",
        "authors": [
          { "name": "Autora Exemplo", "citationName": "EXEMPLO, A.", "order": 1 }
        ]
      }
    }
  ]
}
```

## Capítulo de livro

`type` é `book` ou `book_chapter`.

```json
{
  "allowlist": ["bibliographicProduction.booksAndChapters[0]"],
  "patches": [
    {
      "path": "bibliographicProduction.booksAndChapters[0]",
      "value": {
        "type": "book_chapter",
        "title": "Capitulo sintetico",
        "year": "2022",
        "authors": [
          { "name": "Autora Exemplo", "citationName": "EXEMPLO, A.", "order": 1 }
        ]
      }
    }
  ]
}
```

Troque `[0]` pelo tamanho atual de `booksAndChapters` se a lista já tiver itens.

## Software

`type` `software` com `xmlTag` `SOFTWARE`. `detail.FINALIDADE` é o atributo do detalhamento, sem `@_`. Fixture próxima: `test/fixtures/curriculum-technical-extra-sample.xml`.

```json
{
  "allowlist": ["technicalProduction[3]"],
  "patches": [
    {
      "path": "technicalProduction[3]",
      "value": {
        "type": "software",
        "xmlTag": "SOFTWARE",
        "title": "Ferramenta sintetica",
        "year": "2024",
        "authors": [
          { "name": "Autora Exemplo", "citationName": "EXEMPLO, A.", "order": 1 }
        ],
        "detail": { "FINALIDADE": "Medicao" }
      }
    }
  ]
}
```

## Participação em congresso

`n` é o tamanho atual de `complementary.eventParticipation`.

```json
{
  "allowlist": ["complementary.eventParticipation[1]"],
  "patches": [
    {
      "path": "complementary.eventParticipation[1]",
      "value": {
        "type": "PARTICIPACAO-EM-CONGRESSO",
        "title": "Apresentacao oral",
        "year": "2024",
        "eventName": "Congresso Sintetico",
        "city": "Curitiba",
        "participants": [
          { "name": "Participante Exemplo", "citationName": "EXEMPLO, P.", "order": 1 }
        ]
      }
    }
  ]
}
```

## Prêmio

`n` é o tamanho atual de `awards`.

```json
{
  "allowlist": ["awards[1]"],
  "patches": [
    {
      "path": "awards[1]",
      "value": {
        "title": "Premio sintetico",
        "year": "2024",
        "promotingEntity": "Instituicao Exemplo"
      }
    }
  ]
}
```
