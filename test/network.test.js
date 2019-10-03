const test = require('ava');
const express = require('express');

const { Network } = require('../src');

let server;

test.before(() => {
  server = express();
  server.set('port', process.env.PORT || 8123);
  server.set('ip', process.env.IP || '127.0.0.1');
  server.get('/user', (req, res) => {
    res.status(200).json({ name: 'tobi' });
  });
  server.post('/user', (req, res) => {
    res.status(200).json({ update: true });
  });
  server.get('/error', (req, res) => {
    res.status(200).json();
  });
  server.get('/text', (req, res) => {
    res.status(200).send('not json');
  });
  server.get('/empty', (req, res) => {
    res.status(200).send('');
  });
  server.listen(server.get('port'), server.get('ip'));
});

test('Network: can make a HTTP GET request', async (t) => {
  let output;
  output = await Network.json('http://127.0.0.1:8123/user');
  t.deepEqual(output, { name: 'tobi' });

  output = await Network.json('http://127.0.0.1:8123/user', {});
  t.deepEqual(output, { name: 'tobi' });

  output = await Network.json('http://127.0.0.1:8123/user', {}, { presponseEncoding: 'utf8' });
  t.deepEqual(output, { name: 'tobi' });


  output = await Network.raw('http://127.0.0.1:8123/user');
  t.is(output.responseBody, '{"name":"tobi"}');

  output = await Network.raw('http://127.0.0.1:8123/user', {});
  t.is(output.responseBody, '{"name":"tobi"}');

  output = await Network.raw('http://127.0.0.1:8123/user', {}, { presponseEncoding: 'utf8' });
  t.is(output.responseBody, '{"name":"tobi"}');

  output = await Network.request('http://127.0.0.1:8123/user');
  t.is(output, '{"name":"tobi"}');

  output = await Network.request('http://127.0.0.1:8123/user', {});
  t.is(output, '{"name":"tobi"}');

  output = await Network.request('http://127.0.0.1:8123/user', {}, { presponseEncoding: 'utf8' });
  t.is(output, '{"name":"tobi"}');
});

test('Network: can make a HTTP POST request', async (t) => {
  let output;
  output = await Network.json('http://127.0.0.1:8123/user', { method: 'POST' }, { data: '{ "update": 1 }' });
  t.deepEqual(output, { update: true });

  output = await Network.raw('http://127.0.0.1:8123/user', { method: 'POST' }, { data: '{ "update": 1 }' });
  t.is(output.responseBody, '{"update":true}');

  output = await Network.request('http://127.0.0.1:8123/user', { method: 'POST' }, { data: '{ "update": 1 }', responseEncoding: 'utf8' });
  t.is(output, '{"update":true}');
});

test('Network.json(): can set a fallback', async (t) => {
  const output = await Network.json('http://127.0.0.1:8123/error', { method: 'GET' }, { fallback: 'ok' });
  t.is(output, 'ok');
});

test('Network.json(): can set a fallback with an error', async (t) => {
  const output = await Network.json('http://127.0.0.1:8123/text', { method: 'GET' }, { fallback: 'ok' });
  t.is(output, 'ok');
});

test('Network.request(): can set a fallback with an error', async (t) => {
  const output = await Network.request('http://127.0.0.1:8123/empty', { method: 'GET' }, { fallback: 'ok' });
  t.is(output, 'ok');
});
