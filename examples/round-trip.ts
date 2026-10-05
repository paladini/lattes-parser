import { readFileSync, writeFileSync } from "node:fs";
import { parseCurriculum, serializeCurriculum } from "@paladini/lattes-toolkit";

const xml = readFileSync(new URL("../test/fixtures/curriculum-sample.xml", import.meta.url), "latin1");
const cv = parseCurriculum(xml);
const out = serializeCurriculum(cv);
writeFileSync("curriculo-round-trip.xml", out, "latin1");
console.log("Wrote curriculo-round-trip.xml");
