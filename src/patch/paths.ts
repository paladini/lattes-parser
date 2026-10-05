import type { Curriculum } from "../types.js";

type PathSegment = string | number;

function tokenize(path: string): PathSegment[] {
  const tokens: PathSegment[] = [];
  const re = /([^[\].]+)|\[(\d+)\]/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(path)) !== null) {
    if (match[1] !== undefined) {
      for (const part of match[1].split(".")) {
        if (part) {
          tokens.push(part);
        }
      }
    } else if (match[2] !== undefined) {
      tokens.push(Number(match[2]));
    }
  }
  return tokens;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function getCurriculumValue(cv: Curriculum, path: string): unknown {
  const tokens = tokenize(path);
  let current: unknown = cv;
  for (const token of tokens) {
    if (current === null || current === undefined) {
      return undefined;
    }
    if (typeof token === "number") {
      if (!Array.isArray(current)) {
        return undefined;
      }
      current = current[token];
    } else if (isRecord(current)) {
      current = current[token];
    } else {
      return undefined;
    }
  }
  return current;
}

export function setCurriculumValue(
  cv: Curriculum,
  path: string,
  value: unknown,
): void {
  const tokens = tokenize(path);
  if (tokens.length === 0) {
    throw new Error("Empty path");
  }

  let current: unknown = cv;
  for (let i = 0; i < tokens.length - 1; i++) {
    const token = tokens[i];
    if (typeof token === "number") {
      if (!Array.isArray(current)) {
        throw new Error(`Expected array at ${tokens.slice(0, i + 1).join(".")}`);
      }
      current = current[token];
    } else if (isRecord(current)) {
      if (!(token in current)) {
        (current as Record<string, unknown>)[token] = {};
      }
      current = (current as Record<string, unknown>)[token];
    } else {
      throw new Error(`Cannot traverse path at ${String(token)}`);
    }
  }

  const last = tokens[tokens.length - 1];
  if (typeof last === "number") {
    if (!Array.isArray(current)) {
      throw new Error("Expected array for final index");
    }
    current[last] = value;
  } else if (isRecord(current)) {
    current[last] = value;
  } else {
    throw new Error("Cannot set value on path");
  }
}
