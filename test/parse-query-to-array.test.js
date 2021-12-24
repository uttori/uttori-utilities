const test = require('ava');
const { Operator, parseQueryToArray } = require('../src');

test('parse into an array-like structure, where each sub-array is its own group of parentheses in the SQL', (t) => {
  const query = '(name = "First Last") AND (age >= (20 + 7))';
  const sqlArray = parseQueryToArray(query);
  t.deepEqual(sqlArray, [
    [
      'name',
      new Operator('=', 2, 5), // '=',
      'First Last',
    ],
    new Operator('AND', 2, 9), // 'AND',
    [
      'age',
      new Operator('>=', 2, 5), // '>=',
      [
        20,
        new Operator('+', 2, 4), // '+',
        7,
      ],
    ],
  ]);
});

test('parseQueryToArray(query): strips unnecessarily nested parentheses', (t) => {
  const query = '((((name = "First Last"))) AND ((age) >= ((20 + 7))))';
  const sqlArray = parseQueryToArray(query);
  t.deepEqual(sqlArray, [
    [
      'name',
      new Operator('=', 2, 5), // '=',
      'First Last',
    ],
    new Operator('AND', 2, 9), // 'AND',
    [
      'age',
      new Operator('>=', 2, 5), // '>=',
      [
        20,
        new Operator('+', 2, 4), // '+',
        7,
      ],
    ],
  ]);
});

test('parseQueryToArray(query): supports brackets and commas and inverse', (t) => {
  const query = '-[a, b, c], -[[d, e, f]]';
  const sqlArray = parseQueryToArray(query);
  t.deepEqual(sqlArray, [
    new Operator(Operator.type('unary-minus'), 1, 1),
    [
      'a',
      'b',
      'c',
    ],
    new Operator('-', 2, 4),
    [
      'd',
      'e',
      'f',
    ],
  ]);
});

test('This array structure is useful for displaying the query on the front-end, e.g. as HTML', (t) => {
  const query = '(name = "First Last") AND age >= (20 + 7)';
  const sqlArray = parseQueryToArray(query);

  // This function will recursively map the elements of the array to HTML.
  const toHtml = (toConvert) => {
    if (toConvert && toConvert.constructor === Operator) {
      return `<strong class="operator">${toConvert}</strong>`;
    }
    if (!toConvert || !(toConvert.constructor === Array)) {
      return `<span class="operand">${toConvert}</span>`;
    }

    const html = toConvert.map((i) => toHtml(i));
    return `<div class="expression">${html.join('')}</div>`;
  };
  t.deepEqual(
    toHtml(sqlArray),
    '<div class="expression">'
          + '<div class="expression">'
              + '<span class="operand">name</span>'
              + '<strong class="operator">=</strong>'
              + '<span class="operand">First Last</span>'
          + '</div>'
          + '<strong class="operator">AND</strong>'
          + '<span class="operand">age</span>'
          + '<strong class="operator">>=</strong>'
          + '<div class="expression">'
              + '<span class="operand">20</span>'
              + '<strong class="operator">+</strong>'
              + '<span class="operand">7</span>'
          + '</div>'
      + '</div>',
  );
});
