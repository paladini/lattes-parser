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
