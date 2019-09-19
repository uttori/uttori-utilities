/* eslint-disable no-console, no-loop-func */
const test = require('ava');
const { FileUtility, NaiveBayes, Fisher } = require('../src');

const messages = [
  ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'clean'],
  ['Donec faucibus vulputate feugiat.', 'spam'],
  ['Duis eu sapien nec elit consectetur convallis.', 'clean'],
  [1, 'spam'],
];

const cyrillic = [
  ['агентство веб-решений: https://seorussian.ru', 'spam'],
  ['увеличение посещаемости и конверсии сайта - https://seorussian.ru - seorussian.ru', 'spam'],
  ['Маргарет Смит начала играть в теннис в восьмилетнем возрасте.', 'clean'],
  ['В 1967 году Маргарет не участвовала в теннисных соревнованиях', 'clean'],
  ['Перевод денег на ваш кошелек прошел успешно', 'spam'],
  ['Этим сообщением уведомляем Bac o готовности вывода суммы на Baш аккаунт. Чековая книжка', 'spam'],
  [[], 'spam'],
];

test('Classifier: can load a model and use it', (t) => {
  const filter = new NaiveBayes();

  messages.forEach(([message, category]) => {
    filter.train(message, category);
  });
  filter.setThreshold('bad', 0.5);
  filter.setMinimum('bad', 0.65); // Unused

  t.is(filter.classify(messages[0][0]), 'clean');
  t.is(filter.classify(messages[1][0]), 'spam');
  t.is(filter.classify(messages[2][0]), 'clean');

  filter.save('test', 'test', 'json', 'utf8');

  const loaded = FileUtility.readJSONSync('test', 'test', 'json');
  const filter2 = new NaiveBayes(loaded);

  t.is(filter2.classify(messages[0][0]), 'clean');
  t.is(filter2.classify(messages[1][0]), 'spam');
  t.is(filter2.classify(messages[2][0]), 'clean');
  t.is(filter2.categoryCount('clean'), 2);
  t.is(filter2.categoryCount('missing'), 0);
  t.is(filter2.featureProbability('lorem', 'clean'), 0.5);
  t.is(filter2.featureProbability('missing', 'missing'), 0);


  FileUtility.deleteFileSync('test', 'test', 'json');
});

test('NaiveBayes: can train with Cyrillic characters', (t) => {
  const filter = new NaiveBayes();

  cyrillic.forEach(([message, category]) => {
    filter.train(message, category);
  });
  filter.setThreshold('bad', 0.5);
  filter.setMinimum('bad', 0.65); // Unused

  t.is(filter.classify(cyrillic[0][0]), 'spam');
  t.is(filter.classify(cyrillic[1][0]), 'spam');
  t.is(filter.classify(cyrillic[2][0]), 'clean');
  t.is(filter.classify(cyrillic[3][0]), 'clean');
  t.is(filter.classify(cyrillic[4][0]), 'spam');
  t.is(filter.classify(cyrillic[5][0]), 'spam');
});

test('Fisher: can train with Cyrillic characters', (t) => {
  const filter = new Fisher();

  cyrillic.forEach(([message, category]) => {
    filter.train(message, category);
  });
  filter.setThreshold('bad', 0.5);
  filter.setMinimum('bad', 0.65); // Unused

  t.is(filter.classify(cyrillic[0][0]), 'spam');
  t.is(filter.classify(cyrillic[1][0]), 'spam');
  t.is(filter.classify(cyrillic[2][0]), 'clean');
  t.is(filter.classify(cyrillic[3][0]), 'clean');
  t.is(filter.classify(cyrillic[4][0]), 'spam');
  t.is(filter.classify(cyrillic[5][0]), 'spam');
});

test('NaiveBayes: ignores non string values with "_"', (t) => {
  const filter = new NaiveBayes();

  messages.forEach(([message, category]) => {
    filter.train(message, category);
  });
  filter.setThreshold('bad', 0.5);
  filter.setMinimum('bad', 0.65); // Unused

  t.is(filter.classify(''), '_');
  t.is(filter.classify(null), '_');
  t.is(filter.classify(undefined), '_');
  t.is(filter.classify(NaN), '_');
  t.is(filter.classify(1), '_');
  t.is(filter.classify([]), '_');
  t.is(filter.classify({}), '_');
});

test('Fisher: ignores non string values with "_"', (t) => {
  const filter = new Fisher();

  messages.forEach(([message, category]) => {
    filter.train(message, category);
  });
  filter.setThreshold('bad', 0.5);
  filter.setMinimum('bad', 0.65); // Unused

  t.is(filter.classify(''), '_');
  t.is(filter.classify(null), '_');
  t.is(filter.classify(undefined), '_');
  t.is(filter.classify(NaN), '_');
  t.is(filter.classify(1), '_');
  t.is(filter.classify([]), '_');
  t.is(filter.classify({}), '_');
});

test('NaiveBayes: can train and categorize the same imput correctly', (t) => {
  const filter = new NaiveBayes();

  messages.forEach(([message, category]) => {
    filter.train(message, category);
  });
  filter.setThreshold('bad', 0.5);
  filter.setMinimum('bad', 0.65); // Unused

  t.is(filter.classify(messages[0][0]), 'clean');
  t.is(filter.classify(messages[1][0]), 'spam');
  t.is(filter.classify(messages[2][0]), 'clean');
});

test('Fisher: can train and categorize the same imput correctly', (t) => {
  const filter = new Fisher();

  messages.forEach(([message, category]) => {
    filter.train(message, category);
  });
  filter.setThreshold('bad', 0.5); // Unused
  filter.setMinimum('bad', 0.65);

  t.is(filter.classify(messages[0][0]), 'clean');
  t.is(filter.classify(messages[1][0]), 'spam');
  t.is(filter.classify(messages[2][0]), 'clean');
});
