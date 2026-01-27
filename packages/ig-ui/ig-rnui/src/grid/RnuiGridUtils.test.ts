
import { getBreakpoint, lgWidth, mdWidth, smWidth, TOTAL_GRID_COLUMNS, xlWidth } from "./RnuiGridUtils";

describe("RnuiGridUtils", () => {
  it("exports the correct TOTAL_GRID_COLUMNS", () => {
    expect(TOTAL_GRID_COLUMNS).toBe(12);
    expect(typeof TOTAL_GRID_COLUMNS).toBe("number");
  });

  const cases: Array<{ width: number; expected: string }> = [
    { width: -100, expected: "xs" },
    { width: 0, expected: "xs" },
    { width: smWidth - 1, expected: "xs" },
    { width: smWidth, expected: "sm" },
    { width: mdWidth - 1, expected: "sm" },
    { width: mdWidth, expected: "md" },
    { width: lgWidth - 1, expected: "md" },
    { width: lgWidth, expected: "lg" },
    { width: lgWidth + 1, expected: "lg" },
    { width: xlWidth, expected: "xl" },
    { width: xlWidth + 1, expected: "xl" },
  ];

  cases.forEach(({ width, expected }) => {
    it(`returns "${expected}" for width ${width}`, () => {
      expect(getBreakpoint(width)).toBe(expected);
    });
  });
});