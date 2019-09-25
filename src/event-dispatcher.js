const debug = require('debug')('Uttori.Utilities.EventDispatcher');
const UttoriEvent = require('./event');

/**
 * An event bus system for registering, unregistering and triggering events.
 * @property {Object} events - The collection of events to listen for.
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
   * @constructor
   */
  constructor() {
    this.events = {};
  }

  /**
   * Fires off an event with passed in data and context for a given label.
   * @param {*} data - Data to be used, updated, or modified by event callbacks.
   * @param {Object} [context] - Context to help with updating or modification of the data.
   * @returns {*} - The original input data, either modified or untouched.
   * @example
   * bus.dispatch('loaded', { data }, this);
   * @async
   * @memberof EventDispatcher
   */
  async dispatch(label, data, context) {
    debug('dispatch:', label, data);
    if (typeof label !== 'string' || label.length === 0) {
      const error = `Event label must be a string, got: ${typeof label}`;
      debug(error);
      throw new Error(error);
    }
    const event = this.events[label];
    if (event) {
      data = await event.fire(data, context);
    } else {
      debug('No event to fire:', label, data);
    }
    return data;
  }

  /**
   * Fires off an event with passed in data and context for a given label.
   * @param {*} data - Data to be used, updated, or modified by event callbacks.
   * @param {Object} [context] - Context to help with updating or modification of the data.
   * @returns {*} - The original input data, either modified or untouched.
   * @example
   * bus.dispatch('loaded', { data }, this);
   * @memberof EventDispatcher
   */
  dispatchSync(label, data, context) {
    debug('dispatchSync:', label, data);
    if (typeof label !== 'string' || label.length === 0) {
      const error = `Event label must be a string, got: ${typeof label}`;
      debug(error);
      throw new Error(error);
    }
    const event = this.events[label];
    if (event) {
      data = event.fire(data, context);
    } else {
      debug('No event to fire:', label, data);
    }
    return data;
  }

  /**
   * Add a function to an event that will be called when the label is dispatched.
   * If no label is found, one is created.
   * @param {String} label - The human readable identifier of the event.
   * @param {Function} callback - Function to be called when the event is fired.
   * @example
   * bus.on('loaded', callback);
   * @memberof EventDispatcher
   */
  on(label, callback) {
    debug('on:', label, callback);
    let event = this.events[label];
    if (!event) {
      event = new UttoriEvent(label);
      this.events[label] = event;
    }
    event.register(callback);
  }

  /**
   * Remove a function from an event.
   * @param {String} label - The human readable identifier of the event.
   * @param {Function} callback - Function to be removed.
   * @example
   * bus.off('loaded', callback);
   * @memberof EventDispatcher
   */
  off(label, callback) {
    debug('off:', label, callback);
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
