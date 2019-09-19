const debug = require('debug')('Uttori.Utilities.UttoriEvent');

class UttoriEvent {
  constructor(label) {
    if (typeof label !== 'string' || label.length === 0) {
      const error = `Event label must be a string, got: ${typeof label}`;
      debug(error);
      throw new Error(error);
    }
    this.label = label;
    this.callbacks = [];
  }

  fire(data) {
    debug('fire:', data);
    const callbacks = this.callbacks.slice(0);
    debug('fire:', data);
    callbacks.forEach((callback) => {
      callback(data);
    });
  }

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
}

module.exports = UttoriEvent;
