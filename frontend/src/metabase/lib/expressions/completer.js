import { tokenize, TOKEN, OPERATOR as OP } from "./tokenizer";
import _ from "underscore";

export const COMPLETION = {
  Identifier: 1,
  Operator: 2,
  FilterFunction: 3,
  Case: 4,
  Field: 5,
  Segment: 6,
};

const FILTER_OPERATORS = [
  { type: COMPLETION.Operator, match: "!=" },
  { type: COMPLETION.Operator, match: "<" },
  { type: COMPLETION.Operator, match: "<=" },
  { type: COMPLETION.Operator, match: "=" },
  { type: COMPLETION.Operator, match: ">" },
  { type: COMPLETION.Operator, match: ">=" },
];

export function complete(startRule, source, targetOffset) {
  const partialSource = source.slice(0, targetOffset);
  return startRule === "boolean" ? completeFilter(partialSource) : [];
}

function removeBrackets(s) {
  const s1 = s[0] === "[" ? s.substr(1) : s;
  return s1[s1.length - 1] === "]" ? s1.substr(0, s1.length - 1) : s1;
}

function completeFilter(partialSource) {
  let completions = [];
  const { tokens } = tokenize(partialSource);
  const lastToken = _.last(tokens);
  if (lastToken) {
    if (lastToken.type === TOKEN.Identifier) {
      if (lastToken.end >= partialSource.length) {
        const partial = partialSource.slice(lastToken.start, lastToken.end);
        const match = removeBrackets(partial);
        completions.push({ type: COMPLETION.FilterFunction, match });
        completions.push({ type: COMPLETION.Field, match });
        completions.push({ type: COMPLETION.Segment, match });
      } else {
        completions = completions.concat(...FILTER_OPERATORS);
        completions.push({ type: COMPLETION.Operator, match: OP.And });
        completions.push({ type: COMPLETION.Operator, match: OP.Or });
      }
    }
  } else {
    const match = "";
    completions.push({ type: COMPLETION.FilterFunction, match });
    completions.push({ type: COMPLETION.Case, match });
    completions.push({ type: COMPLETION.Operator, match: OP.Not });
    completions.push({
      type: COMPLETION.Operator,
      match: OP.OpenParenthesis,
    });
    completions.push({ type: COMPLETION.Field, match });
    completions.push({ type: COMPLETION.Segment, match });
  }

  return completions;
}
