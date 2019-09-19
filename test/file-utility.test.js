const fs = require('fs-extra');
const test = require('ava');
const Document = require('uttori-document');
const { FileUtility } = require('../src');

const config = {
  content_dir: 'test/site/content',
  history_dir: 'test/site/content/history',
  extension: 'json',
  spaces_document: null,
  spaces_history: null,
};

const example = {
  title: 'Example Title',
  slug: 'example-title',
  content: '## Example Title',
  html: '',
  updateDate: 1459310452001,
  createDate: 1459310452001,
  tags: ['Example Tag'],
  customData: {
    keyA: 'value-a',
    keyB: 'value-b',
    keyC: 'value-c',
  },
};

test.beforeEach(async () => {
  await fs.remove('test/site');
  await fs.ensureDir('test/site/content/history', { recursive: true });
  await fs.ensureDir('test/site/data', { recursive: true });
  await fs.writeFile('test/site/content/example-title.json', JSON.stringify(example));
  await fs.writeFile('test/site/data/visits.json', '{"example-title":2,"demo-title":0,"fake-title":1}');
});

test.afterEach.always(async () => {
  await fs.remove('test/site');
});

test('ensureDirectory(folder): ensures a directory exists', async (t) => {
  const path = 'test/site/ensure-dir-works/with/nested/folders';
  await FileUtility.ensureDirectory(path);
  t.true(fs.existsSync(path));
});

test('ensureDirectorySync(folder): ensures a directory exists', (t) => {
  const path = 'test/site/ensure-dir-works/with/nested/folders';
  FileUtility.ensureDirectorySync(path);
  t.true(fs.existsSync(path));
});

test('readFile(folder, name, extension, encoding): returns a document found by name', async (t) => {
  const result = await FileUtility.readFile(config.content_dir, example.slug, config.extension);
  t.is(result, JSON.stringify(example));
});


test('readFileSync(folder, name, extension, encoding): returns a document found by name', (t) => {
  const result = FileUtility.readFileSync(config.content_dir, example.slug, config.extension);
  t.is(result, JSON.stringify(example));
});

test('readJSON(folder, name, extension, encoding): returns a document found by name', async (t) => {
  const result = await FileUtility.readJSON(config.content_dir, example.slug, config.extension);
  t.is(JSON.stringify(result), JSON.stringify(example));
});

test('readJSON(folder, name, extension, encoding): returns undefined when no name is provided', async (t) => {
  const result = await FileUtility.readJSON(config, config.content_dir, '');
  t.is(result, undefined);
});

test('readJSON(folder, name, extension, encoding): returns undefined when unable to read file', async (t) => {
  // const stub = sinon.stub(fs, 'readJSONSync'); // BUG: https://github.com/avajs/ava/issues/1359
  const result = await FileUtility.readJSON(config.content_dir, 'missing', config.extension);
  t.is(result, undefined);
});

test('readJSONSync(folder, name, extension, encoding): returns a document found by name', (t) => {
  const result = FileUtility.readJSONSync(config.content_dir, example.slug, config.extension);
  t.is(JSON.stringify(result), JSON.stringify(example));
});

test('readJSONSync(folder, name, extension, encoding): returns undefined when no name is provided', (t) => {
  const result = FileUtility.readJSONSync(config, config.content_dir, '');
  t.is(result, undefined);
});

test('readJSONSync(folder, name, extension, encoding): returns undefined when unable to read file', (t) => {
  // const stub = sinon.stub(fs, 'readJSONSync'); // BUG: https://github.com/avajs/ava/issues/1359
  const result = FileUtility.readJSONSync(config.content_dir, 'missing', config.extension);
  t.is(result, undefined);
});

test('readFolder(folder): returns the contents of the folder', async (t) => {
  const result = await FileUtility.readFolder('test/site/content');
  t.deepEqual(result.sort(), [
    'example-title',
    'history',
  ]);
});

test('readFolder(folder): returns undefined when no folder is provided', async (t) => {
  const result = await FileUtility.readFolder('');
  t.deepEqual(result, []);
});

test('readFolderSync(folder): returns undefined when no folder is provided', (t) => {
  const result = FileUtility.readFolderSync('');
  t.deepEqual(result, []);
});

test('readFolderSync(folder): returns the contents of the folder', (t) => {
  const result = FileUtility.readFolderSync('test/site/content');
  t.deepEqual(result.sort(), [
    'example-title',
    'history',
  ]);
});

test('writeFile(folder, name, extension, content, encoding): writes the file to disk', async (t) => {
  const document = new Document();
  document.title = 'Third Title';
  document.tags = ['Third Tag'];
  document.createDate = 1459310452001;
  document.updateDate = 1459310452001;
  document.content = '## Third Title';
  document.slug = 'Third-title';
  document.customData = {
    keyA: 'value-a',
    keyB: 'value-b',
    keyC: 'value-c',
  };
  await FileUtility.writeFile(config.content_dir, document.slug, config.extension, JSON.stringify(document));
  const result = await FileUtility.readJSON(config.content_dir, document.slug, config.extension);
  t.is(JSON.stringify(result), JSON.stringify(document));
});

test('writeFileSync(folder, name, extension, content, encoding): writes the file to disk', (t) => {
  const document = new Document();
  document.title = 'Third Title';
  document.tags = ['Third Tag'];
  document.createDate = 1459310452001;
  document.updateDate = 1459310452001;
  document.content = '## Third Title';
  document.slug = 'Third-title';
  document.customData = {
    keyA: 'value-a',
    keyB: 'value-b',
    keyC: 'value-c',
  };
  FileUtility.writeFileSync(config.content_dir, document.slug, config.extension, JSON.stringify(document));
  const result = FileUtility.readJSONSync(config.content_dir, document.slug, config.extension);
  t.is(JSON.stringify(result), JSON.stringify(document));
});

test('deleteFile(folder, name, extension): removes the file from disk', async (t) => {
  const document = new Document();
  document.title = 'Third Title';
  document.tags = ['Third Tag'];
  document.createDate = 1459310452001;
  document.updateDate = 1459310452001;
  document.content = '## Third Title';
  document.slug = 'Third-title';
  document.customData = {
    keyA: 'value-a',
    keyB: 'value-b',
    keyC: 'value-c',
  };
  await FileUtility.writeFile(config.content_dir, document.slug, config.extension, JSON.stringify(document));
  let result = await FileUtility.readJSON(config.content_dir, document.slug, config.extension);
  t.is(JSON.stringify(result), JSON.stringify(document));
  await FileUtility.deleteFile(config.content_dir, document.slug, config.extension);
  result = await FileUtility.readJSON(config.content_dir, document.slug, config.extension);
  t.is(result, undefined);
});

test('deleteFileSync(folder, name, extension): removes the file from disk', (t) => {
  const document = new Document();
  document.title = 'Third Title';
  document.tags = ['Third Tag'];
  document.createDate = 1459310452001;
  document.updateDate = 1459310452001;
  document.content = '## Third Title';
  document.slug = 'Third-title';
  document.customData = {
    keyA: 'value-a',
    keyB: 'value-b',
    keyC: 'value-c',
  };
  FileUtility.writeFileSync(config.content_dir, document.slug, config.extension, JSON.stringify(document));
  let result = FileUtility.readJSONSync(config.content_dir, document.slug, config.extension);
  t.is(JSON.stringify(result), JSON.stringify(document));
  FileUtility.deleteFileSync(config.content_dir, document.slug, config.extension);
  result = FileUtility.readJSONSync(config.content_dir, document.slug, config.extension);
  t.is(result, undefined);
});
