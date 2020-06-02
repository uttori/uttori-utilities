const test = require('ava');
const { fyShuffle } = require('../src');

test('fyShuffle(array): returns a randomized array', (t) => {
  const output = fyShuffle(['1', '2', '3']);
  t.is(output.length, 3);
});

test('fyShuffle(array): returns the input value when not an array or an empty array', (t) => {
  t.notThrows(() => {
    fyShuffle();
    fyShuffle(0);
    fyShuffle(true);
    fyShuffle(false);
    fyShuffle(Number.NaN);
    fyShuffle(null);
    fyShuffle({});
    fyShuffle([]);
  });
});
