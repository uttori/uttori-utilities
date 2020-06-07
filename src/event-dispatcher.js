const debug = require('debug')('Uttori.Utilities.EventDispatcher');
const UttoriEvent = require('./event');

/**
 * An event bus system for registering, unregistering and triggering events.
 *
 * @property {object} events - The collection of events to listen for.
 * @example <caption>new EventDispatcher()</caption>
 * const bus = new EventDispatcher();
 * bus.on('update', callback);
 * bus.dispatch('update', { data }, { context });
 * bus.off('update', callback);
 * @class
 */
class EventDispatcher {
  /**
   * Creates a new EventDispatcher instance.
   *
   * @class
   */
  constructor() {
    this.events = {};
  }

  /**
   * Verifies an event label.
   *
   * @param {string} label - The human readable identifier of the event.
   * @example
   * EventDispatcher.check('event'); // No Error
   * EventDispatcher.check(1); // Throws Error
   * @static
   */
  static check(label) {
    if (typeof label !== 'string' || label.length === 0) {
      const error = `Event label must be a string, got: ${typeof label}`;
      debug(error);
      throw new Error(error);
    }
  }

  /**
   * Fires off an event with passed in data and context for a given label.
   *
   * @param {string} label - The human readable identifier of the event.
   * @param {*} data - Data to be used, updated, or modified by event callbacks.
   * @param {object} [context] - Context to help with updating or modification of the data.
   * @returns {Promise} - The conclusion of the spam checks, true being it is spam, false meaning it is clean.
   * @example
   * is_spam = await bus.validate('check-for-spam', { data }, this);
   * @async
   */
  async validate(label, data, context) {
    debug('validate:', label);
    EventDispatcher.check(label);
    const event = this.events[label];
    let result = false;
    if (event) {
      result = await event.validate(data, context);
    } else {
      debug('No event to fire:', label);
    }
    return result;
  }

  /**
   * Fires off an event with passed in data and context for a given label.
   *
   * @param {string} label - The human readable identifier of the event.
   * @param {*} data - Data to be used, updated, or modified by event callbacks.
   * @param {object} [context] - Context to help with updating or modification of the data.
   * @returns {*} - The original input data, either modified or untouched.
   * @example
   * output = await bus.filter('loaded', { data }, this);
   * @async
   */
  async filter(label, data, context) {
    debug('filter:', label);
    EventDispatcher.check(label);
    const event = this.events[label];
    if (event) {
      data = await event.filter(data, context);
    } else {
      debug('No event to fire:', label);
    }
    return data;
  }

  /**
   * Fires off an event with passed in data and context for a given label.
   *
   * @param {string} label - The human readable identifier of the event.
   * @param {*} data - Data to be used, updated, or modified by event callbacks.
   * @param {object} [context] - Context to help with updating or modification of the data.
   * @example
   * bus.dispatch('loaded', { data }, this);
   */
  dispatch(label, data, context) {
    debug('dispatch:', label);
    EventDispatcher.check(label);
    const event = this.events[label];
    if (event) {
      event.fire(data, context);
    } else {
      debug('No event to fire:', label);
    }
  }

  /**
   * Fires off an event with passed in data and context for a given label and returns an array of the results.
   *
   * @param {string} label - The human readable identifier of the event.
   * @param {*} data - Data to be used by event callbacks.
   * @param {object} [context] - Context to help with updating or modification of the data.
   * @returns {Array} - An array of the results.
   * @example
   * popular = await bus.fetch('popular-documents', { limit: 10 }, this);
   * @async
   */
  async fetch(label, data, context) {
    debug('fetch:', label);
    EventDispatcher.check(label);
    const event = this.events[label];
    let results = [];
    if (event) {
      results = await event.fetch(data, context);
    } else {
      debug('No event to fetch:', label);
    }
    return results;
  }

  /**
   * Add a function to an event that will be called when the label is dispatched.
   * If no label is found, one is created.
   *
   * @param {string} label - The human readable identifier of the event.
   * @param {Function} callback - Function to be called when the event is fired.
   * @example
   * bus.on('loaded', callback);
   */
  on(label, callback) {
    debug('on:', label);
    let event = this.events[label];
    if (!event) {
      event = new UttoriEvent(label);
      this.events[label] = event;
    }
    event.register(callback);
  }

  /**
   * Add a function to an event that will be called only once when the label is dispatched.
   * Uses the `EventDispatcher.on` method with a function wrapped to call off on use.
   *
   * @param {string} label - The human readable identifier of the event.
   * @param {Function} callback - Function to be called when the event is fired.
   * @example
   * bus.once('one-time-process', callback);
   */
  once(label, callback) {
    debug('once:', label);
    const cb = (...args) => {
      this.off(label, cb);
      callback.apply(this, args);
    };
    this.on(label, cb);
  }

  /**
   * Remove a function from an event.
   *
   * @param {string} label - The human readable identifier of the event.
   * @param {Function} callback - Function to be removed.
   * @example
   * bus.off('loaded', callback);
   */
  off(label, callback) {
    debug('off:', label);
    const event = this.events[label];
    if (event && event.callbacks.includes(callback)) {
      event.unregister(callback);
      if (event.callbacks.length === 0) {
        delete this.events[label];
      }
    } else {
      debug('No event to turn off:', label, callback);
    }
  }
}

module.exports = EventDispatcher;
