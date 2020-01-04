/* eslint-disable class-methods-use-this */
/* eslint-disable no-bitwise */
/* eslint-disable spaced-comment */
const debug = require('debug')('Uttori.Utilities.ImagePNG');
const zlib = require('zlib');

const DataBuffer = require('./data-buffer');
const DataBufferList = require('./data-buffer-list');
const DataStream = require('./data-stream');

// https://github.com/jsummers/tweakpng BEST EXAMPLE
// http://www.simplesystems.org/libpng/FFFF/ EXAMPLES OMG
// https://www.w3.org/TR/PNG-Chunks.html
// https://github.com/arian/pngjs/blob/master/PNGReader.js
// https://ucnv.github.io/pnglitch/
// http://www.schaik.com/pngsuite/#basic
// http://www.libpng.org/pub/png/spec/1.2/PNG-Chunks.html
class ImagePNG extends DataStream {
  constructor(list, options = { size: 16 }) {
    super(list, options);

    // PNG Specific Details
    this.width = 0;
    this.height = 0;
    this.bitDepth = 0;
    this.colorType = 0;
    this.compressionMethod = 0;
    this.filterMethod = 0;
    this.interlaceMethod = 0;

    this.colors = 0;
    this.alpha = false;
    this.pixelBits = 0;

    this.palette = [];
    this.pixels = null;
    this.transparency = null;

    this.physical = null;

    this.dataChunks = [];

    this.parse();
  }

  static fromFile(data) {
    debug('fromFile:', data.length);
    const buffer = new DataBuffer(data);
    const list = new DataBufferList();
    list.append(buffer);
    return new ImagePNG(list, { size: data.length });
  }

  static fromBuffer(buffer) {
    debug('fromBuffer:', buffer.length);
    const list = new DataBufferList();
    list.append(buffer);
    return new ImagePNG(list, { size: buffer.length });
  }

  setBitDepth(bitDepth) {
    debug('setBitDepth:', bitDepth);
    if (![1, 2, 4, 8, 16].includes(bitDepth)) {
      throw new Error(`Invalid Bit Depth: ${bitDepth}, can be one of: 1, 2, 4, 8, 16`);
    }
    this.bitDepth = bitDepth;
  }

  //   Color    Allowed    Interpretation
  //   Type    Bit Depths
  //   0       1,2,4,8,16  Each pixel is a grayscale sample.
  //   2       8,16        Each pixel is an R,G,B triple.
  //   3       1,2,4,8     Each pixel is a palette index; a PLTE chunk must appear.
  //   4       8,16        Each pixel is a grayscale sample, followed by an alpha sample.
  //   6       8,16        Each pixel is an R,G,B triple, followed by an alpha sample.
  setColorType(colorType) {
    debug('setColorType:', colorType);
    let colors = 0;
    let alpha = false;

    switch (colorType) {
      case 0: colors = 1; break;
      case 2: colors = 3; break;
      case 3: colors = 1; break;
      case 4: colors = 2; alpha = true; break;
      case 6: colors = 4; alpha = true; break;
      default: throw new Error(`Invalid Color Type: ${colorType}, can be one of: 0, 2, 3, 4, 6`);
    }

    this.colors = colors;
    this.alpha = alpha;
    this.colorType = colorType;
  }

  setCompressionMethod(compressionMethod) {
    debug('setCompressionMethod:', compressionMethod);
    if (compressionMethod !== 0) {
      throw new Error(`Unsupported Compression Method: ${compressionMethod}`);
    }
    this.compressionMethod = compressionMethod;
  }

  setFilterMethod(filterMethod) {
    debug('setFilterMethod:', filterMethod);
    if (filterMethod !== 0) {
      throw new Error(`Unsupported Filter Method: ${filterMethod}`);
    }
    this.filterMethod = filterMethod;
  }

