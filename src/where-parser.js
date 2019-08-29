/* eslint-disable security/detect-possible-timing-attacks */
const Operator = require('./operator');
const TokenizeThis = require('./tokenizer');

/**
  * Parses the WHERE portion of an SQL-like string into an abstract syntax tree.
  * The tree is object-based, where each key is the operator, and its value is an array of the operands.
  * The number of operands depends on if the operation is defined as unary, binary, or ternary in the config.
  * @property {Object} config - The configuration object.
  * @property {TokenizeThis} tokenizer - The tokenizer instance.
  * @property {Object} operators - The operators from config converted to Operator objects.
  * @example <caption>Init SqlWhereParser</caption>
  * const parser = new SqlWhereParser();
  * const parsed = parser.parse(sql);
  * @class
  */
class SqlWhereParser {
/**
  * Creates an instance of SqlWhereParser.
  * @param {Object} config - A configuration object.
  * @constructor
  */
  constructor(config = {}) {
    config = {
      operators: [
        {
          '!': Operator.type('unary'),
        },
        {
          [Operator.type('unary-minus')]: Operator.type('unary'),
        },
        {
          '^': Operator.type('binary'),
        },
        {
          '*': Operator.type('binary'),
          '/': Operator.type('binary'),
          '%': Operator.type('binary'),
        },
        {
          '+': Operator.type('binary'),
          '-': Operator.type('binary'),
        },
        {
          '=': Operator.type('binary'),
          '<': Operator.type('binary'),
          '>': Operator.type('binary'),
          '<=': Operator.type('binary'),
          '>=': Operator.type('binary'),
          '!=': Operator.type('binary'),
        },
        {
          ',': Operator.type('binary'), // We treat commas as an operator, to aid in turning arbitrary numbers of comma-separated values into arrays.
        },
        {
          NOT: Operator.type('unary'),
        },
        {
          BETWEEN: Operator.type('ternary'),
          IN: Operator.type('binary'),
          INCLUDES: Operator.type('binary'),
          IS: Operator.type('binary'),
          IS_NULL: Operator.type('unary'),
          IS_NOT_NULL: Operator.type('unary'),
          LIKE: Operator.type('binary'),
        },
        {
          AND: Operator.type('binary'),
        },
        {
          OR: Operator.type('binary'),
        },
      ],
      tokenizer: {
        shouldTokenize: ['(', ')', '[', ']', ',', '*', '/', '%', '+', '-', '=', '!=', '!', '<', '>', '<=', '>=', '^'],
        shouldMatch: ['"', "'", '`'],
        shouldDelimitBy: [' ', '\n', '\r', '\t'],
      },
      wrapQuery: true, // Wraps queries in surround parentheses ().
      ...config,
    };
    this.tokenizer = new TokenizeThis(config.tokenizer);
    this.operators = {};

    // Flattens the operator definitions into a single object,
    // whose keys are the operators, and the values are the Operator class wrappers.
    config.operators.forEach((operators, precedence) => {
      Object.keys(operators).concat(Object.getOwnPropertySymbols(operators)).forEach((operator) => {
        this.operators[operator] = new Operator(operator, operators[operator], precedence);
      });
    });

    this.config = config;
  }

