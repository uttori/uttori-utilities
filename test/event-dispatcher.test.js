/* eslint-disable ramda/prefer-ramda-boolean, no-new */
const test = require('ava');
const sinon = require('sinon');
const { EventDispatcher } = require('../src');

const a = () => false;
const b = () => true;

test('#constructor: can setup an EventDispatcher', (t) => {
  t.notThrows(() => { new EventDispatcher('test'); });
});

test('#filter(label, data, context): throws an error with invalid callbacks', async (t) => {
  const ed = new EventDispatcher();
  await t.notThrowsAsync(async () => { await ed.filter('test'); });
  await t.notThrowsAsync(async () => { await ed.filter('test', {}); });
  await t.throwsAsync(async () => { await ed.filter(() => true); });
  await // eslint-disable-next-line prefer-arrow-callback
  await t.throwsAsync(async () => { await ed.filter(function named() { return true; }); });
  await t.throwsAsync(async () => { await ed.filter(); });
  await t.throwsAsync(async () => { await ed.filter(''); });
  await t.throwsAsync(async () => { await ed.filter(null); });
  await t.throwsAsync(async () => { await ed.filter(undefined); });
  await t.throwsAsync(async () => { await ed.filter(1); });
  await t.throwsAsync(async () => { await ed.filter(1.2); });
  await t.throwsAsync(async () => { await ed.filter(true); });
  await t.throwsAsync(async () => { await ed.filter(false); });
  await t.throwsAsync(async () => { await ed.filter(NaN); });
});

test('#filter(label, data, context): can dispatch an event', async (t) => {
  const ed = new EventDispatcher();
  ed.on('test', a);
  await t.notThrowsAsync(async () => { await ed.filter('test'); });
  await t.notThrowsAsync(async () => { await ed.filter('test', {}); });
  await t.throwsAsync(async () => { await ed.dispafiltertch(() => true); });
  await // eslint-disable-next-line prefer-arrow-callback
  await t.throwsAsync(async () => { await ed.filter(function named() { return true; }); });
  await t.throwsAsync(async () => { await ed.filter(); });
  await t.throwsAsync(async () => { await ed.filter(''); });
  await t.throwsAsync(async () => { await ed.filter(null); });
  await t.throwsAsync(async () => { await ed.filter(undefined); });
  await t.throwsAsync(async () => { await ed.filter(1); });
  await t.throwsAsync(async () => { await ed.filter(1.2); });
  await t.throwsAsync(async () => { await ed.filter(true); });
  await t.throwsAsync(async () => { await ed.filter(false); });
  await t.throwsAsync(async () => { await ed.filter(NaN); });
});

test('#dispatch(label, data, context): throws an error with invalid callbacks', (t) => {
  const ed = new EventDispatcher();
  t.notThrows(() => { ed.dispatch('test'); });
  t.notThrows(() => { ed.dispatch('test', {}); });
  t.throws(() => { ed.dispatch(() => true); });
  // eslint-disable-next-line prefer-arrow-callback
  t.throws(() => { ed.dispatch(function named() { return true; }); });
  t.throws(() => { ed.dispatch(); });
  t.throws(() => { ed.dispatch(''); });
  t.throws(() => { ed.dispatch(null); });
  t.throws(() => { ed.dispatch(undefined); });
  t.throws(() => { ed.dispatch(1); });
  t.throws(() => { ed.dispatch(1.2); });
  t.throws(() => { ed.dispatch(true); });
  t.throws(() => { ed.dispatch(false); });
  t.throws(() => { ed.dispatch(NaN); });
});