  setInterlaceMethod(interlaceMethod) {
    debug('setInterlaceMethod:', interlaceMethod);
    if (interlaceMethod !== 0 && interlaceMethod !== 1) {
      throw new Error(`Unsupported Interlace Method: ${interlaceMethod}`);
    }
    this.interlaceMethod = interlaceMethod;
  }

  setPalette(palette) {
    debug('setPalette:', palette);
    if (!Array.isArray(palette) && !ArrayBuffer.isView(palette)) {
      debug('No palette provided.');
      return;
    }
    if (palette.length === 0) {
      throw new Error('Palette contains no colors');
    }
    if (palette.length > (2 ** (this.bitDepth) * 3)) {
      throw new Error(`Palette contains more colors than ${2 ** (this.bitDepth) * 3} ((2 ^ ${this.bitDepth}) * 3)`);
    }
    this.palette = palette;
  }

  /**
   * get the pixel color on a certain location in a normalized way
   * result is an array: [red, green, blue, alpha]
   */
  getPixel(x, y) {
    if (!this.pixels) {
      throw new Error('Pixel data has not been decoded.');
    }
    if (!Number.isInteger(x) || x >= this.width || x < 0) {
      throw new Error(`x position out of bounds or invalid: ${x}`);
    }
    if (!Number.isInteger(y) || y >= this.height || y < 0) {
      throw new Error(`y position out of bounds or invalid: ${y}`);
    }
    debug('getPixel x:', x, 'y:', y, 'colorType:', this.colorType, 'colors:', this.colors, 'bitDepth:', this.bitDepth);
    // const i = (y * this.width + x) * this.bitDepth;
    // const i = (this.colors * this.bitDepth) / (8 * (y * this.width + x));
    const i = ((this.colors * this.bitDepth) / 8) * (y * this.width + x);

    debug('index:', i);
    switch (this.colorType) {
      case 0: {
        return [this.pixels[i], this.pixels[i], this.pixels[i], 255];
      }
      case 2: {
        return [this.pixels[i], this.pixels[i + 1], this.pixels[i + 2], 255];
      }
      case 3: {
        let alpha = 255;
        if (this.transparency != null && this.transparency[this.pixels[i]] != null) {
          alpha = this.transparency[this.pixels[i]];
        }
        return [
          this.palette[this.pixels[i] * 3 + 0],
          this.palette[this.pixels[i] * 3 + 1],
          this.palette[this.pixels[i] * 3 + 2],
          alpha,
        ];
      }
      case 4: {
        // For 16 bitDepth grey image we need to pick up lower 8 bit for each pixel.
        if (this.bitDepth === 8) {
          return [this.pixels[i], this.pixels[i], this.pixels[i], this.pixels[i + 1]];
        }
        return [this.pixels[i + 1], this.pixels[i + 1], this.pixels[i + 1], this.pixels[i + 3]];
      }
      case 6: {
        // For 16 bitDepth grey image we need to pick up lower 8 bit for each pixel.
        if (this.bitDepth === 8) {
          return [this.pixels[i], this.pixels[i + 1], this.pixels[i + 2], this.pixels[i + 3]];
        }
        return [this.pixels[i + 1], this.pixels[i + 3], this.pixels[i + 5], this.pixels[i + 7]];
      }
      default: {
        throw new Error(`Unknown Color Type: ${this.colorType}`);
      }
    }
  }

  /**
 * Parse the PNG file
 */
  parse() {
    debug('parse');
    this.decodeHeader();

    while (this.remainingBytes()) {
      const type = this.decodeChunk();
      // stop after IEND
      if (type === 'IEND') {
        const leftover = this.remainingBytes();
        // TODO: Find a PNG file with other data types in it?
        /* istanbul ignore next */
        if (leftover) {
          debug('ending with data left:', this.buf.length - this.i, 'bytes left');
        }
        break;
      }
    }
  }

