import { InvalidLattesIdError } from "./errors.js";

const LATTES_ID_PATTERN = /^\d{16}$/;
const CPF_PATTERN = /^\d{11}$/;
const LATTES_URL_PATTERN =
  /^https?:\/\/(?:www\.)?lattes\.cnpq\.br\/(\d{16})\/?$/i;

export type ParsedLattesId = {
  id: string;
};

function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

function parseFromUrl(value: string): string | null {
  const match = value.trim().match(LATTES_URL_PATTERN);
  return match ? match[1] : null;
}

function parse(value: string): ParsedLattesId {
  const trimmed = value.trim();
  const fromUrl = parseFromUrl(trimmed);
  if (fromUrl) {
    return { id: fromUrl };
  }

  const digits = digitsOnly(trimmed);
  if (CPF_PATTERN.test(digits)) {
    throw new InvalidLattesIdError(
      "CPF-like identifiers (11 digits) are not accepted; use the 16-digit Lattes ID",
    );
  }

  if (!LATTES_ID_PATTERN.test(digits)) {
    throw new InvalidLattesIdError(trimmed);
  }

  return { id: digits };
}

function canonicalUrl(id: string): string {
  const parsed = parse(id);
  return `https://lattes.cnpq.br/${parsed.id}`;
}

function isValid(value: string): boolean {
  try {
    parse(value);
    return true;
  } catch {
    return false;
  }
}

export const LattesId = {
  parse,
  canonicalUrl,
  isValid,
};
