const debug = require('debug')('Uttori.Utilities.parseQueryToArray');
const Operator = require('./operator');
const SqlWhereParser = require('./where-parser');

/**
  * Parse a query into an array-like structure, where each sub-array is its own group of parentheses in the query.
  * @property {String} query - The SQL-like string to be parsed.
  * @example <caption>toArray('SQL-LIKE-QUERY')</caption>
  * parseQueryToArray('(name = "First Last") AND (age >= (20 + 7))');
  * ➜ [
  *    [
  *      'name',
  *      Operator('=', 2, 5), // '=',
  *      'First Last',
  *    ],
  *    Operator('AND', 2, 9), // 'AND',
  *    [
  *      'age',
  *      Operator('>=', 2, 5), // '>=',
  *      [
  *        20,
  *        Operator('+', 2, 4), // '+',
  *        7,
  *      ],
  *    ],
  *  ]
  */
const parseQueryToArray = (query) => {
  debug('Query:', query);
  const parser = new SqlWhereParser();
  let expression = [];
  let tokenCount = 0;
  let lastToken;
  const expressionParentheses = [];

  parser.tokenizer.tokenize(`(${query})`, (token, surroundedBy) => {
    tokenCount++;

    switch (token) {
      case '(': {
        expressionParentheses.push(expression.length);
        break;
      }
      case ')': {
        const precedenceParenthesisIndex = expressionParentheses.pop();

        let expressionTokens = expression.splice(precedenceParenthesisIndex, expression.length);

        while (Array.isArray(expressionTokens) && expressionTokens.length === 1) {
          [expressionTokens] = expressionTokens;
        }
        expression.push(expressionTokens);
        break;
      }
      case '[': {
        expressionParentheses.push(expression.length);
        break;
      }
      case ']': {
        const precedenceParenthesisIndex = expressionParentheses.pop();

        let expressionTokens = expression.splice(precedenceParenthesisIndex, expression.length);

        while (Array.isArray(expressionTokens) && expressionTokens.length === 1) {
          [expressionTokens] = expressionTokens;
        }
        expression.push(expressionTokens);
        break;
      }
      case ',':
        break;
      default: {
        let operator = null;
        if (!surroundedBy) {
          operator = parser.getOperator(token);
          if (token === '-' && (tokenCount === 1 || (lastToken === '(' || lastToken === '[' || (lastToken && lastToken.constructor === Operator)))) {
            operator = parser.getOperator(Operator.type('unary-minus'));
          }
        }
        expression.push(operator || token);
        break;
      }
    }
    lastToken = token;
  });

  while (Array.isArray(expression) && expression.length === 1) {
    [expression] = expression;
  }

  return expression;
};

module.exports = parseQueryToArray;
