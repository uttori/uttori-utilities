/* eslint-disable no-bitwise */
const debug = require('debug')('Uttori.Utilities.DataStream');
const DataBuffer = require('./data-buffer');
const DataBufferList = require('./data-buffer-list');

class UnderflowError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnderflowError';
    this.stack = (new Error(message)).stack;
    /* istanbul ignore else */
    // https://nodejs.org/api/errors.html#errors_error_capturestacktrace_targetobject_constructoropt
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

class DataStream {
  constructor(list, options = { size: 16 }) {
    if (options && options.size % 8 !== 0) {
      options.size += (8 - (options.size % 8));
    }
    this.size = options.size;
    this.buf = new ArrayBuffer(this.size);
    this.uint8 = new Uint8Array(this.buf);
    this.int8 = new Int8Array(this.buf);
    this.uint16 = new Uint16Array(this.buf);
    this.int16 = new Int16Array(this.buf);
    this.uint32 = new Uint32Array(this.buf);
    this.int32 = new Int32Array(this.buf);
    this.float32 = new Float32Array(this.buf);
    this.float64 = new Float64Array(this.buf);

    // detect the native endianness of the machine
    // 0x3412 is little endian, 0x1234 is big endian
    this.nativeEndian = new Uint16Array(new Uint8Array([0x12, 0x34]).buffer)[0] === 0x3412;

    this.list = list;
    this.localOffset = 0;
    this.offset = 0;
  }

  static fromData(data) {
    const buffer = new DataBuffer(data);
    const list = new DataBufferList();
    list.append(buffer);
    return new DataStream(list, { size: data.length });
  }

  static fromBuffer(buffer) {
    const list = new DataBufferList();
    list.append(buffer);
    return new DataStream(list, { size: buffer.length });
  }

  compare(input, offset = 0) {
    if (!input || !input.list || !input.list.availableBytes) {
      debug('compare: no input provided');
      return false;
    }
    let { availableBytes } = input.list;
    debug('compare', availableBytes, offset);
    if (offset) {
      availableBytes -= offset;
      this.seek(offset);
      input.seek(offset);
    }
    let local;
    let external;
    for (let i = 0; i < availableBytes; i++) {
      local = this.readUInt8();
      external = input.readUInt8();
      if (local !== external) {
        debug('compare: first failed match at', i);
        return false;
      }
      debug('compare: match at', i);
    }
    return true;
  }

  copy() {
    const result = new DataStream(this.list.copy(), { size: this.size });
    result.localOffset = this.localOffset;
    result.offset = this.offset;
    return result;
  }

  available(bytes) {
    return bytes <= this.remainingBytes();
  }

  remainingBytes() {
    return this.list.availableBytes - this.localOffset;
  }

  advance(bytes) {
    if (!this.available(bytes)) {
      throw new UnderflowError(`Insufficient Bytes: ${bytes} <= ${this.remainingBytes()}`);
    }

    this.localOffset += bytes;
    this.offset += bytes;

    while (this.list.first && (this.localOffset >= this.list.first.length)) {
      this.localOffset -= this.list.first.length;
      this.list.advance();
    }

    return this;
  }

  rewind(bytes) {
    if (bytes > this.offset) {
      throw new UnderflowError(`Insufficient Bytes: ${bytes} > ${this.offset}`);
    }

    // if we're at the end of the bufferlist, seek from the end
    if (!this.list.first) {
      this.list.rewind();
      this.localOffset = this.list.first.length;
    }

    this.localOffset -= bytes;
    this.offset -= bytes;

    while (this.list.first.prev && (this.localOffset < 0)) {
      this.list.rewind();
      this.localOffset += this.list.first.length;
    }

    return this;
  }

  seek(position) {
    let output = this;
    if (position > this.offset) {
      output = this.advance(position - this.offset);
    } else if (position < this.offset) {
      output = this.rewind(this.offset - position);
    }
    return output;
  }

  readUInt8() {
    if (!this.available(1)) {
      throw new UnderflowError('Insufficient Bytes: 1');
    }

    const output = this.list.first.data[this.localOffset];
    this.localOffset += 1;
    this.offset += 1;

    if (this.localOffset === this.list.first.length) {
      this.localOffset = 0;
      this.list.advance();
    }

    return output;
  }

  peekUInt8(offset = 0) {
    if (!this.available(offset + 1)) {
      throw new UnderflowError(`Insufficient Bytes: ${offset} + 1`);
    }

    offset = this.localOffset + offset;
    let buffer = this.list.first;

    while (buffer) {
      if (buffer.length > offset) {
        return buffer.data[offset];
      }

      offset -= buffer.length;
      buffer = buffer.next;
    }

    return 0;
  }

