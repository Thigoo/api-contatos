import { validateName } from "../utils/validateName";

describe("validateName function", () => {
  it("Should validate appropriated input name", () => {
    const name = "John Doe";
    expect(validateName(name)).toBe(true);
  });

  it("Should validate the amount of words", () => {
    const name = "John";
    expect(validateName(name)).toBe(false);
  });

  it("Should validate the length of the words", () => {
    const name = "John Do";
    expect(validateName(name)).toBe(false);
  });

  it("Should validate with double spaces", () => {
    const name = "John  Doe";
    expect(validateName(name)).toBe(true);
  });

  it("Should validate with double spaces", () => {
    const name = "  John Doe  ";
    expect(validateName(name)).toBe(true);
  });
});