  /**
 * http://www.w3.org/TR/2003/REC-PNG-20031110/#5PNG-file-signature
 * [137, 80, 78, 71, 13, 10, 26, 10]
 */
  decodeHeader() {
    debug('decodeHeader: offset =', this.offset);
    /* istanbul ignore next */
    if (this.offset !== 0) {
      debug('Offset should be at 0 to read the header.');
    }

    const header = this.read(8, this.nativeEndian);
    const header_buffer = new DataBuffer(header);
    if (!header_buffer.compare([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])) {
      throw new Error('Missing or invalid PNG header.');
    }

    this.header = header;
  }

  /**
 * http://www.w3.org/TR/2003/REC-PNG-20031110/#5Chunk-layout
 *
 * length =  4      bytes
 * type   =  4      bytes (IHDR, PLTE, IDAT, IEND or others)
 * chunk  =  length bytes
 * crc    =  4      bytes
 */
  decodeChunk() {
    debug('decodeChunk');
    const length = this.readUInt32();

    /* istanbul ignore next */
    if (length < 0) {
      throw new Error(`Invalid Chunk Length: ${0xFFFFFFFF & length}`);
    }

    const type = this.readString(4);
    const chunk = this.read(length, this.nativeEndian);
    const crc = this.readUInt32();

    debug('decodeChunk type', type, 'chunk size', length, 'crc', crc.toString(16).toUpperCase());
    switch (type) {
      case 'IHDR': this.decodeIHDR(chunk); break;
      case 'PLTE': this.decodePLTE(chunk); break;
      case 'IDAT': this.decodeIDAT(chunk); break;
      case 'IEND': this.decodeIEND(chunk); break;
      case 'tRNS': this.decodeTRNS(chunk); break;
      case 'pHYs': this.decodePHYS(chunk); break;
      // case 'cHRM': this.decodeCHRM(chunk); break;
      // case 'gAMA': this.decodeGAMA(chunk); break;
      // case 'bKGD': this.decodeBKGD(chunk); break;
      // case 'tIME': this.decodeTIME(chunk); break;
      // case 'tEXt': this.decodeTEXT(chunk); break;
      // case 'iTXt': this.decodeITXT(chunk); break;
      // case 'sRGB': this.decodeSRGB(chunk); break;
      // case 'sBIT': this.decodeSBIT(chunk); break;
      default:
        debug(`Unsupported Chunk: '${type}'`);
        break;
    }

    return type;
  }

  /**
   * http://www.w3.org/TR/2003/REC-PNG-20031110/#11IHDR
   * http://www.libpng.org/pub/png/spec/1.2/png-1.2-pdg.html#C.IHDR
   *
   * Width               4 bytes
   * Height              4 bytes
   * Bit depth           1 byte
   * Colour type         1 byte
   * Compression method  1 byte
   * Filter method       1 byte
   * Interlace method    1 byte
   */
  decodeIHDR(chunk) {
    debug('decodeIHDR');
    const header = DataStream.fromData(chunk);

    const width = header.readUInt32();
    const height = header.readUInt32();
    const bit_depth = header.readUInt8();
    const color_type = header.readUInt8();
    const compression_method = header.readUInt8();
    const filter_method = header.readUInt8();
    const interlace_method = header.readUInt8();

    this.width = width;
    this.height = height;
    this.setBitDepth(bit_depth);
    this.setColorType(color_type);
    this.setCompressionMethod(compression_method);
    this.setFilterMethod(filter_method);
    this.setInterlaceMethod(interlace_method);

    debug('decodeIHDR =', JSON.stringify({ width, height, bit_depth, color_type, compression_method, filter_method, interlace_method }));
  }

  /**
   *
   * http://www.w3.org/TR/PNG/#11PLTE
   */
  decodePLTE(chunk) {
    debug('decodePLTE');
    this.setPalette(chunk);
  }

  /**
   * http://www.w3.org/TR/2003/REC-PNG-20031110/#11IDAT
   * multiple IDAT chunks will concatenated
   */
  decodeIDAT(chunk) {
    debug('decodeIDAT:', chunk.length, 'bytes');
    this.dataChunks.push(chunk);
  }

