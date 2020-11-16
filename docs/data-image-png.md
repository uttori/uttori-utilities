<a name="ImageGIF"></a>

## ImageGIF
PNG Decoder

**Kind**: global class
**See**

- [Chunk Specifications](http://www.libpng.org/pub/png/spec/1.2/PNG-Chunks.html)
- [The Art of PNG Glitch](https://ucnv.github.io/pnglitch/)
- [PngSuite, test-suite for PNG](http://www.schaik.com/pngsuite/)
- [Chunk Specifications (LibPNG)](http://www.libpng.org/pub/png/spec/1.2/PNG-Chunks.html)
- [Chunk Specifications (W3C)](https://www.w3.org/TR/PNG-Chunks.html)
- [PNGs containing a chunk with length 0xffffffff](http://www.simplesystems.org/libpng/FFFF/)
- [TweakPNG](https://github.com/jsummers/tweakpng)

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| width | <code>number</code> | Pixel Width |
| height | <code>number</code> | Pixel Height |
| bitDepth | <code>number</code> | Image Bit Depth, one of: 1, 2, 4, 8, 16 |
| colorType | <code>number</code> | = Defines pixel structure, one of: 0, 2, 3, 4, 6 |
| compressionMethod | <code>number</code> | Type of compression, always 0 |
| filterMethod | <code>number</code> | Type of filtering, always 0 |
| interlaceMethod | <code>number</code> | Type of interlacing, one of: 0, 1 |
| colors | <code>number</code> | Number of bytes for each pixel |
| alpha | <code>boolean</code> | True when the image has an alpha transparency layer |
| palette | <code>Array</code> \| <code>Uint8Array</code> | Raw Color data |
| pixels | <code>Uint8Array</code> | Raw Image Pixel data |
| transparency | <code>Uint8Array</code> | Raw Transparency data |
| physical | <code>object</code> | Object containing physical dimension information |
| physical.width | <code>number</code> | Physical Dimension Width |
| physical.height | <code>number</code> | Physical Dimension Height |
| physical.unit | <code>number</code> | Physical Dimension Units, with 0 being unknown and 1 being Meters |
| dataChunks | <code>Array.&lt;Uint8Array&gt;</code> | Image Data pieces |
| header | <code>Uint8Array</code> | PNG Signature from the data |


* [ImageGIF](#ImageGIF)
    * [new ImageGIF(list, options)](#new_ImageGIF_new)
    * _instance_
        * [.setBitDepth(bitDepth)](#ImageGIF+setBitDepth)
        * [.setColorType(colorType)](#ImageGIF+setColorType)
        * [.setCompressionMethod(compressionMethod)](#ImageGIF+setCompressionMethod)
        * [.setFilterMethod(filterMethod)](#ImageGIF+setFilterMethod)
        * [.setInterlaceMethod(interlaceMethod)](#ImageGIF+setInterlaceMethod)
        * [.setPalette(palette)](#ImageGIF+setPalette)
        * [.getPixel(x, y)](#ImageGIF+getPixel) ⇒ <code>Array</code>
        * [.parse()](#ImageGIF+parse)
        * [.decodeHeader()](#ImageGIF+decodeHeader)
        * [.decodeChunk()](#ImageGIF+decodeChunk) ⇒ <code>string</code>
        * [.decodeIHDR(chunk)](#ImageGIF+decodeIHDR)
        * [.decodePLTE(chunk)](#ImageGIF+decodePLTE)
        * [.decodeIDAT(chunk)](#ImageGIF+decodeIDAT)
        * [.decodeTRNS(chunk)](#ImageGIF+decodeTRNS)
        * [.decodePHYS(chunk)](#ImageGIF+decodePHYS)
        * [.decodeIEND(_chunk)](#ImageGIF+decodeIEND)
        * [.decodePixels()](#ImageGIF+decodePixels)
        * [.interlaceNone(data)](#ImageGIF+interlaceNone)
        * [.unFilterNone(scanline, bpp, offset, length)](#ImageGIF+unFilterNone)
        * [.unFilterSub(scanline, bpp, offset, length)](#ImageGIF+unFilterSub)
    * _static_
        * [.fromFile(data)](#ImageGIF.fromFile) ⇒ [<code>ImageGIF</code>](#ImageGIF)
        * [.fromBuffer(buffer)](#ImageGIF.fromBuffer) ⇒ [<code>ImageGIF</code>](#ImageGIF)

<a name="new_ImageGIF_new"></a>

### new ImageGIF(list, options)
Creates a new ImageGIF.


| Param | Type | Default | Description |
| --- | --- | --- | --- |
| list | <code>DataBufferList</code> |  | The DataBufferList of the image to process. |
| options | <code>object</code> |  | Options for this instance. |
| [options.size] | <code>number</code> | <code>16</code> | ArrayBuffer byteLength for the underlying binary parsing. |

**Example** *(new ImageGIF(list, options))*
```js
const image_data = await FileUtility.readFile('./test/assets/PngSuite', 'oi1n0g16', 'png', null);
const image = ImageGIF.fromFile(image_data);
image.decodePixels();
const length = image.pixels.length;
 ➜ 6144
const pixel = image.getPixel(0, 0);
 ➜ [255, 255, 255, 255]
```
<a name="ImageGIF+setBitDepth"></a>

### ImageGIF.setBitDepth(bitDepth)
Sets the bitDepth on the ImageGIF instance.

**Kind**: instance method of [<code>ImageGIF</code>](#ImageGIF)

| Param | Type | Description |
| --- | --- | --- |
| bitDepth | <code>number</code> | The bitDepth to set, one of: 1, 2, 4, 8, 16 |

<a name="ImageGIF+setColorType"></a>

### ImageGIF.setColorType(colorType)
Sets the colorType on the ImageGIF instance.
Both color and alpha properties are inferred from the colorType.

Color Type | Allowed Bit Depths | Interpretation
0          | 1,2,4,8,16         | Each pixel is a grayscale sample.
2          | 8,16               | Each pixel is an R,G,B triple.
3          | 1,2,4,8            | Each pixel is a palette index; a PLTE chunk must appear.
4          | 8,16               | Each pixel is a grayscale sample, followed by an alpha sample.
6          | 8,16               | Each pixel is an R,G,B triple, followed by an alpha sample.

**Kind**: instance method of [<code>ImageGIF</code>](#ImageGIF)
**Throws**:

- <code>Error</code> Invalid Color Type, anything other than 0, 2, 3, 4, 6


| Param | Type | Description |
| --- | --- | --- |
| colorType | <code>number</code> | The colorType to set, one of: 0, 2, 3, 4, 6 |

<a name="ImageGIF+setCompressionMethod"></a>

### ImageGIF.setCompressionMethod(compressionMethod)
Sets the compressionMethod on the ImageGIF instance.
The compressionMethod should always be 0.

**Kind**: instance method of [<code>ImageGIF</code>](#ImageGIF)
**Throws**:

- <code>Error</code> Unsupported Compression Method, anything other than 0


| Param | Type | Description |
| --- | --- | --- |
| compressionMethod | <code>number</code> | The compressionMethod to set, always 0 |

<a name="ImageGIF+setFilterMethod"></a>

### ImageGIF.setFilterMethod(filterMethod)
Sets the filterMethod on the ImageGIF instance.
The filterMethod should always be 0.

**Kind**: instance method of [<code>ImageGIF</code>](#ImageGIF)
**Throws**:

- <code>Error</code> Unsupported Filter Method, anything other than 0


| Param | Type | Description |
| --- | --- | --- |
| filterMethod | <code>number</code> | The filterMethod to set, always 0 |

<a name="ImageGIF+setInterlaceMethod"></a>

### ImageGIF.setInterlaceMethod(interlaceMethod)
Sets the interlaceMethod on the ImageGIF instance.
The interlaceMethod should always be 0 or 1.

**Kind**: instance method of [<code>ImageGIF</code>](#ImageGIF)
**Throws**:

- <code>Error</code> Unsupported Interlace Method, anything other than 0 or 1


| Param | Type | Description |
| --- | --- | --- |
| interlaceMethod | <code>number</code> | The filterMethod to set, always 0 or 1 |

<a name="ImageGIF+setPalette"></a>

### ImageGIF.setPalette(palette)
Sets the palette on the ImageGIF instance.

**Kind**: instance method of [<code>ImageGIF</code>](#ImageGIF)
**Throws**:

- <code>Error</code> No color in the palette
- <code>Error</code> Too many colors for the current bit depth


| Param | Type | Description |
| --- | --- | --- |
| palette | <code>Array</code> \| <code>Uint8Array</code> | The palette to set |

<a name="ImageGIF+getPixel"></a>

### ImageGIF.getPixel(x, y) ⇒ <code>Array</code>
Get the pixel color at a specified x, y location.

**Kind**: instance method of [<code>ImageGIF</code>](#ImageGIF)
**Returns**: <code>Array</code> - the color as [red, green, blue, alpha]
**Throws**:

- <code>Error</code> x is out of bound for the image
- <code>Error</code> y is out of bound for the image
- <code>Error</code> Unknown color types


| Param | Type | Description |
| --- | --- | --- |
| x | <code>number</code> | The hoizontal offset to read. |
| y | <code>number</code> | The vertical offset to read. |

<a name="ImageGIF+parse"></a>

### ImageGIF.parse()
Parse the PNG file, decoding the supported chunks.

**Kind**: instance method of [<code>ImageGIF</code>](#ImageGIF)
<a name="ImageGIF+decodeHeader"></a>

### ImageGIF.decodeHeader()
Decodes and validates PNG Header.
Signature (Decimal): [137, 80, 78, 71, 13, 10, 26, 10]
Signature (Hexadecimal): [89, 50, 4E, 47, 0D, 0A, 1A, 0A]
Signature (ASCII): [\211, P, N, G, \r, \n, \032, \n]

**Kind**: instance method of [<code>ImageGIF</code>](#ImageGIF)
**Throws**:

- <code>Error</code> Missing or invalid PNG header

**See**: [PNG Signature](http://www.w3.org/TR/2003/REC-PNG-20031110/#5PNG-file-signature)
<a name="ImageGIF+decodeChunk"></a>

### ImageGIF.decodeChunk() ⇒ <code>string</code>
Decodes the chunk type, and attempts to parse that chunk if supported.
Supported Chunk Types: IHDR, PLTE, IDAT, IEND, tRNS, pHYs

Chunk Structure:
Length: 4 bytes
Type:   4 bytes (IHDR, PLTE, IDAT, IEND, etc.)
Chunk:  {length} bytes
CRC:    4 bytes

**Kind**: instance method of [<code>ImageGIF</code>](#ImageGIF)
**Returns**: <code>string</code> - Chunk Type
**Throws**:

- <code>Error</code> Invalid Chunk Length when less than 0

**See**: [Chunk Layout](http://www.w3.org/TR/2003/REC-PNG-20031110/#5Chunk-layout)
<a name="ImageGIF+decodeIHDR"></a>

### ImageGIF.decodeIHDR(chunk)
Decode the IHDR (Image header) chunk.
Should be the first chunk in the data stream.

Width:              4 bytes
Height:             4 bytes
Bit Depth:          1 byte
Colour Type:        1 byte
Compression Method: 1 byte
Filter Method:      1 byte
Interlace Method:   1 byte

**Kind**: instance method of [<code>ImageGIF</code>](#ImageGIF)
**See**

- [Image Header](http://www.w3.org/TR/2003/REC-PNG-20031110/#11IHDR)
- [Image Header](http://www.libpng.org/pub/png/spec/1.2/png-1.2-pdg.html#C.IHDR)


| Param | Type | Description |
| --- | --- | --- |
| chunk | <code>Uint8Array</code> | Data Blob |

<a name="ImageGIF+decodePLTE"></a>

### ImageGIF.decodePLTE(chunk)
Decode the PLTE (Palette) chunk.
The PLTE chunk contains from 1 to 256 palette entries, each a three-byte series of the form.
The number of entries is determined from the chunk length. A chunk length not divisible by 3 is an error.

**Kind**: instance method of [<code>ImageGIF</code>](#ImageGIF)
**See**: [Palette](http://www.w3.org/TR/PNG/#11PLTE)

| Param | Type | Description |
| --- | --- | --- |
| chunk | <code>Uint8Array</code> | Data Blob |

<a name="ImageGIF+decodeIDAT"></a>

### ImageGIF.decodeIDAT(chunk)
Decode the IDAT (Image Data) chunk.
The IDAT chunk contains the actual image data which is the output stream of the compression algorithm.

**Kind**: instance method of [<code>ImageGIF</code>](#ImageGIF)
**See**: [Image Data](http://www.w3.org/TR/2003/REC-PNG-20031110/#11IDAT)

| Param | Type | Description |
| --- | --- | --- |
| chunk | <code>Uint8Array</code> | Data Blob |

<a name="ImageGIF+decodeTRNS"></a>

### ImageGIF.decodeTRNS(chunk)
Decode the tRNS (Transparency) chunk.
The tRNS chunk specifies that the image uses simple transparency: either alpha values associated with palette entries (for indexed-color images) or a single transparent color (for grayscale and truecolor images). Although simple transparency is not as elegant as the full alpha channel, it requires less storage space and is sufficient for many common cases.

**Kind**: instance method of [<code>ImageGIF</code>](#ImageGIF)
**See**: [Transparency](https://www.w3.org/TR/PNG/#11tRNS)

| Param | Type | Description |
| --- | --- | --- |
| chunk | <code>Uint8Array</code> | Data Blob |

<a name="ImageGIF+decodePHYS"></a>

### ImageGIF.decodePHYS(chunk)
Decode the pHYs (Pixel Dimensions) chunk.
The pHYs chunk specifies the intended pixel size or aspect ratio for display of the image.
When the unit specifier is 0, the pHYs chunk defines pixel aspect ratio only; the actual size of the pixels remains unspecified.
If the pHYs chunk is not present, pixels are assumed to be square, and the physical size of each pixel is unspecified.

Structure:
Pixels per unit, X axis: 4 bytes (unsigned integer)
Pixels per unit, Y axis: 4 bytes (unsigned integer)
Unit specifier:          1 byte
0: unit is unknown
1: unit is the meter

**Kind**: instance method of [<code>ImageGIF</code>](#ImageGIF)
**See**: [Pixel Dimensions](https://www.w3.org/TR/PNG/#11pHYs)

| Param | Type | Description |
| --- | --- | --- |
| chunk | <code>Uint8Array</code> | Data Blob |

<a name="ImageGIF+decodeIEND"></a>

### ImageGIF.decodeIEND(_chunk)
Decode the IEND (Image trailer) chunk.
The IEND chunk marks the end of the PNG datastream. The chunk's data field is empty.

**Kind**: instance method of [<code>ImageGIF</code>](#ImageGIF)
**See**: [Image Trailer](http://www.w3.org/TR/2003/REC-PNG-20031110/#11IEND)

| Param | Type | Description |
| --- | --- | --- |
| _chunk | <code>Uint8Array</code> | Unused. |

<a name="ImageGIF+decodePixels"></a>

### ImageGIF.decodePixels()
Uncompress IDAT chunks.

**Kind**: instance method of [<code>ImageGIF</code>](#ImageGIF)
**Throws**:

- <code>Error</code> No IDAT chunks to decode
- <code>Error</code> Deinterlacing Error
- <code>Error</code> Inflating Error
- <code>Error</code> Adam7 interlaced format is unsupported

<a name="ImageGIF+interlaceNone"></a>

### ImageGIF.interlaceNone(data)
Deinterlace with no interlacing.

**Kind**: instance method of [<code>ImageGIF</code>](#ImageGIF)
**See**: [PNG Filters](https://www.w3.org/TR/PNG-Filters.html)

| Param | Type | Description |
| --- | --- | --- |
| data | <code>Buffer</code> | Data to deinterlace. |

<a name="ImageGIF+unFilterNone"></a>

### ImageGIF.unFilterNone(scanline, bpp, offset, length)
No filtering, direct copy.

**Kind**: instance method of [<code>ImageGIF</code>](#ImageGIF)

| Param | Type | Description |
| --- | --- | --- |
| scanline | <code>Array</code> \| <code>Uint8Array</code> | Scanline to search for pixels in. |
| bpp | <code>number</code> | Bytes Per Pixel |
| offset | <code>number</code> | Offset |
| length | <code>number</code> | Length |

<a name="ImageGIF+unFilterSub"></a>

### ImageGIF.unFilterSub(scanline, bpp, offset, length)
The Sub() filter transmits the difference between each byte and the value of the corresponding byte of the prior pixel.
Sub(x) = Raw(x) + Raw(x - bpp)

**Kind**: instance method of [<code>ImageGIF</code>](#ImageGIF)

| Param | Type | Description |
| --- | --- | --- |
| scanline | <code>Array</code> \| <code>Uint8Array</code> | Scanline to search for pixels in. |
| bpp | <code>number</code> | Bytes Per Pixel |
| offset | <code>number</code> | Offset |
| length | <code>number</code> | Length |

<a name="ImageGIF.fromFile"></a>

### ImageGIF.fromFile(data) ⇒ [<code>ImageGIF</code>](#ImageGIF)
Creates a new ImageGIF from file data.

**Kind**: static method of [<code>ImageGIF</code>](#ImageGIF)
**Returns**: [<code>ImageGIF</code>](#ImageGIF) - the new ImageGIF instance for the provided file data

| Param | Type | Description |
| --- | --- | --- |
| data | <code>string</code> \| <code>Buffer</code> | The data of the image to process. |

<a name="ImageGIF.fromBuffer"></a>

### ImageGIF.fromBuffer(buffer) ⇒ [<code>ImageGIF</code>](#ImageGIF)
Creates a new ImageGIF from a DataBuffer.

**Kind**: static method of [<code>ImageGIF</code>](#ImageGIF)
**Returns**: [<code>ImageGIF</code>](#ImageGIF) - the new ImageGIF instance for the provided DataBuffer

| Param | Type | Description |
| --- | --- | --- |
| buffer | <code>DataBuffer</code> | The DataBuffer of the image to process. |

