import { tokenize } from "metabase/lib/expressions/tokenizer";
import { countMatchingParentheses } from "metabase/lib/expressions/diagnostics";

describe("metabase/lib/expressions/diagnostics", () => {
  it("should count matching parentheses", () => {
    const count = expr => countMatchingParentheses(tokenize(expr).tokens);
    expect(count("()")).toEqual(0);
    expect(count("(")).toEqual(1);
    expect(count(")")).toEqual(-1);
    expect(count("(A+(")).toEqual(2);
    expect(count("SUMIF(")).toEqual(1);
    expect(count("COUNTIF(Deal))")).toEqual(-1);
  });
});
