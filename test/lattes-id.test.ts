import { describe, expect, it } from "vitest";
import { InvalidLattesIdError, LattesId } from "../src/index.js";

describe("LattesId", () => {
  it("parses 16-digit identifiers", () => {
    expect(LattesId.parse("8907059238612691")).toEqual({
      id: "8907059238612691",
    });
  });

  it("parses canonical URLs", () => {
    expect(LattesId.parse("https://lattes.cnpq.br/8907059238612691")).toEqual({
      id: "8907059238612691",
    });
  });

  it("rejects CPF-like identifiers", () => {
    expect(() => LattesId.parse("12345678901")).toThrow(InvalidLattesIdError);
  });

  it("rejects invalid values", () => {
    expect(() => LattesId.parse("abc")).toThrow(InvalidLattesIdError);
    expect(LattesId.isValid("8907059238612691")).toBe(true);
    expect(LattesId.isValid("12345678901")).toBe(false);
  });

  it("builds canonical URLs", () => {
    expect(LattesId.canonicalUrl("8907059238612691")).toBe(
      "https://lattes.cnpq.br/8907059238612691",
    );
  });
});