  read(bytes, littleEndian = false) {
    // debug('read:', bytes, littleEndian);
    if (littleEndian === this.nativeEndian) {
      for (let i = 0; i < bytes; i++) {
        this.uint8[i] = this.readUInt8();
      }
    } else {
      for (let i = bytes - 1; i >= 0; i--) {
        this.uint8[i] = this.readUInt8();
      }
    }
    const output = this.uint8.slice(0, bytes);
    // debug('read =', output.toString('hex'));
    return output;
  }

  peek(bytes, offset = 0, littleEndian = false) {
    // debug('peek:', bytes, offset, littleEndian);
    if (littleEndian === this.nativeEndian) {
      for (let i = 0; i < bytes; i++) {
        this.uint8[i] = this.peekUInt8(offset + i);
      }
    } else {
      for (let i = 0; i < bytes; i++) {
        this.uint8[bytes - i - 1] = this.peekUInt8(offset + i);
      }
    }
    const output = this.uint8.slice(0, bytes);
    // debug('peek =', output.toString('hex'));
    return output;
  }

  readInt8() {
    this.read(1);
    return this.int8[0];
  }

  peekInt8(offset = 0) {
    this.peek(1, offset);
    return this.int8[0];
  }

  readUInt16(littleEndian) {
    this.read(2, littleEndian);
    return this.uint16[0];
  }

  peekUInt16(offset = 0, littleEndian) {
    this.peek(2, offset, littleEndian);
    return this.uint16[0];
  }

  readInt16(littleEndian) {
    this.read(2, littleEndian);
    return this.int16[0];
  }

  peekInt16(offset = 0, littleEndian) {
    this.peek(2, offset, littleEndian);
    return this.int16[0];
  }

  readUInt24(littleEndian) {
    if (littleEndian) {
      return this.readUInt16(true) + (this.readUInt8() << 16);
    }
    return (this.readUInt16() << 8) + this.readUInt8();
  }

  peekUInt24(offset = 0, littleEndian) {
    if (littleEndian) {
      return this.peekUInt16(offset, true) + (this.peekUInt8(offset + 2) << 16);
    }
    return (this.peekUInt16(offset) << 8) + this.peekUInt8(offset + 2);
  }

  readInt24(littleEndian) {
    if (littleEndian) {
      return this.readUInt16(true) + (this.readInt8() << 16);
    }
    return (this.readInt16() << 8) + this.readUInt8();
  }

  peekInt24(offset = 0, littleEndian) {
    if (littleEndian) {
      return this.peekUInt16(offset, true) + (this.peekInt8(offset + 2) << 16);
    }
    return (this.peekInt16(offset) << 8) + this.peekUInt8(offset + 2);
  }

  readUInt32(littleEndian) {
    this.read(4, littleEndian);
    return this.uint32[0];
  }

  peekUInt32(offset = 0, littleEndian) {
    this.peek(4, offset, littleEndian);
    return this.uint32[0];
  }

  readInt32(littleEndian) {
    this.read(4, littleEndian);
    return this.int32[0];
  }

  peekInt32(offset = 0, littleEndian) {
    this.peek(4, offset, littleEndian);
    return this.int32[0];
  }

  readFloat32(littleEndian) {
    this.read(4, littleEndian);
    return this.float32[0];
  }

  peekFloat32(offset = 0, littleEndian) {
    this.peek(4, offset, littleEndian);
    return this.float32[0];
  }

  readFloat64(littleEndian) {
    this.read(8, littleEndian);
    return this.float64[0];
  }

  peekFloat64(offset = 0, littleEndian) {
    this.peek(8, offset, littleEndian);
    return this.float64[0];
  }

  // IEEE 80 bit extended float
  readFloat80(littleEndian) {
    this.read(10, littleEndian);
    return this.float80();
  }

  peekFloat80(offset = 0, littleEndian) {
    this.peek(10, offset, littleEndian);
    return this.float80();
  }

  readBuffer(length) {
    const result = DataBuffer.allocate(length);
    const to = result.data;

    for (let i = 0; i < length; i++) {
      to[i] = this.readUInt8();
    }

    return result;
  }

  peekBuffer(offset = 0, length) {
    const result = DataBuffer.allocate(length);
    const to = result.data;

    for (let i = 0; i < length; i++) {
      to[i] = this.peekUInt8(offset + i);
    }

    return result;
  }

  readSingleBuffer(length) {
    const result = this.list.first.slice(this.localOffset, length);
    this.advance(result.length);
    return result;
  }

  peekSingleBuffer(offset, length) {
    const result = this.list.first.slice(this.localOffset + offset, length);
    return result;
  }