test('#dispatch(label, data, context): can dispatch an event', (t) => {
  const ed = new EventDispatcher();
  ed.on('test', a);
  t.notThrows(() => { ed.dispatch('test'); });
  t.notThrows(() => { ed.dispatch('test', {}); });
  t.throws(() => { ed.dispatch(() => true); });
  // eslint-disable-next-line prefer-arrow-callback
  t.throws(() => { ed.dispatch(function named() { return true; }); });
  t.throws(() => { ed.dispatch(); });
  t.throws(() => { ed.dispatch(''); });
  t.throws(() => { ed.dispatch(null); });
  t.throws(() => { ed.dispatch(undefined); });
  t.throws(() => { ed.dispatch(1); });
  t.throws(() => { ed.dispatch(1.2); });
  t.throws(() => { ed.dispatch(true); });
  t.throws(() => { ed.dispatch(false); });
  t.throws(() => { ed.dispatch(NaN); });
});

test('#filter(label, data, context): can return dispatched event modified data', async (t) => {
  const ed = new EventDispatcher();

  const input = { cool: 'very', update: 'a' };

  const addB = (data) => ({ ...data, update: `${data.update}b` });
  const addC = (data) => ({ ...data, update: `${data.update}c` });
  const addD = async (data) => {
    const output = await Promise.resolve(data);
    return { ...output, update: `${data.update}d` };
  };
  const addE = async (data) => {
    const promise = new Promise((resolve, _reject) => {
      setTimeout(() => resolve({ ...data, update: `${data.update}e` }), 500);
    });
    const result = await promise;
    return result;
  };
  const addF = async (data) => ({ ...data, update: `${data.update}f` });
  const nop = async (data) => Promise.resolve(data);

  ed.on('test', addC);
  ed.on('test', addB);
  ed.on('test', addD);
  ed.on('test', nop);
  ed.on('test', addF);
  ed.on('test', addE);

  const output = await ed.filter('test', input);

  t.deepEqual(output, { cool: 'very', update: 'acbdfe' });
});

test('#dispatch(label, data, context): fires events, but does not return any data', (t) => {
  const ed = new EventDispatcher();
  const spy_a = sinon.spy();
  const spy_b = sinon.spy();

  const input = { cool: 'very', update: 'a' };

  ed.on('test', spy_a);
  ed.on('test', spy_b);
  ed.dispatch('test', input);

  t.is(spy_a.callCount, 1);
  t.true(spy_a.calledWith(input));

  t.is(spy_a.callCount, 1);
  t.true(spy_a.calledWith(input));
});

test('#on(label, callback): adds callbacks to the given event', (t) => {
  const ed = new EventDispatcher();
  t.is(Object.keys(ed.events).length, 0);
  ed.on('test', a);
  t.is(Object.keys(ed.events).length, 1);
  ed.on('test', b);
  t.is(Object.keys(ed.events).length, 1);
});

test('#on(label, callback): throws an error with invalid label or callback', (t) => {
  const ed = new EventDispatcher();
  t.throws(() => { ed.on('', a); });
  t.throws(() => { ed.on(null, a); });
  t.throws(() => { ed.on(undefined, a); });
  t.throws(() => { ed.on(1, a); });
  t.throws(() => { ed.on(1.2, a); });
  t.throws(() => { ed.on(true, a); });
  t.throws(() => { ed.on(false, a); });
  t.throws(() => { ed.on(NaN, a); });

  t.throws(() => { ed.on('test'); });
  t.throws(() => { ed.on('test', ''); });
  t.throws(() => { ed.on('test', null); });
  t.throws(() => { ed.on('test', undefined); });
  t.throws(() => { ed.on('test', 1); });
  t.throws(() => { ed.on('test', 1.2); });
  t.throws(() => { ed.on('test', true); });
  t.throws(() => { ed.on('test', false); });
  t.throws(() => { ed.on('test', NaN); });
});

test('#off(label, callback): removes callbacks from the given event', (t) => {
  const ed = new EventDispatcher();
  t.is(Object.keys(ed.events).length, 0);
  ed.on('test', a);
  t.is(Object.keys(ed.events).length, 1);
  ed.on('test', b);
  t.is(Object.keys(ed.events).length, 1);
  ed.off('test', a);
  t.is(Object.keys(ed.events).length, 1);
  ed.off('test', b);
  t.is(Object.keys(ed.events).length, 0);
  ed.off('test', b);
  t.is(Object.keys(ed.events).length, 0);
});
