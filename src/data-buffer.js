/* eslint-disable class-methods-use-this */
/* eslint-disable no-bitwise */
const debug = require('debug')('Uttori.Utilities.DataBuffer');

class DataBuffer {
  constructor(input) {
    if (!input) {
      const error = 'Missing input data.';
      debug(error);
      throw new TypeError(error);
    }
    if (Buffer.isBuffer(input) || typeof input === 'string') {
      debug('constructor: from Buffer');
      this.data = Buffer.from(input);
    } else if (input instanceof Uint8Array) {
      debug('constructor: from Uint8Array');
      this.data = input;
    } else if (input instanceof ArrayBuffer || Array.isArray(input) || (typeof input === 'number')) {
      debug('constructor: from ArrayBuffer || Normal JS Array || Number (i.e. length) || Node Buffer');
      this.data = new Uint8Array(input);
    } else if (input.buffer instanceof ArrayBuffer) {
      debug('constructor: from typed arrays other than Uint8Array');
      this.data = new Uint8Array(input.buffer, input.byteOffset, input.length * input.BYTES_PER_ELEMENT);
    } else if (input instanceof DataBuffer) {
      debug('constructor: from DataBuffer, a shallow copy');
      this.data = input.data;
    } else {
      const error = `Unknown type of input for DataBuffer: ${typeof input}`;
      debug(error);
      throw new TypeError(error);
    }

    this.length = this.data.length;

    // used when the buffer is part of a bufferlist
    this.next = null;
    this.prev = null;
  }

  static allocate(size) {
    debug('DataBuffer.allocate:', size);
    return new DataBuffer(size);
  }

  compare(input, offset = 0) {
    // debug('compare:', input.length, offset);
    const buffer = new DataBuffer(input);
    const { length } = buffer;
    /* istanbul ignore next */
    if (!length) {
      debug('compare: no input provided');
      return false;
    }
    const local = this.slice(offset, length);
    for (let i = 0; i < length; i++) {
      if (local.data[i] !== buffer.data[i]) {
        debug('compare: first failed match at', i);
        return false;
      }
    }
    debug('compare: data is the same');
    return true;
  }

  copy() {
    debug('copy');
    return new DataBuffer(new Uint8Array(this.data));
  }

  slice(position, length = this.length) {
    debug('slice:', position, length);
    if ((position === 0) && (length >= this.length)) {
      return new DataBuffer(this.data);
    }
    return new DataBuffer(this.data.subarray(position, position + length));
  }
}

module.exports = DataBuffer;