  /**
   * The tRNS chunk specifies that the image uses simple transparency: either alpha values associated with palette entries (for indexed-color images) or a single transparent color (for grayscale and truecolor images). Although simple transparency is not as elegant as the full alpha channel, it requires less storage space and is sufficient for many common cases.
   * https://www.w3.org/TR/PNG/#11tRNS
   */
  decodeTRNS(chunk) {
    debug('decodeTRNS');
    this.transparency = chunk;
  }

  // Pixels per unit, X axis: 4 bytes (unsigned integer)
  // Pixels per unit, Y axis: 4 bytes (unsigned integer)
  // Unit specifier:          1 byte
  // 0: unit is unknown
  // 1: unit is the meter
  /**
   * The pHYs chunk specifies the intended pixel size or aspect ratio for display of the image.
   * https://www.w3.org/TR/PNG/#11tRNS
   * https://www.w3.org/TR/PNG-Decoders.html#D.Pixel-dimensions
   *
   */
  decodePHYS(chunk) {
    const INCH_TO_METERS = 0.0254;
    const buffer = DataStream.fromData(chunk);
    let width = buffer.readUInt32();
    let height = buffer.readUInt32();
    const unit = buffer.readUInt8();

    switch (unit) {
      case 1: {
        width = parseInt(width * INCH_TO_METERS, 10);
        height = parseInt(height * INCH_TO_METERS, 10);
        break;
      }
      /* istanbul ignore next */
      default: {
        break;
      }
    }

    this.physical = { width, height, unit };
  }

  /**
   * http://www.w3.org/TR/2003/REC-PNG-20031110/#11IEND
   */
  // eslint-disable-next-line class-methods-use-this
  decodeIEND() {
    debug('decodeIEND');
  }

  /**
   * Uncompress IDAT chunks
   */
  decodePixels() {
    debug('decodePixels');
    if (this.dataChunks.length === 0) {
      throw new Error('No IDAT chunks to decode.');
    }
    const length = this.dataChunks.reduce((accumulator, chunk) => accumulator + chunk.length, 0);
    debug('Data Chunks Total Size:', length);
    const data = Buffer.from(new Uint8Array(length));
    for (let i = 0, k = 0, l = this.dataChunks.length; i < l; i++) {
      const chunk = this.dataChunks[i];
      for (let j = 0; j < chunk.length; j++) {
        data[k++] = chunk[j];
      }
    }

    let out;
    try {
      out = zlib.inflateSync(data);
    } catch (err) {
      /* istanbul ignore next */
      debug('Error Unzipping:', err);
      /* istanbul ignore next */
      throw err;
    }
    debug('Inflated Size:', out.length);
    // debug('Inflated:', out);

    try {
      /* istanbul ignore else */
      if (this.interlaceMethod === 0) {
        this.interlaceNone(out);
      } else {
        // https://github.com/em2046/aperture/blob/master/lib/png/processor/interlace.js#L99
        // https://github.com/em2046/aperture/tree/master/lib/png/chunks
        // https://github.com/beejjorgensen/jsmandel/blob/master/src/js/adam7.js
        // http://diyhpl.us/~yenatch/pokecrystal/src/pypng/code/png.py
        // https://github.com/SixLabors/ImageSharp/blob/master/src/ImageSharp/Formats/Png/Adam7.cs
        throw new Error('Adam7 interlaced format is unsupported.');
      }
    } catch (e) {
      /* istanbul ignore next */
      debug('Error Deinterlacing:', e);
      /* istanbul ignore next */
      throw e;
    }
  }

