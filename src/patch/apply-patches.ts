import type { Curriculum } from "../types.js";
import { setCurriculumValue } from "./paths.js";

export interface CurriculumPatch {
  path: string;
  value: unknown;
}

export interface ApplyPatchesOptions {
  /** If set, only these dot-paths (exact) may be modified. */
  allowlist?: string[];
}

export function applyCurriculumPatches(
  cv: Curriculum,
  patches: CurriculumPatch[],
  options: ApplyPatchesOptions = {},
): Curriculum {
  for (const patch of patches) {
    if (options.allowlist && !options.allowlist.includes(patch.path)) {
      throw new Error(`Patch path not allowed: ${patch.path}`);
    }
    setCurriculumValue(cv, patch.path, patch.value);
  }
  return cv;
}
