/* eslint-disable ramda/prefer-ramda-boolean, no-new */
const test = require('ava');
const { EventDispatcher } = require('../src');

const a = () => false;
const b = () => true;

test('#constructor: can setup an EventDispatcher', (t) => {
  t.notThrows(() => { new EventDispatcher('test'); });
});

test('#dispatch: throws an error with invalid callbacks', (t) => {
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

test('#dispatch: can dispatch an event', (t) => {
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

test('#on: adds callbacks to the given event', (t) => {
  const ed = new EventDispatcher();
  t.is(Object.keys(ed.events).length, 0);
  ed.on('test', a);
  t.is(Object.keys(ed.events).length, 1);
  ed.on('test', b);
  t.is(Object.keys(ed.events).length, 1);
});

test('#on: throws an error with invalid label or callback', (t) => {
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

test('#off: removes callbacks from the given event', (t) => {
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