  // Different interlace methods
  // https://www.w3.org/TR/PNG-Filters.html
  interlaceNone(data) {
    const bytes_per_pixel = Math.max(1, (this.colors * this.bitDepth) / 8);
    const color_bytes_per_row = bytes_per_pixel * this.width;

    this.pixels = new Uint8Array(bytes_per_pixel * this.width * this.height);

    const chunk = DataStream.fromData(data);
    debug('interlaceNone: bytes:', chunk.remainingBytes(), 'bytes_per_pixel:', bytes_per_pixel, 'color_bytes_per_row:', color_bytes_per_row);
    let offset = 0;
    while (chunk.remainingBytes() > 0) {
      const type = chunk.readUInt8();
      let scanline;
      if (chunk.remainingBytes() < color_bytes_per_row) {
        scanline = chunk.read(chunk.remainingBytes(), this.nativeEndian);
      } else {
        scanline = chunk.read(color_bytes_per_row, this.nativeEndian);
      }
      // debug('chunk filter type:', type);
      switch (type) {
        case 0: {
          this.unFilterNone(scanline, bytes_per_pixel, offset, color_bytes_per_row);
          break;
        }
        case 1: {
          this.unFilterSub(scanline, bytes_per_pixel, offset, color_bytes_per_row);
          break;
        }
        case 2: {
          this.unFilterUp(scanline, bytes_per_pixel, offset, color_bytes_per_row);
          break;
        }
        case 3: {
          this.unFilterAverage(scanline, bytes_per_pixel, offset, color_bytes_per_row);
          break;
        }
        case 4: {
          this.unFilterPaeth(scanline, bytes_per_pixel, offset, color_bytes_per_row);
          break;
        }
        default: {
          debug(`Unknown filtered scanline type: '${type}', at offset`, offset);
        }
      }
      offset += chunk.offset;
      // debug('chunk.remainingBytes()', chunk.remainingBytes());
    }
  }

  // Unfiltering

  /**
   * No filtering, direct copy
   */
  unFilterNone(scanline, bpp, offset, length) {
    debug('unFilterNone:', 'bpp:', bpp, 'offset:', offset, 'length:', length);
    for (let i = 0, to = length; i < to; i++) {
      // debug(`this.pixels[${offset + i}] = ${scanline[i]}`);
      this.pixels[offset + i] = scanline[i];
    }
  }

  /**
   * The Sub() filter transmits the difference between each byte and the value of the corresponding byte of the prior pixel.
   * Sub(x) = Raw(x) + Raw(x - bpp)
   */
  unFilterSub(scanline, bpp, offset, length) {
    debug('unFilterSub:', 'bpp:', bpp, 'offset:', offset, 'length:', length);
    let i = 0;
    for (; i < bpp; i++) {
      // debug(`this.pixels[${offset + i}] = ${scanline[i]}`);
      this.pixels[offset + i] = scanline[i];
    }
    for (; i < length; i++) {
      // Raw(x) + Raw(x - bpp)
      // debug(`this.pixels[${offset + i}] = ${(scanline[i] + this.pixels[offset + i - bpp]) & 0xFF}`);
      this.pixels[offset + i] = (scanline[i] + this.pixels[offset + i - bpp]) & 0xFF;
    }
  }

  /**
   * The Up() filter is just like the Sub() filter except that the pixel immediately above the current pixel, rather than just to its left, is used as the predictor.
   * Up(x) = Raw(x) + Prior(x)
   */
  /* istanbul ignore next */
  unFilterUp(scanline, _bpp, offset, length) {
    debug('unFilterUp:', 'offset:', offset, 'length:', length);
    let i = 0;
    let byte;
    let prev;
    // Prior(x) is 0 for all x on the first scanline
    if ((offset - length) < 0) {
      for (; i < length; i++) {
        this.pixels[offset + i] = scanline[i];
      }
    } else {
      for (; i < length; i++) {
      // Raw(x)
        byte = scanline[i];
        // Prior(x)
        prev = this.pixels[offset + i - length];
        this.pixels[offset + i] = (byte + prev) & 0xFF;
      }
    }
  }