  readString(length, encoding = 'ascii') {
    return this.decodeString(0, length, encoding, true);
  }

  peekString(offset = 0, length, encoding = 'ascii') {
    return this.decodeString(offset, length, encoding, false);
  }

  float80() {
    const [high, low] = [...this.uint32];
    const a0 = this.uint8[9];
    const a1 = this.uint8[8];

    const sign = 1 - ((a0 >>> 7) * 2); // -1 or +1
    let exp = ((a0 & 0x7F) << 8) | a1;

    if ((exp === 0) && (low === 0) && (high === 0)) {
      return 0;
    }

    if (exp === 0x7FFF) {
      if ((low === 0) && (high === 0)) {
        return sign * Infinity;
      }

      return NaN;
    }

    exp -= 16383;
    let out = low * 2 ** (exp - 31);
    out += high * 2 ** (exp - 63);

    return sign * out;
  }

  decodeString(offset, length, encoding, advance) {
    encoding = encoding.toLowerCase();
    const nullEnd = length === null ? 0 : -1;

    if (length == null) {
      length = Infinity;
    }

    const end = offset + length;
    let result = '';

    switch (encoding) {
      case 'ascii':
      case 'latin1': {
        while (offset < end) {
          const char = this.peekUInt8(offset++);
          if (char === nullEnd) {
            break;
          }
          result += String.fromCharCode(char);
        }
        break;
      }
      case 'utf8':
      case 'utf-8': {
        while (offset < end) {
          const b1 = this.peekUInt8(offset++);
          if (b1 === nullEnd) {
            break;
          }
          let b2;
          let b3;
          /* istanbul ignore else */
          if ((b1 & 0x80) === 0) {
            result += String.fromCharCode(b1);
          } else if ((b1 & 0xE0) === 0xC0) {
            // one continuation (128 to 2047)
            b2 = this.peekUInt8(offset++) & 0x3F;
            result += String.fromCharCode(((b1 & 0x1F) << 6) | b2);
          } else if ((b1 & 0xF0) === 0xE0) {
            // two continuation (2048 to 55295 and 57344 to 65535)
            b2 = this.peekUInt8(offset++) & 0x3F;
            b3 = this.peekUInt8(offset++) & 0x3F;
            result += String.fromCharCode(((b1 & 0x0F) << 12) | (b2 << 6) | b3);
          } else if ((b1 & 0xF8) === 0xF0) {
            // three continuation (65536 to 1114111)
            b2 = this.peekUInt8(offset++) & 0x3F;
            b3 = this.peekUInt8(offset++) & 0x3F;
            const b4 = this.peekUInt8(offset++) & 0x3F;

            // split into a surrogate pair
            const pt = (((b1 & 0x0F) << 18) | (b2 << 12) | (b3 << 6) | b4) - 0x10000;
            result += String.fromCharCode(0xD800 + (pt >> 10), 0xDC00 + (pt & 0x3FF));
          }
        }
        break;
      }
      case 'utf16-be':
      case 'utf16be':
      case 'utf16le':
      case 'utf16-le':
      case 'utf16bom':
      case 'utf16-bom': {
        let littleEndian;

        // find endianness
        switch (encoding) {
          case 'utf16be':
          case 'utf16-be': {
            littleEndian = false;
            break;
          }
          case 'utf16le':
          case 'utf16-le': {
            littleEndian = true;
            break;
          }
          case 'utf16bom':
          case 'utf16-bom':
          default: {
            const bom = this.peekUInt16(offset);
            if ((length < 2) || (bom === nullEnd)) {
              if (advance) {
                this.advance(offset += 2);
              }
              return result;
            }

            littleEndian = bom === 0xFFFE;
            offset += 2;
            break;
          }
        }

        let w1;
        // eslint-disable-next-line no-cond-assign
        while ((offset < end) && ((w1 = this.peekUInt16(offset, littleEndian)) !== nullEnd)) {
          offset += 2;

          if ((w1 < 0xD800) || (w1 > 0xDFFF)) {
            result += String.fromCharCode(w1);
          } else {
            const w2 = this.peekUInt16(offset, littleEndian);
            if ((w2 < 0xDC00) || (w2 > 0xDFFF)) {
              throw new Error('Invalid utf16 sequence.');
            }

            result += String.fromCharCode(w1, w2);
            offset += 2;
          }
        }

        if (w1 === nullEnd) {
          offset += 2;
        }
        break;
      }
      default: {
        throw new Error(`Unknown encoding: ${encoding}`);
      }
    }

    if (advance) {
      this.advance(offset);
    }
    return result;
  }
}

module.exports = DataStream;
