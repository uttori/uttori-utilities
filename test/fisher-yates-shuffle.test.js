const test = require('ava');
const { FYShuffle } = require('../src');

test('FYShuffle(array): returns a randomized array', (t) => {
  const output = FYShuffle(['1', '2', '3']);
  t.is(output.length, 3);
});

test('FYShuffle(array): returns the input value when not an array or an empty array', (t) => {
  t.notThrows(() => {
    FYShuffle();
    FYShuffle(0);
    FYShuffle(true);
    FYShuffle(false);
    FYShuffle(NaN);
    FYShuffle(null);
    FYShuffle({});
    FYShuffle([]);
  });
});
