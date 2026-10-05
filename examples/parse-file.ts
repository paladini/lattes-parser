/**
 * Example: parse a local Lattes XML or ZIP file.
 *
 *   npx tsx examples/parse-file.ts ./curriculo.xml
 */
import { readFileSync } from "node:fs";
import { readCurriculum } from "../src/index.js";

const path = process.argv[2];
if (!path) {
  console.error("Usage: npx tsx examples/parse-file.ts <file.xml|file.zip>");
  process.exit(1);
}

const buffer = readFileSync(path);
const curriculum = await readCurriculum(buffer);

console.log(JSON.stringify({
  id: curriculum.id,
  name: curriculum.identification.fullName,
  updatedAt: curriculum.updatedAt,
  articles: curriculum.bibliographicProduction.journalArticles.length,
  advisoriesCompleted: curriculum.advisories.completed.length,
}, null, 2));
