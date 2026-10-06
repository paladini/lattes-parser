import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

export interface ValidateCurriculumResult {
  valid: boolean;
  errors: string[];
  skipped?: boolean;
  reason?: string;
}

const schemaFileName =
  "xml_cvbase_src_main_resources_CurriculoLattes_12_09_2022.xsd";

function resolveDefaultSchemaPath(): string {
  const candidates = [
    path.join(process.cwd(), "DEFINITIONS", schemaFileName),
    path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      "../../DEFINITIONS",
      schemaFileName,
    ),
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }
  return candidates[0];
}

export function validateCurriculumXml(
  xml: string,
  options?: { schemaPath?: string; xmlPath?: string },
): ValidateCurriculumResult {
  const schemaPath = path.resolve(options?.schemaPath ?? resolveDefaultSchemaPath());
  if (!existsSync(schemaPath)) {
    return {
      valid: false,
      skipped: true,
      reason: `Schema not found: ${schemaPath}`,
      errors: [],
    };
  }

  const xmllint = spawnSync("xmllint", ["--version"], { encoding: "utf8" });
  if (xmllint.error || xmllint.status !== 0) {
    return {
      valid: false,
      skipped: true,
      reason: "xmllint is not available on PATH",
      errors: [],
    };
  }

  const xmlPath = options?.xmlPath;
  const args = ["--noout", "--schema", schemaPath];
  if (xmlPath) {
    args.push(xmlPath);
  } else {
    args.push("-");
  }

  const result = spawnSync("xmllint", args, {
    input: xmlPath ? undefined : xml,
    encoding: "utf8",
  });

  if (result.status === 0) {
    return { valid: true, errors: [] };
  }

  const stderr = result.stderr?.trim() ?? "Unknown xmllint validation error";
  return { valid: false, errors: stderr.split("\n").filter(Boolean) };
}
