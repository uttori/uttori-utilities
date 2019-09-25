/* eslint-disable ramda/prefer-ramda-boolean, no-new */
const test = require('ava');
const { EventDispatcher } = require('../src');

const a = () => false;
const b = () => true;

test('#constructor: can setup an EventDispatcher', (t) => {
  t.notThrows(() => { new EventDispatcher('test'); });
});

test('#dispatch(label, data, context): throws an error with invalid callbacks', async (t) => {
  const ed = new EventDispatcher();
  await t.notThrowsAsync(async () => { await ed.dispatch('test'); });
  await t.notThrowsAsync(async () => { await ed.dispatch('test', {}); });
  await t.throwsAsync(async () => { await ed.dispatch(() => true); });
  await // eslint-disable-next-line prefer-arrow-callback
  await t.throwsAsync(async () => { await ed.dispatch(function named() { return true; }); });
  await t.throwsAsync(async () => { await ed.dispatch(); });
  await t.throwsAsync(async () => { await ed.dispatch(''); });
  await t.throwsAsync(async () => { await ed.dispatch(null); });
  await t.throwsAsync(async () => { await ed.dispatch(undefined); });
  await t.throwsAsync(async () => { await ed.dispatch(1); });
  await t.throwsAsync(async () => { await ed.dispatch(1.2); });
  await t.throwsAsync(async () => { await ed.dispatch(true); });
  await t.throwsAsync(async () => { await ed.dispatch(false); });
  await t.throwsAsync(async () => { await ed.dispatch(NaN); });
});

test('#dispatch(label, data, context): can dispatch an event', async (t) => {
  const ed = new EventDispatcher();
  ed.on('test', a);
  await t.notThrowsAsync(async () => { await ed.dispatch('test'); });
  await t.notThrowsAsync(async () => { await ed.dispatch('test', {}); });
  await t.throwsAsync(async () => { await ed.dispatch(() => true); });
  await // eslint-disable-next-line prefer-arrow-callback
  await t.throwsAsync(async () => { await ed.dispatch(function named() { return true; }); });
  await t.throwsAsync(async () => { await ed.dispatch(); });
  await t.throwsAsync(async () => { await ed.dispatch(''); });
  await t.throwsAsync(async () => { await ed.dispatch(null); });
  await t.throwsAsync(async () => { await ed.dispatch(undefined); });
  await t.throwsAsync(async () => { await ed.dispatch(1); });
  await t.throwsAsync(async () => { await ed.dispatch(1.2); });
  await t.throwsAsync(async () => { await ed.dispatch(true); });
  await t.throwsAsync(async () => { await ed.dispatch(false); });
  await t.throwsAsync(async () => { await ed.dispatch(NaN); });
});

test('#dispatchSync(label, data, context): throws an error with invalid callbacks', (t) => {
  const ed = new EventDispatcher();
  t.notThrows(() => { ed.dispatchSync('test'); });
  t.notThrows(() => { ed.dispatchSync('test', {}); });
  t.throws(() => { ed.dispatchSync(() => true); });
  // eslint-disable-next-line prefer-arrow-callback
  t.throws(() => { ed.dispatchSync(function named() { return true; }); });
  t.throws(() => { ed.dispatchSync(); });
  t.throws(() => { ed.dispatchSync(''); });
  t.throws(() => { ed.dispatchSync(null); });
  t.throws(() => { ed.dispatchSync(undefined); });
  t.throws(() => { ed.dispatchSync(1); });
  t.throws(() => { ed.dispatchSync(1.2); });
  t.throws(() => { ed.dispatchSync(true); });
  t.throws(() => { ed.dispatchSync(false); });
  t.throws(() => { ed.dispatchSync(NaN); });
});

test('#dispatchSync(label, data, context): can dispatch an event', (t) => {
  const ed = new EventDispatcher();
  ed.on('test', a);
  t.notThrows(() => { ed.dispatchSync('test'); });
  t.notThrows(() => { ed.dispatchSync('test', {}); });
  t.throws(() => { ed.dispatchSync(() => true); });
  // eslint-disable-next-line prefer-arrow-callback
  t.throws(() => { ed.dispatchSync(function named() { return true; }); });
  t.throws(() => { ed.dispatchSync(); });
  t.throws(() => { ed.dispatchSync(''); });
  t.throws(() => { ed.dispatchSync(null); });
  t.throws(() => { ed.dispatchSync(undefined); });
  t.throws(() => { ed.dispatchSync(1); });
  t.throws(() => { ed.dispatchSync(1.2); });
  t.throws(() => { ed.dispatchSync(true); });
  t.throws(() => { ed.dispatchSync(false); });
  t.throws(() => { ed.dispatchSync(NaN); });
});

test('#dispatch(label, data, context): can return dispatched event modified data', async (t) => {
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

  const output = await ed.dispatch('test', input);

  t.deepEqual(output, { cool: 'very', update: 'acbdfe' });
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
