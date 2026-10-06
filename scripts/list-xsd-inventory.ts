/**
 * Print element names and attributes from the versioned Lattes XSD.
 * Run: npx tsx scripts/list-xsd-inventory.ts
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const xsdPath = path.join(
  root,
  "DEFINITIONS",
  "xml_cvbase_src_main_resources_CurriculoLattes_12_09_2022.xsd",
);

interface XsdElement {
  name: string;
  attributes: string[];
}

function attributeValue(tag: string, key: string): string | undefined {
  const match = tag.match(new RegExp(`\\b${key}="([^"]*)"`));
  return match?.[1];
}

function listElements(xsd: string): XsdElement[] {
  const tagRe = /<\/?xs:(?:element|attribute)\b[^>]*\/?>/g;
  const stack: XsdElement[] = [];
  const elements: XsdElement[] = [];

  for (const tag of xsd.match(tagRe) ?? []) {
    if (tag.startsWith("</")) {
      if (tag.startsWith("</xs:element")) {
        const frame = stack.pop();
        if (frame?.name) {
          elements.push(frame);
        }
      }
      continue;
    }

    if (tag.startsWith("<xs:attribute")) {
      const name = attributeValue(tag, "name");
      const current = stack.at(-1);
      if (name && current?.name) {
        current.attributes.push(name);
      }
      continue;
    }

    const name = attributeValue(tag, "name");
    const selfClosing = tag.endsWith("/>");
    if (!name) {
      if (!selfClosing) {
        stack.push({ name: "", attributes: [] });
      }
      continue;
    }

    const element: XsdElement = { name, attributes: [] };
    if (selfClosing) {
      elements.push(element);
    } else {
      stack.push(element);
    }
  }

  return elements.filter((element) => element.name.length > 0);
}

const xsd = readFileSync(xsdPath, "latin1");
const json = process.argv.includes("--json");
const elements = listElements(xsd);

if (json) {
  console.log(JSON.stringify(elements));
} else {
  for (const element of elements) {
    console.log(`${element.name}: ${element.attributes.join(", ")}`);
  }
}
