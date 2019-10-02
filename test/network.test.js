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
  server.listen(server.get('port'), server.get('ip'));
});

test('Network.request(): can make a HTTP GET request', async (t) => {
  let output;
  output = await Network.request('http://127.0.0.1:8123/user');
  t.is(output, '{"name":"tobi"}');

  output = await Network.request('http://127.0.0.1:8123/user', {}, { parseResponseBody: true });
  t.deepEqual(output, { name: 'tobi' });

  output = await Network.request('http://127.0.0.1:8123/user', {}, { parseResponseBody: true, responseEncoding: 'utf8' });
  t.deepEqual(output, { name: 'tobi' });
});

test('Network.request(): can make a HTTP POST request', async (t) => {
  let output;
  output = await Network.request('http://127.0.0.1:8123/user', { method: 'POST' }, { data: '{ "update": true }' });
  t.is(output, '{"update":true}');

  output = await Network.request('http://127.0.0.1:8123/user', { method: 'POST' }, { data: '{ "update": true }', parseResponseBody: true });
  t.deepEqual(output, { update: true });

  output = await Network.request('http://127.0.0.1:8123/user', { method: 'POST' }, { data: '{ "update": true }', parseResponseBody: true, responseEncoding: 'utf8' });
  t.deepEqual(output, { update: true });
});
