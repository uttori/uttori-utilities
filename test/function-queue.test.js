/* eslint-disable no-console, no-loop-func, ava/no-unknown-modifiers */
const test = require('ava');
const { FunctionQueue } = require('../src');

/**
 * Returns the requests per millisecond.
 *
 * @param {number} requests - The number of requests.
 * @param {number} time_started - The time started in MS.
 * @returns {number} the requests per millisecond.
 */
function calculateRPMS(requests, time_started) {
  return requests / (Date.now() - time_started);
}

const request_limit = 10; // NOTE: 100 for full coverage.

test.cb('throttled-queue: should queue all callbacks', (t) => {
  const max_requests_per_interval = 1;
  const interval = 200;
  const throttle = FunctionQueue.throttle(max_requests_per_interval, interval);
  let num_requests = 0;
  for (let x = 0; x < request_limit; x++) {
    throttle(() => {
      console.log('Throttling...');
      num_requests++;
    });
  }
  throttle(() => {
    if (num_requests !== request_limit) {
      throw new Error('Not all callbacks queued.');
    }
    t.end();
  });
});

test.cb('throttled-queue: should queue the callback within the interval', (t) => {
  const max_requests_per_interval = 1;
  const interval = 200;
  const throttle = FunctionQueue.throttle(max_requests_per_interval, interval);
  let last_executed = Date.now();
  let num_requests = 0;

  for (let x = 0; x < request_limit; x++) {
    throttle(() => {
      console.log('Throttling...');
      const now = Date.now();
      const time_elapsed = now - last_executed;
      if (time_elapsed < interval) {
        throw new Error('Did not honor interval.');
      }
      last_executed = now;
      num_requests++;
    });
  }
  throttle(() => {
    if (num_requests !== request_limit) {
      throw new Error('Not all callbacks queued.');
    }
    t.end();
  });
});

test.cb('throttled-queue: should queue the callback and honor the interval', (t) => {
  const max_requests_per_interval = 1;
  const interval = 500;
  const throttle = FunctionQueue.throttle(max_requests_per_interval, interval);
  const time_started = Date.now();
  const max_rpms = max_requests_per_interval / interval;
  let num_requests = 0;

  for (let x = 0; x < request_limit; x++) {
    throttle(() => {
      const rpms = calculateRPMS(++num_requests, time_started);
      console.log(rpms, max_rpms);
      if (rpms > max_rpms) {
        throw new Error('Did not honor interval.');
      }
    });
  }
  throttle(() => {
    if (num_requests !== request_limit) {
      throw new Error('Not all callbacks queued.');
    }
    t.end();
  });
});

test.cb('throttled-queue: should queue the callback and honor the interval with multiple requests per interval', (t) => {
  const max_requests_per_interval = 3;
  const interval = 1000;
  const throttle = FunctionQueue.throttle(max_requests_per_interval, interval);
  const time_started = Date.now();
  const max_rpms = max_requests_per_interval / interval;
  let num_requests = 0;

  for (let x = 0; x < request_limit; x++) {
    throttle(() => {
      const rpms = calculateRPMS(++num_requests, time_started);
      console.log(rpms, max_rpms);
      if (rpms > max_rpms) {
        throw new Error('Did not honor interval.');
      }
    });
  }
  throttle(() => {
    if (num_requests !== request_limit) {
      throw new Error('Not all callbacks queued.');
    }
    t.end();
  });
});

test.cb('throttled-queue: should queue the callback and honor the interval with multiple evenly spaced requests per interval', (t) => {
  const max_requests_per_interval = 3;
  const interval = 1000;
  const throttle = FunctionQueue.throttle(max_requests_per_interval, interval, true);
  const time_started = Date.now();
  const max_rpms = max_requests_per_interval / interval;
  let num_requests = 0;

  for (let x = 0; x < request_limit; x++) {
    throttle(() => {
      const rpms = calculateRPMS(++num_requests, time_started);
      console.log(rpms, max_rpms);
      if (rpms > max_rpms) {
        throw new Error('Did not honor interval.');
      }
    });
  }
  throttle(() => {
    if (num_requests !== request_limit) {
      throw new Error('Not all callbacks queued.');
    }
    t.end();
  });
});
