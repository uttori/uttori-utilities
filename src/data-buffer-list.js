/* eslint-disable no-bitwise */
const debug = require('debug')('Uttori.Utilities.DataBufferList');

class DataBufferList {
  constructor() {
    debug('constructor');
    this.first = null;
    this.last = null;
    this.numBuffers = 0;
    this.availableBytes = 0;
    this.availableBuffers = 0;
  }

  copy() {
    debug('copy');
    const result = new DataBufferList();

    result.first = this.first;
    result.last = this.last;
    result.numBuffers = this.numBuffers;
    result.availableBytes = this.availableBytes;
    result.availableBuffers = this.availableBuffers;

    return result;
  }

  append(buffer) {
    debug('append');
    buffer.prev = this.last;
    if (this.last) {
      this.last.next = buffer;
    }
    this.last = buffer;
    if (this.first == null) {
      this.first = buffer;
    }

    this.availableBytes += buffer.length;
    this.availableBuffers++;
    return this.numBuffers++;
  }

  advance() {
    debug('advance');
    if (this.first) {
      this.availableBytes -= this.first.length;
      this.availableBuffers--;
      this.first = this.first.next;
      return (this.first != null);
    }

    return false;
  }

  rewind() {
    debug('rewind');
    if (this.first && !this.first.prev) {
      return false;
    }

    this.first = this.first ? this.first.prev : this.last;
    /* istanbul ignore else */
    if (this.first) {
      this.availableBytes += this.first.length;
      this.availableBuffers++;
    }

    return (this.first != null);
  }

  reset() {
    debug('reset');
    return (() => {
      const result = [];
      while (this.rewind()) {
        // eslint-disable-next-line no-continue
        continue;
      }
      return result;
    })();
  }
}

module.exports = DataBufferList;
