import type { LattesDate, LattesDateTime } from "../types.js";

function pad2(value: string): string {
  return value.padStart(2, "0");
}

/** Parses Lattes `DDMMAAAA` into ISO date when possible. */
export function parseLattesDate(raw: string | undefined): LattesDate | undefined {
  if (!raw || raw.trim() === "") {
    return undefined;
  }

  const digits = raw.replace(/\D/g, "");
  if (digits.length !== 8) {
    return { raw };
  }

  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);
  const iso = `${year}-${month}-${day}`;

  return { raw, iso };
}

/** Parses `DDMMAAAA` + optional `HHMMSS` or `DD/MM/AAAA HH:mm:ss`. */
export function parseLattesDateTime(
  rawDate: string | undefined,
  rawTime?: string,
): LattesDateTime {
  const datePart = parseLattesDate(rawDate);
  const result: LattesDateTime = {
    rawDate: rawDate ?? "",
    rawTime,
  };

  if (rawDate?.includes("/")) {
    const match = rawDate.match(
      /^(\d{2})\/(\d{2})\/(\d{4})(?:\s+(\d{2}):(\d{2}):(\d{2}))?$/,
    );
    if (match) {
      const [, dd, mm, yyyy, hh, mi, ss] = match;
      result.iso = `${yyyy}-${mm}-${dd}T${pad2(hh ?? "00")}:${pad2(mi ?? "00")}:${pad2(ss ?? "00")}`;
      return result;
    }
  }

  if (datePart?.iso) {
    let time = "00:00:00";
    if (rawTime && /^\d{6}$/.test(rawTime)) {
      time = `${rawTime.slice(0, 2)}:${rawTime.slice(2, 4)}:${rawTime.slice(4, 6)}`;
    }
    result.iso = `${datePart.iso}T${time}`;
  }

  return result;
}
