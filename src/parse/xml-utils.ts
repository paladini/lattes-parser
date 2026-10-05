import { XMLParser } from "fast-xml-parser";

export const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
  parseTagValue: false,
  trimValues: true,
  removeNSPrefix: true,
  processEntities: true,
  htmlEntities: true,
});

function decodeXmlEntities(value: string): string {
  return value
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCodePoint(Number(code)),
    )
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex: string) =>
      String.fromCodePoint(parseInt(hex, 16)),
    )
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

export type XmlRecord = Record<string, unknown>;

export function asRecord(value: unknown): XmlRecord | undefined {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as XmlRecord;
  }
  return undefined;
}

export function asArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
}

export function textContent(value: unknown): string | undefined {
  if (typeof value === "string") {
    const trimmed = decodeXmlEntities(value.trim());
    return trimmed || undefined;
  }
  const record = asRecord(value);
  if (record && typeof record["#text"] === "string") {
    const trimmed = decodeXmlEntities(record["#text"].trim());
    return trimmed || undefined;
  }
  return undefined;
}

export function attr(record: XmlRecord | undefined, name: string): string | undefined {
  if (!record) {
    return undefined;
  }
  const value = record[`@_${name}`];
  return typeof value === "string" ? decodeXmlEntities(value) : undefined;
}

export function pickUnmapped(
  source: XmlRecord | undefined,
  knownKeys: string[],
): Record<string, unknown> {
  if (!source) {
    return {};
  }

  const unmapped: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(source)) {
    if (key.startsWith("@_")) {
      continue;
    }
    if (!knownKeys.includes(key)) {
      unmapped[key] = value;
    }
  }
  return unmapped;
}