  /**
   * The Average() filter uses the average of the two neighboring pixels (left and above) to predict the value of a pixel.
   * Average(x) = Raw(x) + floor((Raw(x-bpp)+Prior(x))/2)
   */
  /* istanbul ignore next */
  unFilterAverage(scanline, bpp, offset, length) {
    debug('unFilterAverage:', 'bpp:', bpp, 'offset:', offset, 'length:', length);
    let i = 0; let byte; let prev; let
      prior;
    if ((offset - length) < 0) {
      // Prior(x) == 0 && Raw(x - bpp) == 0
      for (; i < bpp; i++) {
        this.pixels[offset + i] = scanline[i];
      }
      // Prior(x) == 0 && Raw(x - bpp) != 0 (right shift, prevent doubles)
      for (; i < length; i++) {
        this.pixels[offset + i] = (scanline[i] + (this.pixels[offset + i - bpp] >> 1)) & 0xFF;
      }
    } else {
      // Prior(x) != 0 && Raw(x - bpp) == 0
      for (; i < bpp; i++) {
        this.pixels[offset + i] = (scanline[i] + (this.pixels[offset - length + i] >> 1)) & 0xFF;
      }
      // Prior(x) != 0 && Raw(x - bpp) != 0
      for (; i < length; i++) {
        byte = scanline[i];
        prev = this.pixels[offset + i - bpp];
        prior = this.pixels[offset + i - length];
        this.pixels[offset + i] = (byte + (prev + prior >> 1)) & 0xFF;
      }
    }
  }

  /**
   * The Paeth() filter computes a simple linear function of the three neighboring pixels (left, above, upper left), then chooses as predictor the neighboring pixel closest to the computed value.
   * This technique was developed by Alan W. Paeth.
   * Paeth(x) = Raw(x) + PaethPredictor(Raw(x-bpp), Prior(x), Prior(x-bpp))
   *  function PaethPredictor (a, b, c)
   *  begin
   *       ; a = left, b = above, c = upper left
   *       p := a + b - c        ; initial estimate
   *       pa := abs(p - a)      ; distances to a, b, c
   *       pb := abs(p - b)
   *       pc := abs(p - c)
   *       ; return nearest of a,b,c,
   *       ; breaking ties in order a,b,c.
   *       if pa <= pb AND pa <= pc then return a
   *       else if pb <= pc then return b
   *       else return c
   *  end
   */
  /* istanbul ignore next */
  unFilterPaeth(scanline, bpp, offset, length) {
    debug('unFilterPaeth:', 'bpp:', bpp, 'offset:', offset, 'length:', length);
    let i = 0;
    let raw;
    let a;
    let b;
    let c;
    let p;
    let pa;
    let pb;
    let pc;
    let pr;
    if ((offset - length) < 0) {
      // Prior(x) == 0 && Raw(x - bpp) == 0
      for (; i < bpp; i++) {
        this.pixels[offset + i] = scanline[i];
      }
      // Prior(x) == 0 && Raw(x - bpp) != 0
      // paethPredictor(x, 0, 0) is always x
      for (; i < length; i++) {
        this.pixels[offset + i] = (scanline[i] + this.pixels[offset + i - bpp]) & 0xFF;
      }
    } else {
      // Prior(x) != 0 && Raw(x - bpp) == 0
      // paethPredictor(x, 0, 0) is always x
      for (; i < bpp; i++) {
        this.pixels[offset + i] = (scanline[i] + this.pixels[offset + i - length]) & 0xFF;
      }
      // Prior(x) != 0 && Raw(x - bpp) != 0
      for (; i < length; i++) {
        raw = scanline[i];
        a = this.pixels[offset + i - bpp];
        b = this.pixels[offset + i - length];
        c = this.pixels[offset + i - length - bpp];
        p = a + b - c;
        pa = Math.abs(p - a);
        pb = Math.abs(p - b);
        pc = Math.abs(p - c);
        if (pa <= pb && pa <= pc) pr = a;
        else if (pb <= pc) pr = b;
        else pr = c;
        this.pixels[offset + i] = (raw + pr) & 0xFF;
      }
    }
  }
}

module.exports = ImagePNG;
