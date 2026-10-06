import { writeFile } from "node:fs/promises";
import { backupBeforeWrite } from "../backup/store.js";
import type { Curriculum } from "../types.js";
import { serializeCurriculum } from "../serialize/serialize-curriculum.js";
import { validateCurriculumXml } from "../validate/validate-curriculum.js";

export interface WriteCurriculumOptions {
  backup?: boolean;
  backupDir?: string;
  validate?: boolean;
  schemaPath?: string;
}

export async function writeCurriculum(
  cv: Curriculum,
  targetPath: string,
  options: WriteCurriculumOptions = {},
): Promise<void> {
  const backup = options.backup !== false;
  if (backup) {
    await backupBeforeWrite(targetPath, {
      backupDir: options.backupDir,
      curriculumId: cv.id,
    });
  }

  const xml = serializeCurriculum(cv);
  if (options.validate) {
    const result = validateCurriculumXml(xml, {
      schemaPath: options.schemaPath,
    });
    if (result.skipped) {
      throw new Error(result.reason ?? "Validation skipped");
    }
    if (!result.valid) {
      throw new Error(result.errors.join("\n"));
    }
  }
  await writeFile(targetPath, xml, "latin1");
}
