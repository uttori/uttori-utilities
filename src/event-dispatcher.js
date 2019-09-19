const debug = require('debug')('Uttori.Utilities.EventDispatcher');
const UttoriEvent = require('./event');

// https://atech.blog/atech/creating-a-simple-custom-event-system-in-javascript
class EventDispatcher {
  constructor() {
    this.events = {};
  }

  dispatch(label, data) {
    debug('dispatch:', label, data);
    if (typeof label !== 'string' || label.length === 0) {
      const error = `Event label must be a string, got: ${typeof label}`;
      debug(error);
      throw new Error(error);
    }
    const event = this.events[label];
    if (event) {
      event.fire(data);
    } else {
      debug('No event to fire:', label, data);
    }
  }

  on(label, callback) {
    debug('on:', label, callback);
    let event = this.events[label];
    if (!event) {
      event = new UttoriEvent(label);
      this.events[label] = event;
    }
    event.register(callback);
  }

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
