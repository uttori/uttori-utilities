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
   * @returns {*} - The original input data, either modified or untouched.
   */
  fire(data, context) {
    debug('fire:', data);
    const callbacks = this.callbacks.slice(0);
    debug('callbacks:', callbacks.length);
    callbacks.forEach((callback) => {
      data = callback(data, context);
    });
    return data;
  }
}

module.exports = UttoriEvent;