  /**
   * Parse a SQL statement with an evaluator function.
   * Uses an implementation of the Shunting-Yard Algorithm: http://wcipeg.com/wiki/Shunting_yard_algorithm
   * See also: https://en.wikipedia.org/wiki/Shunting-yard_algorithm
   * @param {String} sql - Query string to process.
   * @param {Function} [evaluator] - Function to evaluate operators.
   * @returns {Object} - The parsed query tree.
   */
  parse(sql, evaluator) {
    const operatorStack = [];
    const outputStream = [];
    let lastOperator;
    let tokenCount = 0;
    let lastTokenWasOperatorOrLeftParenthesis = false;

    if (!evaluator) {
      evaluator = SqlWhereParser.defaultEvaluator;
    }

    // Shunting-Yard Algorithm
    sql = this.config.wrapQuery ? `(${sql})` : sql;
    this.tokenizer.tokenize(sql, (token, surroundedBy) => {
      tokenCount++;

      // Read a token.
      if (typeof token === 'string' && !surroundedBy) {
        let normalizedToken = token.toUpperCase();

        // If the token is an operator, o1, then:
        if (this.operators[normalizedToken]) {
          // Hard-coded rule for between to ignore the next AND.
          if (lastOperator === 'BETWEEN' && normalizedToken === 'AND') {
            lastOperator = 'AND';
            return;
          }

          // If the conditions are right for unary minus, convert it.
          if (normalizedToken === '-' && (tokenCount === 1 || lastTokenWasOperatorOrLeftParenthesis)) {
            normalizedToken = Operator.type('unary-minus');
          }

          // While there is an operator token o2 at the top of the operator stack,
          // and o1's precedence is less than or equal to that of o2,
          // pop o2 off the operator stack, onto the output queue:
          while (operatorStack[operatorStack.length - 1] && operatorStack[operatorStack.length - 1] !== '(' && operatorStack[operatorStack.length - 1] !== '[' && this.operatorPrecedenceFromValues(normalizedToken, operatorStack[operatorStack.length - 1])) {
            const operator = this.operators[operatorStack.pop()];
            const operands = [];
            let numOperands = operator.type;
            while (numOperands--) {
              operands.unshift(outputStream.pop());
            }
            outputStream.push(evaluator(operator.value, operands));
          }

          // At the end of iteration push o1 onto the operator stack.
          operatorStack.push(normalizedToken);
          lastOperator = normalizedToken;

          lastTokenWasOperatorOrLeftParenthesis = true;
        } else if (token === '(') {
          // If the token is a left parentheses (i.e. "("), then push it onto the stack:
          operatorStack.push(token);
          lastTokenWasOperatorOrLeftParenthesis = true;
        } else if (token === ')') {
          // If the token is a right parentheses (i.e. ")"):
          // Until the token at the top of the stack is a left parentheses, pop operators off the stack onto the output queue.
          while (operatorStack.length && operatorStack[operatorStack.length - 1] !== '(') {
            const operator = this.operators[operatorStack.pop()];
            if (!operator) {
              throw new SyntaxError('Unmatched pair within parentheses.');
            }
            const operands = [];
            let numOperands = operator.type;
            while (numOperands--) {
              operands.unshift(outputStream.pop());
            }
            outputStream.push(evaluator(operator.value, operands));
          }
          /* istanbul ignore next */
          if (operatorStack.length === 0) {
            throw new SyntaxError('Unmatched parentheses.');
          }
          // Pop the left parentheses from the stack, but not onto the output queue.
          operatorStack.pop();
          lastTokenWasOperatorOrLeftParenthesis = false;
        } else if (token === '[') {
          // If the token is a left bracket (i.e. "["), then push it onto the stack:
          operatorStack.push(token);
          lastTokenWasOperatorOrLeftParenthesis = true;
        } else if (token === ']') {
          // If the token is a right bracket (i.e. "]"):
          // Until the token at the top of the stack is a left bracket, pop operators off the stack onto the output queue.
          while (operatorStack.length && operatorStack[operatorStack.length - 1] !== '[') {
            const operator = this.operators[operatorStack.pop()];
            if (!operator) {
              throw new SyntaxError('Unmatched pair within brackets.');
            }
            const operands = [];
            let numOperands = operator.type;
            while (numOperands--) {
              operands.unshift(outputStream.pop());
            }
            outputStream.push(evaluator(operator.value, operands));
          }
          /* istanbul ignore next */
          if (operatorStack.length === 0) {
            throw new SyntaxError('Unmatched bracket.');
          }
          // Pop the left bracket from the stack, but not onto the output queue.
          operatorStack.pop();
          lastTokenWasOperatorOrLeftParenthesis = false;
        } else {
          // Token is operand, push everything else to the output queue.
          outputStream.push(token);
          lastTokenWasOperatorOrLeftParenthesis = false;
        }
      } else {
        // Push explicit strings to the output queue.
        outputStream.push(token);
        lastTokenWasOperatorOrLeftParenthesis = false;
      }
    });

    // While there are still operator tokens in the stack:
    while (operatorStack.length) {
      const operatorValue = operatorStack.pop();

      // If the operator token on the top of the stack is a parentheses, then there are mismatched parentheses.
      if (operatorValue === '(') {
        throw new SyntaxError('Unmatched parentheses.');
      }
      if (operatorValue === '[') {
        throw new SyntaxError('Unmatched bracket.');
      }
      const operator = this.operators[operatorValue];
      const operands = [];
      let numOperands = operator.type;
      while (numOperands--) {
        operands.unshift(outputStream.pop());
      }

      // Pop the operator onto the output queue.
      outputStream.push(evaluator(operator.value, operands));
    }

    /* istanbul ignore next */
    if (outputStream.length > 1) {
      throw new SyntaxError(`Could not reduce to a single expression: ${outputStream}`);
    }

    return outputStream[0];
  }

  /**
   * Returns the precedence order from two values.
   * @param {String|Symbol} operatorValue1
   * @param {String|Symbol} operatorValue2
   * @returns {Boolean}
   */
  operatorPrecedenceFromValues(operatorValue1, operatorValue2) {
    return this.operators[operatorValue2].precedence <= this.operators[operatorValue1].precedence;
  }

  /**
   * Returns the operator from the string or Symbol provided.
   * @param {String|Symbol} operatorValue
   * @returns {*}
   */
  getOperator(operatorValue) {
    if (typeof operatorValue === 'string') {
      return this.operators[operatorValue.toUpperCase()];
    }
    if (typeof operatorValue === 'symbol') {
      return this.operators[operatorValue];
    }
    return null;
  }

  /**
   * A default fallback evaluator for the parse function.
   * @param {String|Symbol} operatorValue - The operator to evaluate.
   * @param {Array} operands - The list of operands.
   * @returns {Object}
   */
  // eslint-disable-next-line class-methods-use-this
  static defaultEvaluator(operatorValue, operands) {
    // Convert back to regular minus, now that we have the proper number of operands.
    if (operatorValue === Operator.type('unary-minus')) {
      operatorValue = '-';
    }

    // This is a trick to avoid the problem of inconsistent comma usage in SQL.
    if (operatorValue === ',') {
      return [].concat(operands[0], operands[1]);
    }

    return { [operatorValue]: operands };
  }
}

module.exports = SqlWhereParser;
