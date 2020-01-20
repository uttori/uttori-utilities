/* eslint-disable ramda/prefer-ramda-boolean, no-new */
const test = require('ava');
const sinon = require('sinon');
const { UttoriEvent } = require('../src');

const a = () => false;
const b = () => true;

test('#constructor(label): can setup an event and throws an error with invalid labels', (t) => {
  t.notThrows(() => { new UttoriEvent('test'); });
  t.throws(() => { new UttoriEvent(''); });
  t.throws(() => { new UttoriEvent(null); });
  t.throws(() => { new UttoriEvent(undefined); });
  t.throws(() => { new UttoriEvent(); });
  t.throws(() => { new UttoriEvent(NaN); });
  t.throws(() => { new UttoriEvent(1); });
  t.throws(() => { new UttoriEvent(1.2); });
  t.throws(() => { new UttoriEvent(true); });
  t.throws(() => { new UttoriEvent(false); });
  t.throws(() => { new UttoriEvent(() => {}); });
});

test('#register(callback): throws an error with invalid callbacks', (t) => {
  const event = new UttoriEvent('test');
  t.notThrows(() => { event.register(a); });
  t.notThrows(() => { event.register(() => true); });
  // eslint-disable-next-line prefer-arrow-callback
  t.notThrows(() => { event.register(function named() { return true; }); });
  t.throws(() => { event.register(); });
  t.throws(() => { event.register(''); });
  t.throws(() => { event.register(null); });
  t.throws(() => { event.register(undefined); });
  t.throws(() => { event.register(1); });
  t.throws(() => { event.register(1.2); });
  t.throws(() => { event.register(true); });
  t.throws(() => { event.register(false); });
  t.throws(() => { event.register(NaN); });
});

test('#register(callback): adds callbacks to the event', (t) => {
  const event = new UttoriEvent('test');
  t.is(event.callbacks.length, 0);

  event.register(a);
  t.is(event.callbacks.length, 1);

  event.register(a);
  t.is(event.callbacks.length, 1);

  event.register(b);
  t.is(event.callbacks.length, 2);
});

test('#unregister(callback): throws an error with invalid callbacks', (t) => {
  const event = new UttoriEvent('test');
  t.notThrows(() => { event.unregister(a); });
  t.notThrows(() => { event.unregister(() => true); });
  // eslint-disable-next-line prefer-arrow-callback
  t.notThrows(() => { event.unregister(function named() { return true; }); });
  t.throws(() => { event.unregister(); });
  t.throws(() => { event.unregister(''); });
  t.throws(() => { event.unregister(null); });
  t.throws(() => { event.unregister(undefined); });
  t.throws(() => { event.unregister(1); });
  t.throws(() => { event.unregister(1.2); });
  t.throws(() => { event.unregister(true); });
  t.throws(() => { event.unregister(false); });
  t.throws(() => { event.unregister(NaN); });
});

test('#unregister(callback): removes callbacks from the event', (t) => {
  const event = new UttoriEvent('test');
  t.is(event.callbacks.length, 0);
  event.register(a);
  event.register(b);
  t.is(event.callbacks.length, 2);

  event.unregister(a);
  t.is(event.callbacks.length, 1);

  event.unregister(b);
  t.is(event.callbacks.length, 0);

  event.unregister(b);
  t.is(event.callbacks.length, 0);
});

test('#validate(data, context): returns true when the data is invalid, false when data is valid', async (t) => {
  const addB = (data) => data.length !== 3;
  const addC = (data) => data === 'def';
  const addD = async (data) => {
    const output = await Promise.resolve(data);
    return typeof output !== 'string';
  };

  const event = new UttoriEvent('test');
  t.is(event.callbacks.length, 0);
  event.register(addB);
  event.register(addC);
  event.register(addD);
  t.is(event.callbacks.length, 3);

  let final = null;
  final = await event.validate('abc');
  t.is(final, false);

  final = await event.validate('ab');
  t.is(final, true);

  final = await event.validate('def');
  t.is(final, true);
});

test('#validate(data, context): returns false when there are no callbacks', async (t) => {
  const event = new UttoriEvent('test');
  t.is(event.callbacks.length, 0);

  let final = null;
  final = await event.validate('abc');
  t.is(final, false);

  final = await event.validate('ab');
  t.is(final, false);

  final = await event.validate('def');
  t.is(final, false);
});

