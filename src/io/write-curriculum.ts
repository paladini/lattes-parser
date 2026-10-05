import { writeFile } from "node:fs/promises";
import { backupBeforeWrite } from "../backup/store.js";
import type { Curriculum } from "../types.js";
import { serializeCurriculum } from "../serialize/serialize-curriculum.js";

export interface WriteCurriculumOptions {
  backup?: boolean;
  backupDir?: string;
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
  await writeFile(targetPath, xml, "latin1");
}
