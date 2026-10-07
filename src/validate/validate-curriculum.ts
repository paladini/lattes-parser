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

export interface ValidateCurriculumOptions {
  schemaPath?: string;
  xmlPath?: string;
  /** Validate with a local DTD instead of the XSD. Off by default. */
  dtd?: boolean;
  /** Local DTD file. The toolkit does not download one. */
  dtdPath?: string;
}

const schemaFileName =
  "xml_cvbase_src_main_resources_CurriculoLattes_12_09_2022.xsd";

function resolveDefaultSchemaPath(): string {
  const moduleDir = path.dirname(fileURLToPath(import.meta.url));
  const candidates = [
    path.join(process.cwd(), "DEFINITIONS", schemaFileName),
    path.join(moduleDir, "..", "DEFINITIONS", schemaFileName),
    path.join(moduleDir, "..", "..", "DEFINITIONS", schemaFileName),
  ];
  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }
  return candidates[0];
}

function xmllintUnavailable(): ValidateCurriculumResult | undefined {
  const xmllint = spawnSync("xmllint", ["--version"], { encoding: "utf8" });
  if (xmllint.error || xmllint.status !== 0) {
    return {
      valid: false,
      skipped: true,
      reason: "xmllint is not available on PATH",
      errors: [],
    };
  }
  return undefined;
}

function validateWithDtd(
  xml: string,
  options: ValidateCurriculumOptions,
): ValidateCurriculumResult {
  if (!options.dtdPath) {
    return {
      valid: false,
      skipped: true,
      reason:
        "DTD path was not provided. Pass dtdPath or `validate --dtd <file.dtd>`. This toolkit does not download a DTD.",
      errors: [],
    };
  }

  const dtdPath = path.resolve(options.dtdPath);
  if (!existsSync(dtdPath)) {
    return {
      valid: false,
      skipped: true,
      reason: `DTD not found: ${dtdPath}`,
      errors: [],
    };
  }

  const unavailable = xmllintUnavailable();
  if (unavailable) {
    return unavailable;
  }

  const xmlPath = options.xmlPath;
  const args = ["--noout", "--dtdvalid", dtdPath];
  if (xmlPath) {
    args.push(xmlPath);
  } else {
    args.push("-");
  }

  return runXmllint(xml, xmlPath, args);
}

function runXmllint(
  xml: string,
  xmlPath: string | undefined,
  args: string[],
): ValidateCurriculumResult {
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

export function validateCurriculumXml(
  xml: string,
  options?: ValidateCurriculumOptions,
): ValidateCurriculumResult {
  if (options?.dtd || options?.dtdPath) {
    return validateWithDtd(xml, options);
  }

  const schemaPath = path.resolve(options?.schemaPath ?? resolveDefaultSchemaPath());
  if (!existsSync(schemaPath)) {
    return {
      valid: false,
      skipped: true,
      reason: `Schema not found: ${schemaPath}`,
      errors: [],
    };
  }

  const unavailable = xmllintUnavailable();
  if (unavailable) {
    return unavailable;
  }

  const xmlPath = options?.xmlPath;
  const args = ["--noout", "--schema", schemaPath];
  if (xmlPath) {
    args.push(xmlPath);
  } else {
    args.push("-");
  }

  return runXmllint(xml, xmlPath, args);
}
