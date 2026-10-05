export class LattesError extends Error {
  readonly code: string;

  constructor(code: string, message: string) {
    super(message);
    this.name = "LattesError";
    this.code = code;
  }
}

export class InvalidLattesIdError extends LattesError {
  constructor(value: string) {
    super("INVALID_LATTES_ID", `Invalid Lattes identifier: ${value}`);
    this.name = "InvalidLattesIdError";
  }
}

export class InvalidCurriculumXmlError extends LattesError {
  constructor(message: string) {
    super("INVALID_CURRICULUM_XML", message);
    this.name = "InvalidCurriculumXmlError";
  }
}

export class InvalidCurriculumArchiveError extends LattesError {
  constructor(message: string) {
    super("INVALID_CURRICULUM_ARCHIVE", message);
    this.name = "InvalidCurriculumArchiveError";
  }
}

export class ExtratorError extends LattesError {
  constructor(code: string, message: string) {
    super(code, message);
    this.name = "ExtratorError";
  }
}
