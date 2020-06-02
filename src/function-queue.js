const debug = require('debug')('Uttori.Utilities.FunctionQueue');

/**
 * Queue functionality for function calling.
 *
 * @example <caption>FunctionQueue.throttle(max_requests_per_interval, interval, evenly_spaced)</caption>
 * const throttle = FunctionQueue.throttle(max_requests_per_interval, interval, evenly_spaced);
 * throttle(() => { ... });
 * @class
 */
class FunctionQueue {
  /**
   * @param {number} max_requests_per_interval - The number of calls to execute for a single interval.
   * @param {number} interval - The time between calls in ms.
   * @param {boolean} evenly_spaced - Determines if all requests should be evenly spaced.
   * @returns {Function} A function that can enqueue items.
   * @static
   */
  static throttle(max_requests_per_interval, interval, evenly_spaced) {
    /**
     * If all requests should be evenly spaced, adjust them.
     */
    if (evenly_spaced) {
      interval /= max_requests_per_interval;
      max_requests_per_interval = 1;
    }

    /* istanbul ignore next */
    if (interval < 200) {
      debug('An interval of less than 200ms can create performance issues.');
    }

    const queue = [];
    let last_called = Date.now();
    let timeout;

    /**
     * Gets called at a set interval to remove items from the queue.
     * This is a self-adjusting timer, since the browser's setTimeout is highly inaccurate.
     */
    const dequeue = () => {
      const threshold = last_called + interval;
      const now = Date.now();

      /**
       * Adjust the timer if it was called too early.
       */
      /* istanbul ignore next */
      if (now < threshold) {
        clearTimeout(timeout);
        timeout = setTimeout(dequeue, threshold - now);
        return;
      }

      const callbacks = queue.splice(0, max_requests_per_interval);
      for (let x = 0; x < callbacks.length; x++) {
        callbacks[x]();
      }

      last_called = Date.now();
      if (queue.length > 0) {
        timeout = setTimeout(dequeue, interval);
      }
    };

    /**
     * Return a function that can enqueue items.
     *
     * @param {Function} callback - The callback to run throttled.
     */
    return (callback) => {
      queue.push(callback);
      if (!timeout) {
        timeout = setTimeout(dequeue, interval);
      }
    };
  }
}

module.exports = FunctionQueue;
