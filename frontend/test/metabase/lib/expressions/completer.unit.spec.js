import { complete, COMPLETION } from "metabase/lib/expressions/completer";

const FIELDS = [
  "Created At",
  "ID",
  "Product ID",
  "Product → Category",
  "Subtotal",
  "User → State",
];
const SEGMENTS = [
  "Deal",
  "Expensive Thing",
  "Inexpensive",
  "Specials",
  "Luxury",
];
const NUMERIC_FUNCTIONS = ["exp", "log", "sqrt"];

const FILTER_FUNCTIONS = [
  "between",
  "contains",
  "endsWith",
  "interval",
  "isempty",
  "isnull",
  "startsWith",
];

function suggest(startRule, expression) {
  let suggestions = [];
  const completions = complete(startRule, expression, expression.length);
  completions.forEach(completion => {
    const prefix = completion.match.toLocaleLowerCase();
    const matcher = n => n.toLocaleLowerCase().startsWith(prefix);
    if (completion.type === COMPLETION.NumericFunction) {
      const matches = NUMERIC_FUNCTIONS.filter(matcher);
      suggestions = suggestions.concat(matches);
    }
    if (completion.type === COMPLETION.Operator) {
      suggestions.push(prefix);
    }
    if (completion.type === COMPLETION.FilterFunction) {
      const matches = FILTER_FUNCTIONS.filter(matcher);
      suggestions = suggestions.concat(matches);
    }
    if (completion.type === COMPLETION.Case) {
      suggestions = suggestions.concat("case");
    }
    if (completion.type === COMPLETION.Field) {
      const matches = FIELDS.filter(matcher);
      suggestions = suggestions.concat(matches);
    }
    if (completion.type === COMPLETION.Segment) {
      const matches = SEGMENTS.filter(matcher);
      suggestions = suggestions.concat(matches);
    }
  });

  return suggestions;
}

describe("metabase/lib/expressions/completer", () => {
  describe("for a filter", () => {
    const filter = expression => suggest("boolean", expression);

    it("should suggest filter functions, fields, and segments ", () => {
      expect(filter(" ")).toEqual([
        ...FILTER_FUNCTIONS,
        "case",
        "not",
        "(",
        ...FIELDS,
        ...SEGMENTS,
      ]);
    });

    it("should complete a segment", () => {
      expect(filter("CASE([Spe")).toEqual(["Specials"]);
      expect(filter("CASE(L")).toEqual(["Luxury"]);
      expect(filter("CASE(Deal")).toEqual(["Deal"]);
    });

    it("should complete a partial identifier", () => {
      expect(filter("e")).toEqual(["endsWith", "Expensive Thing"]);
      expect(filter("s")).toEqual(["startsWith", "Subtotal", "Specials"]);
      expect(filter("in")).toEqual(["interval", "Inexpensive"]);
      expect(filter("lux")).toEqual(["Luxury"]);
      expect(filter("prod")).toEqual(["Product ID", "Product → Category"]);
    });

    it("should suggest comparison operators after a field", () => {
      expect(filter("[Total] ")).toEqual([
        "!=",
        "<",
        "<=",
        "=",
        ">",
        ">=",
        "and",
        "or",
      ]);
    });
  });
});
