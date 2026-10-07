import type { Curriculum } from "../types.js";

const SKIP_KEYS = new Set(["document", "unmapped", "raw"]);
const LABEL_KEYS = ["title", "name", "fullName", "xmlTag", "language", "level"];

export type CurriculumDiffEntry =
  | {
      kind: "changed";
      path: string;
      before: string;
      after: string;
    }
  | {
      kind: "added" | "removed";
      path: string;
      value: string;
    }
  | {
      kind: "tag";
      scope: "document" | "unmapped";
      change: "added" | "removed";
      path: string;
    };

type PathPart = string | number;

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function formatPath(parts: PathPart[]): string {
  let path = "";
  for (const part of parts) {
    if (typeof part === "number") {
      path += `[${part}]`;
    } else {
      path = path ? `${path}.${part}` : part;
    }
  }
  return path;
}

function truncate(value: string): string {
  const single = value.replace(/\s+/g, " ").trim();
  if (single.length <= 160) {
    return single;
  }
  return `${single.slice(0, 157)}...`;
}

function preview(value: unknown): string {
  if (value === undefined || value === null) {
    return "";
  }
  if (typeof value === "string") {
    return truncate(value);
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) {
    return `${value.length} item(s)`;
  }
  if (isRecord(value)) {
    for (const key of LABEL_KEYS) {
      const label = value[key];
      if (typeof label === "string" && label.trim()) {
        return truncate(label);
      }
    }
  }
  return "";
}

function sameScalar(left: unknown, right: unknown): boolean {
  return Object.is(left, right);
}

function walk(
  before: unknown,
  after: unknown,
  parts: PathPart[],
  entries: CurriculumDiffEntry[],
): void {
  if (before === undefined && after === undefined) {
    return;
  }
  if (before === undefined || after === undefined) {
    const present = before === undefined ? after : before;
    entries.push({
      kind: before === undefined ? "added" : "removed",
      path: formatPath(parts),
      value: preview(present),
    });
    return;
  }
  if (Array.isArray(before) || Array.isArray(after)) {
    if (!Array.isArray(before) || !Array.isArray(after)) {
      entries.push({
        kind: "changed",
        path: formatPath(parts),
        before: preview(before),
        after: preview(after),
      });
      return;
    }
    const length = Math.max(before.length, after.length);
    for (let index = 0; index < length; index += 1) {
      walk(before[index], after[index], [...parts, index], entries);
    }
    return;
  }
  if (isRecord(before) && isRecord(after)) {
    const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
    for (const key of [...keys].sort()) {
      if (SKIP_KEYS.has(key)) {
        continue;
      }
      walk(before[key], after[key], [...parts, key], entries);
    }
    return;
  }
  if (isRecord(before) || isRecord(after)) {
    entries.push({
      kind: "changed",
      path: formatPath(parts),
      before: preview(before),
      after: preview(after),
    });
    return;
  }
  if (!sameScalar(before, after)) {
    entries.push({
      kind: "changed",
      path: formatPath(parts),
      before: preview(before),
      after: preview(after),
    });
  }
}

function collectElementTags(node: unknown, prefix: string, into: Set<string>): void {
  if (!isRecord(node)) {
    return;
  }
  for (const key of Object.keys(node)) {
    if (key.startsWith("@_") || key === "#text") {
      continue;
    }
    const path = prefix ? `${prefix}/${key}` : key;
    into.add(path);
    const value = node[key];
    if (Array.isArray(value)) {
      for (const item of value) {
        collectElementTags(item, path, into);
      }
    } else {
      collectElementTags(value, path, into);
    }
  }
}

function collectUnmapped(
  node: unknown,
  parts: PathPart[],
  into: Map<string, Set<string>>,
): void {
  if (Array.isArray(node)) {
    node.forEach((item, index) => collectUnmapped(item, [...parts, index], into));
    return;
  }
  if (!isRecord(node)) {
    return;
  }
  for (const key of Object.keys(node)) {
    if (key === "document") {
      continue;
    }
    if (key === "unmapped" && isRecord(node[key])) {
      const tags = new Set(
        Object.keys(node[key]).filter((tag) => !tag.startsWith("@_") && tag !== "#text"),
      );
      into.set(formatPath([...parts, "unmapped"]), tags);
      continue;
    }
    collectUnmapped(node[key], [...parts, key], into);
  }
}

function tagEntries(
  scope: "document" | "unmapped",
  before: Map<string, Set<string>> | Set<string>,
  after: Map<string, Set<string>> | Set<string>,
): CurriculumDiffEntry[] {
  if (before instanceof Set && after instanceof Set) {
    return diffTagSet(scope, "", before, after);
  }
  if (!(before instanceof Map) || !(after instanceof Map)) {
    return [];
  }
  const paths = new Set([...before.keys(), ...after.keys()]);
  const entries: CurriculumDiffEntry[] = [];
  for (const path of [...paths].sort()) {
    entries.push(
      ...diffTagSet(scope, path, before.get(path) ?? new Set(), after.get(path) ?? new Set()),
    );
  }
  return entries;
}

function diffTagSet(
  scope: "document" | "unmapped",
  parent: string,
  before: Set<string>,
  after: Set<string>,
): CurriculumDiffEntry[] {
  const entries: CurriculumDiffEntry[] = [];
  for (const tag of [...after].sort()) {
    if (!before.has(tag)) {
      entries.push({
        kind: "tag",
        scope,
        change: "added",
        path: parent ? `${parent}/${tag}` : tag,
      });
    }
  }
  for (const tag of [...before].sort()) {
    if (!after.has(tag)) {
      entries.push({
        kind: "tag",
        scope,
        change: "removed",
        path: parent ? `${parent}/${tag}` : tag,
      });
    }
  }
  return entries;
}

export function diffCurricula(before: Curriculum, after: Curriculum): CurriculumDiffEntry[] {
  const entries: CurriculumDiffEntry[] = [];
  walk(before, after, [], entries);

  const beforeTags = new Set<string>();
  const afterTags = new Set<string>();
  collectElementTags(before.document, "CURRICULO-VITAE", beforeTags);
  collectElementTags(after.document, "CURRICULO-VITAE", afterTags);
  entries.push(...tagEntries("document", beforeTags, afterTags));

  const beforeUnmapped = new Map<string, Set<string>>();
  const afterUnmapped = new Map<string, Set<string>>();
  collectUnmapped(before, [], beforeUnmapped);
  collectUnmapped(after, [], afterUnmapped);
  entries.push(...tagEntries("unmapped", beforeUnmapped, afterUnmapped));
  return entries;
}

export function formatCurriculumDiff(entries: CurriculumDiffEntry[]): string {
  if (entries.length === 0) {
    return "No differences.";
  }
  const lines: string[] = [];
  for (const entry of entries) {
    if (entry.kind === "changed") {
      lines.push(`changed ${entry.path}`);
      lines.push(`- ${entry.before}`);
      lines.push(`+ ${entry.after}`);
      continue;
    }
    if (entry.kind === "tag") {
      lines.push(`${entry.scope} tag ${entry.change} ${entry.path}`);
      continue;
    }
    const suffix = entry.value ? ` (${entry.value})` : "";
    lines.push(`${entry.kind} ${entry.path}${suffix}`);
  }
  return lines.join("\n");
}
