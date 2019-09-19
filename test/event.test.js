/* eslint-disable ramda/prefer-ramda-boolean, no-new */
const test = require('ava');
const sinon = require('sinon');
const { UttoriEvent } = require('../src');

const a = () => false;
const b = () => true;

test('#constructor: can setup an event and throws an error with invalid labels', (t) => {
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

test('#register: throws an error with invalid callbacks', (t) => {
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

test('#register: adds callbacks to the event', (t) => {
  const event = new UttoriEvent('test');
  t.is(event.callbacks.length, 0);

  event.register(a);
  t.is(event.callbacks.length, 1);

  event.register(a);
  t.is(event.callbacks.length, 1);

  event.register(b);
  t.is(event.callbacks.length, 2);
});

test('#unregister: throws an error with invalid callbacks', (t) => {
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

test('#unregister: removes callbacks from the event', (t) => {
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

test('#fire: executes the callbacks on the event', (t) => {
  const spy_a = sinon.spy();
  const spy_b = sinon.spy();
  const data = { cool: 'very' };

  const event = new UttoriEvent('test');
  t.is(event.callbacks.length, 0);
  event.register(spy_a);
  event.register(spy_b);
  t.is(event.callbacks.length, 2);

  event.fire(data);
  t.is(spy_a.callCount, 1);
  t.is(spy_b.callCount, 1);
  t.true(spy_a.calledWith(data));
  t.true(spy_b.calledWith(data));

  event.fire();
  t.is(spy_a.callCount, 2);
  t.is(spy_b.callCount, 2);
  t.true(spy_a.calledWith(undefined));
  t.true(spy_b.calledWith(undefined));
});
