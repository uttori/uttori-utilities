/* eslint-disable no-bitwise */
const debug = require('debug')('Uttori.Utilities.DataBitstream');

class DataBitstream {
  constructor(stream) {
    this.stream = stream;
    this.bitPosition = 0;
  }

  copy() {
    const result = new DataBitstream(this.stream.copy());
    result.bitPosition = this.bitPosition;
    return result;
  }

  offset() {
    return (8 * this.stream.offset) + this.bitPosition;
  }

  available(bits) {
    return this.stream.available(((bits + 8) - this.bitPosition) / 8);
  }

  advance(bits) {
    const position = this.bitPosition + bits;
    this.stream.advance(position >> 3);
    this.bitPosition = position & 7;
  }

  rewind(bits) {
    const pos = this.bitPosition - bits;
    this.stream.rewind(Math.abs(pos >> 3));
    this.bitPosition = pos & 7;
  }

  seek(offset) {
    const current_offset = this.offset();
    if (offset > current_offset) {
      this.advance(offset - current_offset);
    } else if (offset < current_offset) {
      this.rewind(current_offset - offset);
    }
  }

  align() {
    if (this.bitPosition !== 0) {
      this.bitPosition = 0;
      this.stream.advance(1);
    }
  }

  read(bits, signed, advance = true) {
    if (bits === 0) {
      return 0;
    }

    let a;
    const mBits = bits + this.bitPosition;
    if (mBits <= 8) {
      a = ((this.stream.peekUInt8() << this.bitPosition) & 0xFF) >>> (8 - bits);
    } else if (mBits <= 16) {
      a = ((this.stream.peekUInt16() << this.bitPosition) & 0xFFFF) >>> (16 - bits);
    } else if (mBits <= 24) {
      a = ((this.stream.peekUInt24() << this.bitPosition) & 0xFFFFFF) >>> (24 - bits);
    } else if (mBits <= 32) {
      a = (this.stream.peekUInt32() << this.bitPosition) >>> (32 - bits);
    } else if (mBits <= 40) {
      const a0 = this.stream.peekUInt8(0) * 0x0100000000; // same as a << 32
      const a1 = (this.stream.peekUInt8(1) << 24) >>> 0;
      const a2 = this.stream.peekUInt8(2) << 16;
      const a3 = this.stream.peekUInt8(3) << 8;
      const a4 = this.stream.peekUInt8(4);

      a = a0 + a1 + a2 + a3 + a4;
      a %= 2 ** (40 - this.bitPosition); // (a << bitPosition) & 0xffffffffff
      a = Math.floor(a / 2 ** (40 - this.bitPosition - bits)); // a >>> (40 - bits)
    } else {
      throw new Error('Too many bits!');
    }

    // if the sign bit is turned on, flip the bits and add one to convert to a negative value
    if (signed) {
      /* istanbul ignore else */
      if (mBits < 32) {
        if (a >>> (bits - 1)) {
          a = (((1 << bits) >>> 0) - a) * -1;
        }
      } else if (a / 2 ** (bits - 1) | 0) {
        a = (2 ** bits - a) * -1;
      }
    }

    if (advance) {
      this.advance(bits);
    }
    return a;
  }

  peek(bits, signed) {
    return this.read(bits, signed, false);
  }

  readLSB(bits, signed, advance = true) {
    if (bits === 0) {
      return 0;
    }
    if (bits > 40) {
      throw new Error('Too many bits!');
    }

    const mBits = bits + this.bitPosition;
    let a = (this.stream.peekUInt8(0)) >>> this.bitPosition;
    if (mBits > 8) {
      a |= (this.stream.peekUInt8(1)) << (8 - this.bitPosition);
    }
    if (mBits > 16) {
      a |= (this.stream.peekUInt8(2)) << (16 - this.bitPosition);
    }
    if (mBits > 24) {
      a += ((this.stream.peekUInt8(3)) << (24 - this.bitPosition)) >>> 0;
    }
    if (mBits > 32) {
      a += (this.stream.peekUInt8(4)) * 2 ** (32 - this.bitPosition);
    }

    if (mBits >= 32) {
      a %= 2 ** bits;
    } else {
      a &= (1 << bits) - 1;
    }

    if (signed) {
      // if the sign bit is turned on, flip the bits and add one to convert to a negative value
      /* istanbul ignore else */
      if (mBits < 32) {
        if (a >>> (bits - 1)) {
          a = (((1 << bits) >>> 0) - a) * -1;
        }
      } else if (a / 2 ** (bits - 1) | 0) {
        a = (2 ** bits - a) * -1;
      }
    }

    if (advance) {
      this.advance(bits);
    }
    return a;
  }

  peekLSB(bits, signed) {
    return this.readLSB(bits, signed, false);
  }
}

module.exports = DataBitstream;
