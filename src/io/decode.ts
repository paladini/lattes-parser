const ENCODING_DECL =
  /<\?xml[^>]*encoding\s*=\s*["']([^"']+)["']/i;

export function detectXmlEncoding(buffer: Uint8Array): string {
  const head = Buffer.from(buffer.subarray(0, Math.min(buffer.length, 256))).toString(
    "ascii",
  );
  const match = head.match(ENCODING_DECL);
  if (!match) {
    return "utf-8";
  }
  return match[1].trim().toLowerCase();
}

export function decodeXmlBuffer(buffer: Uint8Array): string {
  const encoding = detectXmlEncoding(buffer);
  const decoder = new TextDecoder(encoding === "iso-8859-1" ? "iso-8859-1" : encoding);
  return decoder.decode(buffer);
}

export function looksLikeZip(buffer: Uint8Array): boolean {
  return buffer.length >= 2 && buffer[0] === 0x50 && buffer[1] === 0x4b;
}

export function looksLikeXml(buffer: Uint8Array): boolean {
  const head = Buffer.from(buffer.subarray(0, Math.min(buffer.length, 64)))
    .toString("utf8")
    .trimStart();
  return head.startsWith("<?xml") || head.startsWith("<CURRICULO-VITAE");
}
