const debug = require('debug')('Uttori.Utilities.UttoriEvent');

/**
 * Event class used in conjunction with the Event Dispatcher.
 * @property {String} label - The human readable identifier of the event.
 * @property {Function[]} callbacks - The functions to be executed when an event is fired.
 * @example <caption>new UttoriEvent(label)</caption>
 * const event = new UttoriEvent('event-label');
 * event.register(callback);
 * event.fire({ data });
 * @class
 */
class UttoriEvent {
  /**
   * Creates a new event UttoriEvent.
   * @param {String} label - The human readable identifier of the event.
   * @constructor
   */
  constructor(label) {
    if (typeof label !== 'string' || label.length === 0) {
      const error = `Event label must be a string, got: ${typeof label}`;
      debug(error);
      throw new Error(error);
    }
    this.label = label;
    this.callbacks = [];
  }

  /**
   * Add a function to an event that will be called when the event is fired.
   * @param {Function} callback - Function to be called when the event is fired.
   * @example
   * event.register(callback);
   * @memberof UttoriEvent
   */
  register(callback) {
    debug('register:', callback);
    if (typeof callback !== 'function') {
      const error = `Event callback must be a function, got: ${typeof callback}`;
      debug(error);
      throw new Error(error);
    }
    const index = this.callbacks.indexOf(callback);
    if (index === -1) {
      this.callbacks.push(callback);
    } else {
      debug('callback already registered, skipping');
    }
  }

  /**
   * Remove a function from an event that would be called when the event is fired.
   * @param {Function} callback - Function to be removed from the event.
   * @example
   * event.unregister(callback);
   * @memberof UttoriEvent
   */
  unregister(callback) {
    debug('unregister:', callback);
    if (typeof callback !== 'function') {
      const error = `Event callback must be a function, got: ${typeof callback}`;
      debug(error);
      throw new Error(error);
    }
    const index = this.callbacks.indexOf(callback);
    if (index > -1) {
      this.callbacks.splice(index, 1);
    } else {
      debug('callback not registered, skipping');
    }
  }

  /**
   * Executes all the callbacks present on an event with passed in data and context.
   * @param {*} data - Data to be used, updated, or modified by event callbacks.
   * @param {Object} [context] - Context to help with updating or modification of the data.
   * @returns {Promise} - A Promise resolving to the result of the check, either true (invalid) or false (valid).
   * @example
   * is_spam = await event.validate({ data }, this);
   * @async
   * @memberof UttoriEvent
   */
  async validate(data, context) {
    debug('validate:', data);
    const callbacks = this.callbacks.slice(0);
    debug('callbacks:', callbacks.length);
    const results = await Promise.all(callbacks.map(async (callback) => callback(data, context)));
    debug('callback results:', results);
    // Check for anything that isn't false, and invert the result.
    const valid = !results.every((element) => {
      if (typeof element !== 'boolean') {
        debug('validate callbacks should only return true (invalid) or false (valid), got:', element);
      }
      return element === false;
    });
    debug('validate =', valid);
    return valid;
  }

  /**
   * Executes all the callbacks present on an event with passed in data and context.
   * @param {*} data - Data to be used, updated, or modified by event callbacks.
   * @param {Object} [context] - Context to help with updating or modification of the data.
   * @returns {Promise} - A Promise resolving to the original input data, either modified or untouched.
   * @example
   * output = await event.filter({ data }, this);
   * @async
   * @memberof UttoriEvent
   */
  async filter(data, context) {
    debug('filter:', data);
    const callbacks = this.callbacks.slice(0);
    debug('callbacks:', callbacks.length);
    // Callbacks need to be run in the order recieved.
    // So we must async/await everything, even if it is not a promise.
    // We seed a Promise of our input data.
    // We then await it to resolve it and pass it to the first callback.
    // Each callback is awaited should the callback be async.
    // As async methods always return a Promise, we can safely loop.
    const result = callbacks.reduce(async (previousPromise, callback) => {
      let output = await previousPromise;
      output = await callback(output, context);
      return output;
    }, Promise.resolve(data));
    debug('filter =', result);
    return result;
  }

  /**
   * Executes all the callbacks present on an event with passed in data and context.
   * @param {*} data - Data to be used, updated, or modified by event callbacks.
   * @param {Object} [context] - Context to help with updating or modification of the data.
   * @example
   * event.fire({ data }, this);
   * @memberof UttoriEvent
   */
  fire(data, context) {
    debug('fire:', data);
    const callbacks = this.callbacks.slice(0);
    debug('callbacks:', callbacks.length);
    callbacks.forEach((callback) => {
      callback(data, context);
    });
  }
}

module.exports = UttoriEvent;
