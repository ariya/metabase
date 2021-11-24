import { parse } from "metabase/lib/expressions/recursive-parser";
import { resolve } from "metabase/lib/expressions/resolver";

describe("metabase/lib/expressions/recursive-parser", () => {
  const mockResolve = (kind, name) => [kind, name];
  const process = (source, type) => resolve(parse(source), type, mockResolve);

  it("should parse numeric literals", () => {
    expect(process("0")).toEqual(0);
    expect(process("42")).toEqual(42);
    expect(process("1.0")).toEqual(1);
    expect(process("0.123")).toEqual(0.123);
  });

  it("should parse string literals", () => {
    expect(process("'Universe'")).toEqual("Universe");
    expect(process('"answer"')).toEqual("answer");
  });

  it("should parse field references", () => {
    expect(process("[Rating]")).toEqual(["dimension", "Rating"]);
    expect(process("Discount")).toEqual(["dimension", "Discount"]);
  });

  it("should parse unary expressions", () => {
    expect(process("+6")).toEqual(["+", 6]);
    expect(process("++7")).toEqual(["+", ["+", 7]]);
    expect(process("-+8")).toEqual(["-", ["+", 8]]);
  });

  it("should parse binary expressions", () => {
    expect(process("14 * 3")).toEqual(["*", 14, 3]);
    expect(process("84 / 2")).toEqual(["/", 84, 2]);
    expect(process("5 + 37")).toEqual(["+", 5, 37]);
    expect(process("50 - 8")).toEqual(["-", 50, 8]);
  });

  it("should flatten binary expressions with more terms/factors", () => {
    expect(process("2 + 4 + 8")).toEqual(["+", 2, 4, 8]);
    expect(process("3 - 6 + 9")).toEqual(["+", ["-", 3, 6], 9]);
    expect(process("1 / 2 / 3")).toEqual(["/", 1, 2, 3]);
    expect(process("4 * 2 / 1")).toEqual(["/", ["*", 4, 2], 1]);
    expect(process("6 * 7 * 8")).toEqual(["*", 6, 7, 8]);
    expect(process("1/2*(3*4)")).toEqual(["*", ["/", 1, 2], ["*", 3, 4]]);
    expect(process("-1-(2-3)")).toEqual(["-", -1, ["-", 2, 3]]);
  });

  it("should flatten unary expressions", () => {
    expect(process("--5")).toEqual(5);
    expect(process("- 6")).toEqual(-6);
    expect(process("+-7")).toEqual(["+", -7]);
    expect(process("sqrt(-1)")).toEqual(["sqrt", -1]);
    expect(process("- X")).toEqual(["-", ["dimension", "X"]]);
  });

  it("should honor operator precedence", () => {
    expect(process("1 + 2 * 3")).toEqual(["+", 1, ["*", 2, 3]]);
    expect(process("1 + 2 + 3 * 4")).toEqual(["+", 1, 2, ["*", 3, 4]]);
  });

  it("should parse grouped expressions in parentheses", () => {
    expect(process("(1 + 2) * 3")).toEqual(["*", ["+", 1, 2], 3]);
    expect(process("4 / (5 - 6) * 7")).toEqual(["*", ["/", 4, ["-", 5, 6]], 7]);
    expect(process("7 * (8 + 9) - 1")).toEqual(["-", ["*", 7, ["+", 8, 9]], 1]);
  });

  it("should parse function calls", () => {
    expect(process("ceil(3.14)")).toEqual(["ceil", 3.14]);
    expect(process("log(1 + sqrt(9))")).toEqual(["log", ["+", 1, ["sqrt", 9]]]);
    expect(process("power(log(2.1), 7)")).toEqual(["power", ["log", 2.1], 7]);
    expect(process("trim(ID)")).toEqual(["trim", ["dimension", "ID"]]);
  });

  it("should use MBQL canonical function names", () => {
    expect(process("IsEmpty([X])")).toEqual(["is-empty", ["dimension", "X"]]);
  });

  it("should handle CASE expression", () => {
    const X = ["segment", "X"];
    const Y = ["dimension", "Y"];
    const A = ["segment", "A"];
    const B = ["dimension", "B"];
    const C = ["dimension", "C"];
    expect(process("CASE(X,Y)")).toEqual(["case", [[X, Y]]]);
    expect(process("CASE(X,Y,A,B)")).toEqual(["case", [[X, Y], [A, B]]]);
    expect(process("CASE(A,B,C)")).toEqual(["case", [[A, B]], { default: C }]);
    expect(process("CASE(A,B,C)")).toEqual(["case", [[A, B]], { default: C }]);
    expect(process("CASE(X,Y,A,B,C)")).toEqual([
      "case",
      [[X, Y], [A, B]],
      { default: C },
    ]);
  });

  it("should use MBQL negative shorthands", () => {
    expect(process("NOT IsNull(1)")).toEqual(["not-null", 1]);
    expect(process("NOT IsEmpty(2 + 3)")).toEqual(["not-empty", ["+", 2, 3]]);
    expect(process("NOT contains(4,5)")).toEqual(["does-not-contain", 4, 5]);
  });

  it("should parse comparisons", () => {
    expect(process("round(3.14) = 3")).toEqual(["=", ["round", 3.14], 3]);
    expect(process("Tax != 0")).toEqual(["!=", ["dimension", "Tax"], 0]);
    expect(process("Rating <= 4")).toEqual(["<=", ["dimension", "Rating"], 4]);
    expect(process("3 > -4")).toEqual([">", 3, -4]);
  });

  it("should parse boolean unary expressions", () => {
    expect(process("NOT X > 0")).toEqual(["not", [">", ["dimension", "X"], 0]]);
    expect(process("NOT NOT Y")).toEqual(["not", ["not", ["segment", "Y"]]]);
  });

  it("should parse boolean binary expressions", () => {
    expect(process("X AND 1")).toEqual(["and", ["segment", "X"], 1]);
    expect(process("2 OR Q")).toEqual(["or", 2, ["segment", "Q"]]);
  });

  it("should honor boolean precedence", () => {
    expect(process("NOT 1 OR 2")).toEqual(["or", ["not", 1], 2]);
    expect(process("3 and not 4")).toEqual(["and", 3, ["not", 4]]);
  });

  it("should resolve segments", () => {
    expect(process("Expensive", "boolean")).toEqual(["segment", "Expensive"]);
    expect(process("NOT LowVolume")).toEqual(["not", ["segment", "LowVolume"]]);
  });

  it("should resolve dimensions", () => {
    expect(process("Rating")).toEqual(["dimension", "Rating"]);
    expect(process("Rating")).toEqual(["dimension", "Rating"]);
  });
});