test('#validate(data, context): returns true when a callback returns a non boolean type', async (t) => {
  const addB = (data) => data.length !== 3;
  const addC = (data) => data;
  const addD = async (data) => {
    const output = await Promise.resolve(data);
    return typeof output !== 'string';
  };

  const event = new UttoriEvent('test');
  t.is(event.callbacks.length, 0);
  event.register(addB);
  event.register(addC);
  event.register(addD);
  t.is(event.callbacks.length, 3);

  let final = null;
  final = await event.validate('abc');
  t.is(final, true);

  final = await event.validate('ab');
  t.is(final, true);

  final = await event.validate('def');
  t.is(final, true);
});

test('#filter(data, context): executes the callbacks on the event', async (t) => {
  const spy_a = sinon.spy();
  const data = { cool: 'very' };

  const event = new UttoriEvent('test');
  t.is(event.callbacks.length, 0);
  event.register(spy_a);
  t.is(event.callbacks.length, 1);

  await event.filter(data);
  t.is(spy_a.callCount, 1);
  t.true(spy_a.calledWith(data));

  await event.filter();
  t.is(spy_a.callCount, 2);
  t.true(spy_a.calledWith(undefined));
});

test('#filter(data, context): returns the data', async (t) => {
  const input = 'a';

  const addB = (data) => `${data}b`;
  const addC = (data) => `${data}c`;
  const addD = async (data) => {
    const output = await Promise.resolve(data);
    return `${output}d`;
  };
  const addE = async (data) => {
    const promise = new Promise((resolve, _reject) => {
      setTimeout(() => resolve(`${data}e`), 500);
    });
    const result = await promise;
    return result;
  };
  const addF = async (data) => `${data}f`;
  const nop = async (data) => Promise.resolve(data);

  const event = new UttoriEvent('test');
  t.is(event.callbacks.length, 0);
  event.register(addB);
  event.register(addC);
  event.register(addD);
  event.register(nop);
  event.register(addE);
  event.register(addF);
  t.is(event.callbacks.length, 6);

  const final = await event.filter(input);

  t.is(final, 'abcdef');
});

test('#fire(data, context): executes the callbacks on the event', (t) => {
  const spy_a = sinon.spy();
  const data = { cool: 'very' };

  const event = new UttoriEvent('test');
  t.is(event.callbacks.length, 0);
  event.register(spy_a);
  t.is(event.callbacks.length, 1);

  event.fire(data);
  t.is(spy_a.callCount, 1);
  t.true(spy_a.calledWith(data));

  event.fire();
  t.is(spy_a.callCount, 2);
  t.true(spy_a.calledWith(undefined));
});

test('#fetch(data, context): executes the callbacks on the event', async (t) => {
  const spy_a = sinon.spy();
  const data = { cool: 'very' };

  const event = new UttoriEvent('test');
  t.is(event.callbacks.length, 0);
  event.register(spy_a);
  t.is(event.callbacks.length, 1);

  await event.fetch(data);
  t.is(spy_a.callCount, 1);
  t.true(spy_a.calledWith(data));

  await event.fetch();
  t.is(spy_a.callCount, 2);
  t.true(spy_a.calledWith(undefined));
});

test('#fetch(data, context): returns the data', async (t) => {
  const input = 'a';

  const addB = (data) => `${data}b`;
  const addC = (data) => `${data}c`;
  const addD = async (data) => {
    const output = await Promise.resolve(data);
    return `${output}d`;
  };
  const addE = async (data) => {
    const promise = new Promise((resolve, _reject) => {
      setTimeout(() => resolve(`${data}e`), 500);
    });
    const result = await promise;
    return result;
  };
  const addF = async (data) => `${data}f`;
  const nop = async (data) => Promise.resolve(data);

  const event = new UttoriEvent('test');
  t.is(event.callbacks.length, 0);
  event.register(addB);
  event.register(addC);
  event.register(addD);
  event.register(nop);
  event.register(addE);
  event.register(addF);
  t.is(event.callbacks.length, 6);

  const final = await event.fetch(input);

  t.deepEqual(final, ['ab', 'ac', 'ad', 'a', 'ae', 'af']);
});
