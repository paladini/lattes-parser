import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const input = path.join(
  root,
  "DEFINITIONS",
  "Definitions_Lattes_Curriculum_8907059238612691.xml",
);
const output = path.join(root, "test", "fixtures", "curriculum-real-anonymized.xml");

if (!existsSync(input)) {
  console.error(`Missing input: ${input}`);
  process.exit(1);
}

let xml = readFileSync(input, "latin1");

const replacements: Array<[RegExp, string]> = [
  [/CPF="[0-9]+"/g, 'CPF="00000000000"'],
  [/NOME-COMPLETO="[^"]*"/g, 'NOME-COMPLETO="Pesquisador Anonimo"'],
  [
    /NOME-EM-CITACOES-BIBLIOGRAFICAS="[^"]*"/g,
    'NOME-EM-CITACOES-BIBLIOGRAFICAS="ANONIMO, P."',
  ],
  [/NOME-COMPLETO-DO-AUTOR="[^"]*"/g, 'NOME-COMPLETO-DO-AUTOR="Pesquisador Anonimo"'],
  [/NOME-PARA-CITACAO="[^"]*"/g, 'NOME-PARA-CITACAO="ANONIMO, P."'],
  [
    /NOME-COMPLETO-DO-PARTICIPANTE-DE-EVENTOS-CONGRESSOS="[^"]*"/g,
    'NOME-COMPLETO-DO-PARTICIPANTE-DE-EVENTOS-CONGRESSOS="Pesquisador Anonimo"',
  ],
  [
    /NOME-PARA-CITACAO-DO-PARTICIPANTE-DE-EVENTOS-CONGRESSOS="[^"]*"/g,
    'NOME-PARA-CITACAO-DO-PARTICIPANTE-DE-EVENTOS-CONGRESSOS="ANONIMO, P."',
  ],
  [/E-MAIL="[^"]*"/g, 'E-MAIL="anonimo@example.test"'],
  [/ELETRONICO="[^"]*"/g, 'ELETRONICO="anonimo@example.test"'],
  [/NUMERO-IDENTIDADE="[^"]*"/g, 'NUMERO-IDENTIDADE="0000000"'],
  [/NOME-DO-PAI="[^"]*"/g, 'NOME-DO-PAI="Pai Anonimo"'],
  [/NOME-DA-MAE="[^"]*"/g, 'NOME-DA-MAE="Mae Anonima"'],
  [/CIDADE-NASCIMENTO="[^"]*"/g, 'CIDADE-NASCIMENTO="Cidade Anonima"'],
  [/LOGRADOURO="[^"]*"/g, 'LOGRADOURO="Rua Anonima"'],
  [/CIDADE="[^"]*"/g, 'CIDADE="Cidade Anonima"'],
  [/BAIRRO="[^"]*"/g, 'BAIRRO="Bairro Anonimo"'],
  [/TELEFONE="[^"]*"/g, 'TELEFONE="00000000"'],
  [/HOME-PAGE="[^"]*"/g, 'HOME-PAGE=""'],
  [/REDE-SOCIAL="[^"]*"/g, 'REDE-SOCIAL=""'],
];

for (const [pattern, value] of replacements) {
  xml = xml.replace(pattern, value);
}

writeFileSync(output, xml, "latin1");
console.log(`Wrote ${output}`);
