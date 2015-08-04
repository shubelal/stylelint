import {
  cssStatementBlockString,
  report,
  ruleMessages,
  validateOptions,
  whitespaceChecker
} from "../../utils"

export const ruleName = "declaration-block-semicolon-newline-before"

export const messages = ruleMessages(ruleName, {
  expectedBefore: () => `Expected newline before ";"`,
  expectedBeforeMultiLine: () => `Expected newline before ";" in a multi-line rule`,
  rejectedBeforeMultiLine: () => `Unexpected whitespace before ";" in a multi-line rule`,
})

export default function (expectation) {
  const check = whitespaceChecker("newline", expectation, messages)
  return function (root, result) {
    validateOptions({ result, ruleName,
      actual: expectation,
      possible: [
        "always",
        "always-multi-line",
        "never-multi-line",
      ],
    })

    root.eachDecl(function (decl) {
      const parentRule = decl.parent
      if (!parentRule.semicolon && parentRule.last === decl) { return }

      const declString = decl.toString()

      check.before({
        source: declString,
        index: declString.length,
        lineCheckStr: cssStatementBlockString(parentRule),
        err: m => {
          return report({
            message: m,
            node: decl,
            result,
            ruleName,
          })
        },
      })
    })
  }
}