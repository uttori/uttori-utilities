/* eslint-disable ramda/prefer-ramda-boolean */
const test = require('ava');
const { DataBuffer, DataBufferList, DataStream, FileUtility } = require('../src');

const makeStream = (...arrays) => {
  const list = new DataBufferList();

  for (const array of [...arrays]) {
    list.append(new DataBuffer(new Uint8Array(array)));
  }

  return new DataStream(list);
};

test('fromBuffer', (t) => {
  const stream = DataStream.fromBuffer(new DataBuffer([10, 160], [20, 29, 119]));
  const copy = stream.copy();

  t.not(copy, stream);
  t.deepEqual(copy, stream);
});

test('compare: fully equal', (t) => {
  let stream_a = makeStream([10, 160], [20, 29, 119]);
  let stream_b = makeStream([10, 160], [20, 29, 119]);
  let output = stream_a.compare(stream_b);
  t.true(output);

  stream_a = makeStream([10, 160], [20, 29, 119]);
  stream_b = makeStream([10, 160], [20, 29, 119]);
  output = stream_a.compare(stream_b, 1);
  t.true(output);
});

test('compare: 1 byte different', (t) => {
  let stream_a = makeStream([10, 160], [20, 29, 119]);
  let stream_b = makeStream([11, 160], [20, 29, 119]);
  let output = stream_a.compare(stream_b);
  t.false(output);

  stream_a = makeStream([10, 160], [20, 29, 119]);
  stream_b = makeStream([11, 160], [20, 29, 119]);
  output = stream_a.compare(stream_b, 1);
  t.true(output);
});

test('compare: fully different', (t) => {
  const stream_a = makeStream([10, 160], [20, 29, 119]);
  const stream_b = makeStream([11, 161], [21, 30, 120]);
  let output = stream_a.compare(stream_b);
  t.false(output);

  output = stream_a.compare(stream_b, 1);
  t.false(output);
});

test('compare: invalid input', (t) => {
  const stream_a = makeStream([10, 160], [20, 29, 119]);
  let output = stream_a.compare();
  t.false(output);

  output = stream_a.compare({});
  t.false(output);

  output = stream_a.compare({ list: {} });
  t.false(output);

  output = stream_a.compare({ list: {}, availableBytes: 0 });
  t.false(output);
});

test('copy', (t) => {
  const stream = makeStream([10, 160], [20, 29, 119]);
  const copy = stream.copy();

  t.not(copy, stream);
  t.deepEqual(copy, stream);
});

test('advance', (t) => {
  const stream = makeStream([10, 160], [20, 29, 119]);
  t.is(0, stream.offset);

  stream.advance(2);
  t.is(2, stream.offset);

  t.throws(() => stream.advance(10), Error);
});

test('rewind', (t) => {
  const stream = makeStream([10, 160], [20, 29, 119]);

  stream.advance(4);
  t.is(4, stream.offset);
  t.is(2, stream.localOffset);

  stream.rewind(2);
  t.is(2, stream.offset);
  t.is(0, stream.localOffset);

  stream.rewind(1);
  t.is(1, stream.offset);
  t.is(1, stream.localOffset);

  stream.advance(3);
  t.is(4, stream.offset);
  t.is(2, stream.localOffset);

  stream.rewind(4);
  t.is(0, stream.offset);
  t.is(0, stream.localOffset);

  stream.advance(5);
  stream.rewind(4);
  t.is(1, stream.offset);
  t.is(1, stream.localOffset);

  t.throws(() => stream.rewind(10), Error);
});

test('seek', (t) => {
  const stream = makeStream([10, 160], [20, 29, 119]);

  stream.seek(3);
  t.is(3, stream.offset);
  t.is(1, stream.localOffset);

  stream.seek(1);
  t.is(1, stream.offset);
  t.is(1, stream.localOffset);

  // Testing the no-op equal branch of `position === this.offset`
  stream.seek(1);
  t.is(1, stream.offset);
  t.is(1, stream.localOffset);

  t.throws(() => stream.seek(100), Error);

  t.throws(() => stream.seek(-10), Error);
});

test('remainingBytes', (t) => {
  const stream = makeStream([10, 160], [20, 29, 119]);
  t.is(5, stream.remainingBytes());

  stream.advance(2);
  t.is(3, stream.remainingBytes());
});

test('buffer', (t) => {
  const stream = makeStream([10, 160], [20, 29, 119]);
  t.deepEqual(new DataBuffer(new Uint8Array([10, 160, 20, 29])), stream.peekBuffer(undefined, 4));
  t.deepEqual(new DataBuffer(new Uint8Array([10, 160, 20, 29])), stream.peekBuffer(0, 4));
  t.deepEqual(new DataBuffer(new Uint8Array([160, 20, 29, 119])), stream.peekBuffer(1, 4));
  t.deepEqual(new DataBuffer(new Uint8Array([10, 160, 20, 29])), stream.readBuffer(4));
});

test('single buffer', (t) => {
  const stream = makeStream([10, 160], [20, 29, 119]);
  t.deepEqual(new DataBuffer(new Uint8Array([10, 160])), stream.peekSingleBuffer(0, 4));
  t.deepEqual(new DataBuffer(new Uint8Array([10, 160])), stream.readSingleBuffer(4));
});

test('uint8', (t) => {
  let value;
  let stream = makeStream([10, 160], [20, 29, 119]);
  const values = [10, 160, 20, 29, 119];

  // check peek with correct offsets across buffers
  for (let i = 0; i < values.length; i++) {
    value = values[i];
    t.is(value, stream.peekUInt8(i));
  }

  t.throws(() => stream.peekUInt8(10), Error);

  // check reading across buffers
  for (value of [...values]) {
    t.is(value, stream.readUInt8());
  }

  t.throws(() => stream.readUInt8(), Error);

  // if it were a signed int, would be -1
  stream = makeStream([255, 23]);
  t.is(255, stream.readUInt8());

  // Get to the end.
  stream = makeStream([255, 23]);
  stream.available = () => true;
  stream.list.first = null;
  t.is(0, stream.peekUInt8());
});

test('int8', (t) => {
  let value;
  const stream = makeStream([0x23, 0xFF, 0x87], [0xAB, 0x7C, 0xEF]);
  const values = [0x23, -1, -121, -85, 124, -17];

  // peeking
  t.is(values[0], stream.peekInt8());
  for (let i = 0; i < values.length; i++) {
    value = values[i];
    t.is(value, stream.peekInt8(i));
  }

  // reading
  return (() => {
    const result = [];
    for (value of [...values]) {
      result.push(t.is(value, stream.readInt8()));
    }
    return result;
  })();
});

test('uint16', (t) => {
  let stream = makeStream([0, 0x23, 0x42], [0x3F]);
  const copy = stream.copy();

  // peeking big endian
  const iterable = [0x23, 0x2342, 0x423F];
  t.is(iterable[0], stream.peekUInt16());
  for (let i = 0; i < iterable.length; i++) {
    const value = iterable[i];
    t.is(value, stream.peekUInt16(i));
  }

  // peeking little endian
  const iterable1 = [0x2300, 0x4223, 0x3F42];
  t.is(iterable1[0], stream.peekUInt16(undefined, true));
  for (let i = 0; i < iterable1.length; i++) {
    const value = iterable1[i];
    t.is(value, stream.peekUInt16(i, true));
  }

  // reading big endian
  for (const value of [0x23, 0x423F]) {
    t.is(value, stream.readUInt16());
  }

  // reading little endian
  for (const value of [0x2300, 0x3F42]) {
    t.is(value, copy.readUInt16(true));
  }

  // check that it interprets as unsigned
  stream = makeStream([0xFE, 0xFE]);
  t.is(0xFEFE, stream.peekUInt16(0));
  t.is(0xFEFE, stream.peekUInt16(0, true));
});

test('int16', (t) => {
  const stream = makeStream([0x16, 0x79, 0xFF], [0x80]);
  const copy = stream.copy();

  // peeking big endian
  const iterable = [0x1679, -128];
  t.is(0x1679, stream.peekInt16());
  for (let i = 0; i < iterable.length; i++) {
    const value = iterable[i];
    t.is(value, stream.peekInt16(i * 2));
  }

  // peeking little endian
  const iterable1 = [0x7916, -32513];
  for (let i = 0; i < iterable1.length; i++) {
    const value = iterable1[i];
    t.is(value, stream.peekInt16(i * 2, true));
  }

  // reading big endian
  for (const value of [0x1679, -128]) {
    t.is(value, stream.readInt16());
  }

  // reading little endian
  return (() => {
    const result = [];
    const iterable2 = [0x7916, -32513];
    for (let i = 0; i < iterable2.length; i++) {
      const value = iterable2[i];
      result.push(t.is(value, copy.readInt16(true)));
    }
    return result;
  })();
});

test('uint24', (t) => {
  const stream = makeStream([0x23, 0x16], [0x56, 0x11, 0x78, 0xAF]);
  const copy = stream.copy();

  // peeking big endian
  const iterable = [0x231656, 0x165611, 0x561178, 0x1178AF];
  t.is(iterable[0], stream.peekUInt24());
  for (let i = 0; i < iterable.length; i++) {
    const value = iterable[i];
    t.is(value, stream.peekUInt24(i));
  }

  // peeking little endian
  const iterable1 = [0x561623, 0x115616, 0x781156, 0xAF7811];
  t.is(iterable1[0], stream.peekUInt24(undefined, true));
  for (let i = 0; i < iterable1.length; i++) {
    const value = iterable1[i];
    t.is(value, stream.peekUInt24(i, true));
  }

  // reading big endian
  for (const value of [0x231656, 0x1178AF]) {
    t.is(value, stream.readUInt24());
  }

  return (() => {
    const result = [];
    for (const value of [0x561623, 0xAF7811]) {
      result.push(t.is(value, copy.readUInt24(true)));
    }
    return result;
  })();
});

test('int24', (t) => {
  const stream = makeStream([0x23, 0x16, 0x56], [0xFF, 0x10, 0xFA]);
  const copy = stream.copy();

  // peeking big endian
  const iterable = [0x231656, 0x1656FF, 0x56FF10, -61190];
  t.is(iterable[0], stream.peekInt24());
  for (let i = 0; i < iterable.length; i++) {
    const value = iterable[i];
    t.is(value, stream.peekInt24(i));
  }

  // peeking little endian
  const iterable1 = [0x561623, -43498, 0x10FF56, -388865];
  for (let i = 0; i < iterable1.length; i++) {
    const value = iterable1[i];
    t.is(value, stream.peekInt24(i, true));
  }

  // reading big endian
  for (const value of [0x231656, -61190]) {
    t.is(value, stream.readInt24());
  }

  // reading little endian
  return (() => {
    const result = [];
    for (const value of [0x561623, -388865]) {
      result.push(t.is(value, copy.readInt24(true)));
    }
    return result;
  })();
});

test('uint32', (t) => {
  const stream = makeStream([0x32, 0x65, 0x42], [0x56, 0x23], [0xFF, 0x45, 0x11]);
  const copy = stream.copy();

  // peeking big endian
  const iterable = [0x32654256, 0x65425623, 0x425623FF, 0x5623FF45, 0x23FF4511];
  t.is(iterable[0], stream.peekUInt32());
  for (let i = 0; i < iterable.length; i++) {
    const value = iterable[i];
    t.is(value, stream.peekUInt32(i));
  }

  // peeking little endian
  const iterable1 = [0x56426532, 0x23564265, 0xFF235642, 0x45FF2356, 0x1145FF23];
  t.is(iterable1[0], stream.peekUInt32(undefined, true));
  for (let i = 0; i < iterable1.length; i++) {
    const value = iterable1[i];
    t.is(value, stream.peekUInt32(i, true));
  }

  // reading big endian
  for (const value of [0x32654256, 0x23FF4511]) {
    t.is(value, stream.readUInt32());
  }

  // reading little endian
  return (() => {
    const result = [];
    for (const value of [0x56426532, 0x1145FF23]) {
      result.push(t.is(value, copy.readUInt32(true)));
    }
    return result;
  })();
});

test('int32', (t) => {
  let stream = makeStream([0x43, 0x53], [0x16, 0x79, 0xFF, 0xFE], [0xEF, 0xFA]);
  const copy = stream.copy();

  const stream2 = makeStream([0x42, 0xC3, 0x95], [0xA9, 0x36, 0x17]);

  // peeking big endian
  const iterable = [0x43531679, -69638];
  for (let i = 0; i < iterable.length; i++) {
    const value = iterable[i];
    t.is(value, stream.peekInt32(i * 4));
  }

  const iterable1 = [0x42C395A9, -1013601994, -1784072681];
  for (let i = 0; i < iterable1.length; i++) {
    const value = iterable1[i];
    t.is(value, stream2.peekInt32(i));
  }

  // peeking little endian
  const iterable2 = [0x79165343, -84934913];
  for (let i = 0; i < iterable2.length; i++) {
    const value = iterable2[i];
    t.is(value, stream.peekInt32(i * 4, true));
  }

  const iterable3 = [-1449802942, 917083587, 389458325];
  for (let i = 0; i < iterable3.length; i++) {
    const value = iterable3[i];
    t.is(value, stream2.peekInt32(i, true));
  }

  // reading big endian
  for (const value of [0x43531679, -69638]) {
    t.is(value, stream.readInt32());
  }

  // reading little endian
  for (const value of [0x79165343, -84934913]) {
    t.is(value, copy.readInt32(true));
  }

  stream = makeStream([0xFF, 0xFF, 0xFF, 0xFF]);
  t.is(-1, stream.peekInt32());
  t.is(-1, stream.peekInt32(0, true));
});

test('float32', (t) => {
  const stream = makeStream(
    [0, 0, 0x80],
    [0x3F, 0, 0, 0, 0xC0],
    [0xAB, 0xAA],
    [0xAA, 0x3E, 0, 0, 0, 0],
    [0, 0, 0],
    [0x80, 0, 0, 0x80],
    [0x7F, 0, 0, 0x80, 0xFF],
  );
  const copy = stream.copy();

  const valuesBE = [4.600602988224807e-41, 2.6904930515036488e-43, -1.2126478207002966e-12, 0, 1.793662034335766e-43, 4.609571298396486e-41, 4.627507918739843e-41];
  const valuesLE = [1, -2, 0.3333333432674408, 0, -0, Infinity, -Infinity];

  // peeking big endian
  for (let i = 0; i < valuesBE.length; i++) {
    const value = valuesBE[i];
    t.is(value, stream.peekFloat32(i * 4));
  }

  // peeking little endian
  for (let i = 0; i < valuesLE.length; i++) {
    const value = valuesLE[i];
    t.is(value, stream.peekFloat32(i * 4, true));
  }

  // reading big endian
  for (const value of [...valuesBE]) {
    t.is(value, stream.readFloat32());
  }

  // reading little endian
  for (const value of [...valuesLE]) {
    t.is(value, copy.readFloat32(true));
  }

  // special cases
  const stream2 = makeStream([0xFF, 0xFF, 0x7F, 0x7F]);
  t.true(Number.isNaN(stream2.peekFloat32()));
  t.true(Number.isNaN(stream2.peekFloat32(0)));
  t.is(3.4028234663852886e+38, stream2.peekFloat32(0, true));
});

test('float64', (t) => {
  let stream = makeStream([0x55, 0x55, 0x55, 0x55, 0x55, 0x55], [0xD5, 0x3F]);
  let copy = stream.copy();
  t.is(1.1945305291680097e+103, stream.peekFloat64());
  t.is(1.1945305291680097e+103, stream.peekFloat64(0));
  t.is(0.3333333333333333, stream.peekFloat64(0, true));
  t.is(1.1945305291680097e+103, stream.readFloat64());
  t.is(0.3333333333333333, copy.readFloat64(true));

  stream = makeStream([1, 0, 0, 0, 0, 0], [0xF0, 0x3F]);
  copy = stream.copy();
  t.is(7.291122019655968e-304, stream.peekFloat64(0));
  t.is(1.0000000000000002, stream.peekFloat64(0, true));
  t.is(7.291122019655968e-304, stream.readFloat64());
  t.is(1.0000000000000002, copy.readFloat64(true));

  stream = makeStream([2, 0, 0, 0, 0, 0], [0xF0, 0x3F]);
  copy = stream.copy();
  t.is(4.778309726801735e-299, stream.peekFloat64(0));
  t.is(1.0000000000000004, stream.peekFloat64(0, true));
  t.is(4.778309726801735e-299, stream.readFloat64());
  t.is(1.0000000000000004, copy.readFloat64(true));

  stream = makeStream([0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF], [0x0F, 0x00]);
  copy = stream.copy();
  t.true(Number.isNaN(stream.peekFloat64(0)));
  t.is(2.225073858507201e-308, stream.peekFloat64(0, true));
  t.true(Number.isNaN(stream.readFloat64()));
  t.is(2.225073858507201e-308, copy.readFloat64(true));

  stream = makeStream([0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF], [0xEF, 0x7F]);
  copy = stream.copy();
  t.true(Number.isNaN(stream.peekFloat64(0)));
  t.is(1.7976931348623157e+308, stream.peekFloat64(0, true));
  t.true(Number.isNaN(stream.readFloat64()));
  t.is(1.7976931348623157e+308, copy.readFloat64(true));

  stream = makeStream([0, 0, 0, 0, 0, 0], [0xF0, 0x3F]);
  copy = stream.copy();
  t.is(3.03865e-319, stream.peekFloat64(0));
  t.is(1, stream.peekFloat64(0, true));
  t.is(3.03865e-319, stream.readFloat64());
  t.is(1, copy.readFloat64(true));

  stream = makeStream([0, 0, 0, 0, 0, 0], [0x10, 0]);
  copy = stream.copy();
  t.is(2.0237e-320, stream.peekFloat64(0));
  t.is(2.2250738585072014e-308, stream.peekFloat64(0, true));
  t.is(2.0237e-320, stream.readFloat64());
  t.is(2.2250738585072014e-308, copy.readFloat64(true));

  stream = makeStream([0, 0, 0, 0, 0, 0], [0, 0]);
  copy = stream.copy();
  t.is(0, stream.peekFloat64(0));
  t.is(0, stream.peekFloat64(0, true));
  t.is(false, (1 / stream.peekFloat64(0, true)) < 0);
  t.is(0, stream.readFloat64());
  t.is(0, copy.readFloat64(true));

  stream = makeStream([0, 0, 0, 0, 0, 0], [0, 0x80]);
  copy = stream.copy();
  t.is(6.3e-322, stream.peekFloat64(0));
  t.is(-0, stream.peekFloat64(0, true));
  t.is(true, (1 / stream.peekFloat64(0, true)) < 0);
  t.is(6.3e-322, stream.readFloat64());
  t.is(-0, copy.readFloat64(true));

  stream = makeStream([0, 0, 0, 0, 0, 0], [0xF0, 0x7F]);
  copy = stream.copy();
  t.is(3.0418e-319, stream.peekFloat64(0));
  t.is(Infinity, stream.peekFloat64(0, true));
  t.is(3.0418e-319, stream.readFloat64());
  t.is(Infinity, copy.readFloat64(true));

  stream = makeStream([0, 0, 0, 0, 0, 0], [0xF0, 0xFF]);
  copy = stream.copy();
  t.is(3.04814e-319, stream.peekFloat64(0));
  t.is(-Infinity, stream.peekFloat64(0, true));
  t.is(3.04814e-319, stream.readFloat64());
  t.is(-Infinity, copy.readFloat64(true));
});

test('float80', (t) => {
  let stream = makeStream([0x3F, 0xFF, 0x80, 0x00, 0x00, 0x00], [0x00, 0x00, 0x00, 0x00]);
  let copy = stream.copy();
  t.is(1, stream.peekFloat80());
  t.is(0, stream.peekFloat80(0, true));
  t.is(1, stream.readFloat80());
  t.is(0, copy.readFloat80(true));

  stream = makeStream([0x00, 0x00, 0x00], [0x00, 0x00, 0x00, 0x00, 0x80, 0xFF, 0x3F]);
  t.is(1, stream.peekFloat80(0, true));
  t.is(1, stream.readFloat80(true));

  stream = makeStream([0xBF, 0xFF, 0x80, 0x00, 0x00, 0x00], [0x00, 0x00, 0x00, 0x00]);
  copy = stream.copy();
  t.is(-1, stream.peekFloat80());
  t.is(0, stream.peekFloat80(0, true));
  t.is(-1, stream.readFloat80());
  t.is(0, copy.readFloat80(true));

  stream = makeStream([0x00, 0x00, 0x00], [0x00, 0x00, 0x00, 0x00, 0x80, 0xFF, 0xBF]);
  t.is(-1, stream.peekFloat80(0, true));
  t.is(-1, stream.readFloat80(true));

  stream = makeStream([0x40, 0x0E, 0xAC, 0x44, 0, 0, 0, 0, 0, 0]);
  copy = stream.copy();
  t.is(44100, stream.peekFloat80());
  t.is(0, stream.peekFloat80(0, true));
  t.is(44100, stream.readFloat80());
  t.is(0, copy.readFloat80(true));

  stream = makeStream([0, 0, 0, 0, 0, 0, 0x44, 0xAC, 0x0E, 0x40]);
  t.is(44100, stream.peekFloat80(0, true));
  t.is(44100, stream.readFloat80(true));

  stream = makeStream([0x7F, 0xFF, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
  copy = stream.copy();
  t.is(Infinity, stream.peekFloat80());
  t.is(0, stream.peekFloat80(0, true));
  t.is(Infinity, stream.readFloat80());
  t.is(0, copy.readFloat80(true));

  stream = makeStream([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0x7F]);
  t.is(Infinity, stream.peekFloat80(0, true));
  t.is(Infinity, stream.readFloat80(true));

  stream = makeStream([0xFF, 0xFF, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
  t.is(-Infinity, stream.peekFloat80());
  t.is(-Infinity, stream.readFloat80());

  stream = makeStream([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF]);
  t.is(-Infinity, stream.peekFloat80(0, true));
  t.is(-Infinity, stream.readFloat80(true));

  stream = makeStream([0x7F, 0xFF, 0xFF, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
  t.true(Number.isNaN(stream.peekFloat80()));
  t.true(Number.isNaN(stream.readFloat80()));

  stream = makeStream([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0x7F]);
  t.true(Number.isNaN(stream.peekFloat80(0, true)));
  t.true(Number.isNaN(stream.readFloat80(true)));

  stream = makeStream([0x40, 0x00, 0xC9, 0x0F, 0xDA, 0x9E, 0x46, 0xA7, 0x88, 0x00]);
  t.is(3.14159265, stream.peekFloat80());
  t.is(3.14159265, stream.readFloat80());

  stream = makeStream([0x00, 0x88, 0xA7, 0x46, 0x9E, 0xDA, 0x0F, 0xC9, 0x00, 0x40]);
  t.is(3.14159265, stream.peekFloat80(0, true));
  t.is(3.14159265, stream.readFloat80(true));

  stream = makeStream([0x3F, 0xFD, 0xAA, 0xAA, 0xAA, 0xAA, 0xAA, 0xAA, 0xA8, 0xFF]);
  copy = stream.copy();
  t.is(0.3333333333333333, stream.peekFloat80());
  t.is(-Infinity, stream.peekFloat80(0, true));
  t.is(0.3333333333333333, stream.readFloat80());
  t.is(-Infinity, copy.readFloat80(true));

  stream = makeStream([0x41, 0x55, 0xAA, 0xAA, 0xAA, 0xAA, 0xAE, 0xA9, 0xF8, 0x00]);
  t.is(1.1945305291680097e+103, stream.peekFloat80());
  t.is(1.1945305291680097e+103, stream.readFloat80());

  stream = makeStream([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
  t.is(0, stream.peekFloat80());
});

test('ascii/latin1', (t) => {
  const stream = makeStream([0x68, 0x65, 0x6C, 0x6C, 0x6F]);
  t.is('hello', stream.peekString(undefined, 5));
  t.is('hello', stream.peekString(0, 5));
  t.is('hello', stream.peekString(0, 5, 'ascii'));
  t.is('hello', stream.peekString(0, 5, 'latin1'));
  t.is('hello', stream.readString(5, 'ascii'));
  t.is(5, stream.offset);
});

test('ascii/latin1 null terminated', (t) => {
  const stream = makeStream([0x68, 0x65, 0x6C, 0x6C, 0x6F, 0]);
  t.is('hello\0', stream.peekString(0, 6));
  t.is('hello', stream.peekString(0, null));
  t.is('hello', stream.readString(null));
  t.is(6, stream.offset);
});

test('utf8', (t) => {
  let stream = makeStream([195, 188, 98, 101, 114]);
  t.is('über', stream.peekString(0, 5, 'utf8'));
  t.is('über', stream.readString(5, 'utf8'));
  t.is(5, stream.offset);

  stream = makeStream([0xC3, 0xB6, 0xE6, 0x97, 0xA5, 0xE6, 0x9C, 0xAC, 0xE8, 0xAA, 0x9E]);
  t.is('ö日本語', stream.peekString(0, 11, 'utf8'));
  t.is('ö日本語', stream.readString(11, 'utf8'));
  t.is(11, stream.offset);

  stream = makeStream([0xF0, 0x9F, 0x91, 0x8D]);
  t.is('👍', stream.peekString(0, 4, 'utf8'));
  t.is('👍', stream.readString(4, 'utf8'));
  t.is(4, stream.offset);

  stream = makeStream([0xE2, 0x82, 0xAC]);
  t.is('€', stream.peekString(0, 3, 'utf8'));
  t.is('€', stream.readString(3, 'utf8'));
  t.is(3, stream.offset);
});

test('utf-8 null terminated', (t) => {
  let stream = makeStream([195, 188, 98, 101, 114, 0]);
  t.is('über', stream.peekString(0, null, 'utf-8'));
  t.is('über', stream.readString(null, 'utf-8'));
  t.is(6, stream.offset);

  stream = makeStream([0xC3, 0xB6, 0xE6, 0x97, 0xA5, 0xE6, 0x9C, 0xAC, 0xE8, 0xAA, 0x9E, 0]);
  t.is('ö日本語', stream.peekString(0, null, 'utf8'));
  t.is('ö日本語', stream.readString(null, 'utf8'));
  t.is(12, stream.offset);

  stream = makeStream([0xF0, 0x9F, 0x91, 0x8D, 0]);
  t.is('👍', stream.peekString(0, null, 'utf8'));
  t.is('👍', stream.readString(null, 'utf8'));
  t.is(5, stream.offset);

  stream = makeStream([0xE2, 0x82, 0xAC, 0]);
  t.is('€', stream.peekString(0, null, 'utf8'));
  t.is('€', stream.readString(null, 'utf8'));
  t.is(4, stream.offset);
});

test('utf16be', (t) => {
  let stream = makeStream([0, 252, 0, 98, 0, 101, 0, 114]);
  t.is('über', stream.peekString(0, 8, 'utf16be'));
  t.is('über', stream.readString(8, 'utf16be'));
  t.is(8, stream.offset);

  stream = makeStream([4, 63, 4, 64, 4, 56, 4, 50, 4, 53, 4, 66]);
  t.is('привет', stream.peekString(0, 12, 'utf16be'));
  t.is('привет', stream.readString(12, 'utf16be'));
  t.is(12, stream.offset);

  stream = makeStream([0, 0xF6, 0x65, 0xE5, 0x67, 0x2C, 0x8A, 0x9E]);
  t.is('ö日本語', stream.peekString(0, 8, 'utf16be'));
  t.is('ö日本語', stream.readString(8, 'utf16be'));
  t.is(8, stream.offset);

  stream = makeStream([0xD8, 0x3D, 0xDC, 0x4D]);
  t.is('👍', stream.peekString(0, 4, 'utf16be'));
  t.is('👍', stream.readString(4, 'utf16be'));
  t.is(4, stream.offset);
});

test('utf16-be null terminated', (t) => {
  let stream = makeStream([0, 252, 0, 98, 0, 101, 0, 114, 0, 0]);
  t.is('über', stream.peekString(0, null, 'utf16-be'));
  t.is('über', stream.readString(null, 'utf16-be'));
  t.is(10, stream.offset);

  stream = makeStream([4, 63, 4, 64, 4, 56, 4, 50, 4, 53, 4, 66, 0, 0]);
  t.is('привет', stream.peekString(0, null, 'utf16be'));
  t.is('привет', stream.readString(null, 'utf16be'));
  t.is(14, stream.offset);

  stream = makeStream([0, 0xF6, 0x65, 0xE5, 0x67, 0x2C, 0x8A, 0x9E, 0, 0]);
  t.is('ö日本語', stream.peekString(0, null, 'utf16be'));
  t.is('ö日本語', stream.readString(null, 'utf16be'));
  t.is(10, stream.offset);

  stream = makeStream([0xD8, 0x3D, 0xDC, 0x4D, 0, 0]);
  t.is('👍', stream.peekString(0, null, 'utf16be'));
  t.is('👍', stream.readString(null, 'utf16be'));
  t.is(6, stream.offset);
});

test('utf16le', (t) => {
  let stream = makeStream([252, 0, 98, 0, 101, 0, 114, 0]);
  t.is('über', stream.peekString(0, 8, 'utf16le'));
  t.is('über', stream.readString(8, 'utf16le'));
  t.is(8, stream.offset);

  stream = makeStream([63, 4, 64, 4, 56, 4, 50, 4, 53, 4, 66, 4]);
  t.is('привет', stream.peekString(0, 12, 'utf16le'));
  t.is('привет', stream.readString(12, 'utf16le'));
  t.is(12, stream.offset);

  stream = makeStream([0xF6, 0, 0xE5, 0x65, 0x2C, 0x67, 0x9E, 0x8A]);
  t.is('ö日本語', stream.peekString(0, 8, 'utf16le'));
  t.is('ö日本語', stream.readString(8, 'utf16le'));
  t.is(8, stream.offset);

  stream = makeStream([0x42, 0x30, 0x44, 0x30, 0x46, 0x30, 0x48, 0x30, 0x4A, 0x30]);
  t.is('あいうえお', stream.peekString(0, 10, 'utf16le'));
  t.is('あいうえお', stream.readString(10, 'utf16le'));
  t.is(10, stream.offset);

  stream = makeStream([0x3D, 0xD8, 0x4D, 0xDC]);
  t.is('👍', stream.peekString(0, 4, 'utf16le'));
  t.is('👍', stream.readString(4, 'utf16le'));
  t.is(4, stream.offset);
});

test('utf16-le null terminated', (t) => {
  let stream = makeStream([252, 0, 98, 0, 101, 0, 114, 0, 0, 0]);
  t.is('über', stream.peekString(0, null, 'utf16-le'));
  t.is('über', stream.readString(null, 'utf16-le'));
  t.is(10, stream.offset);

  stream = makeStream([63, 4, 64, 4, 56, 4, 50, 4, 53, 4, 66, 4, 0, 0]);
  t.is('привет', stream.peekString(0, null, 'utf16le'));
  t.is('привет', stream.readString(null, 'utf16le'));
  t.is(14, stream.offset);

  stream = makeStream([0xF6, 0, 0xE5, 0x65, 0x2C, 0x67, 0x9E, 0x8A, 0, 0]);
  t.is('ö日本語', stream.peekString(0, null, 'utf16le'));
  t.is('ö日本語', stream.readString(null, 'utf16le'));
  t.is(10, stream.offset);

  stream = makeStream([0x42, 0x30, 0x44, 0x30, 0x46, 0x30, 0x48, 0x30, 0x4A, 0x30, 0, 0]);
  t.is('あいうえお', stream.peekString(0, null, 'utf16le'));
  t.is('あいうえお', stream.readString(null, 'utf16le'));
  t.is(12, stream.offset);

  stream = makeStream([0x3D, 0xD8, 0x4D, 0xDC, 0, 0]);
  t.is('👍', stream.peekString(0, null, 'utf16le'));
  t.is('👍', stream.readString(null, 'utf16le'));
  t.is(6, stream.offset);
});

test('utf16bom big endian', (t) => {
  let stream = makeStream([0xFE, 0xFF, 0, 252, 0, 98, 0, 101, 0, 114]);
  t.is('über', stream.peekString(0, 10, 'utf16bom'));
  t.is('über', stream.readString(10, 'utf16bom'));
  t.is(10, stream.offset);

  stream = makeStream([0xFE, 0xFF, 4, 63, 4, 64, 4, 56, 4, 50, 4, 53, 4, 66]);
  t.is('привет', stream.peekString(0, 14, 'utf16bom'));
  t.is('привет', stream.readString(14, 'utf16bom'));
  t.is(14, stream.offset);

  stream = makeStream([0xFE, 0xFF, 0, 0xF6, 0x65, 0xE5, 0x67, 0x2C, 0x8A, 0x9E]);
  t.is('ö日本語', stream.peekString(0, 10, 'utf16bom'));
  t.is('ö日本語', stream.readString(10, 'utf16bom'));
  t.is(10, stream.offset);

  stream = makeStream([0xFE, 0xFF, 0xD8, 0x3D, 0xDC, 0x4D]);
  t.is('👍', stream.peekString(0, 6, 'utf16bom'));
  t.is('👍', stream.readString(6, 'utf16bom'));
  t.is(6, stream.offset);
});

test('utf16-bom big endian, null terminated', (t) => {
  let stream = makeStream([0xFE, 0xFF, 0, 252, 0, 98, 0, 101, 0, 114, 0, 0]);
  t.is('über', stream.peekString(0, null, 'utf16-bom'));
  t.is('über', stream.readString(null, 'utf16-bom'));
  t.is(12, stream.offset);

  stream = makeStream([0xFE, 0xFF, 4, 63, 4, 64, 4, 56, 4, 50, 4, 53, 4, 66, 0, 0]);
  t.is('привет', stream.peekString(0, null, 'utf16-bom'));
  t.is('привет', stream.readString(null, 'utf16-bom'));
  t.is(16, stream.offset);

  stream = makeStream([0xFE, 0xFF, 0, 0xF6, 0x65, 0xE5, 0x67, 0x2C, 0x8A, 0x9E, 0, 0]);
  t.is('ö日本語', stream.peekString(0, null, 'utf16bom'));
  t.is('ö日本語', stream.readString(null, 'utf16bom'));
  t.is(12, stream.offset);

  stream = makeStream([0xFE, 0xFF, 0xD8, 0x3D, 0xDC, 0x4D, 0, 0]);
  t.is('👍', stream.peekString(0, null, 'utf16bom'));
  t.is('👍', stream.readString(null, 'utf16bom'));
  t.is(8, stream.offset);
});

test('utf16bom little endian', (t) => {
  let stream = makeStream([0xFF, 0xFE, 252, 0, 98, 0, 101, 0, 114, 0]);
  t.is('über', stream.peekString(0, 10, 'utf16bom'));
  t.is('über', stream.readString(10, 'utf16bom'));
  t.is(10, stream.offset);

  stream = makeStream([0xFF, 0xFE, 63, 4, 64, 4, 56, 4, 50, 4, 53, 4, 66, 4]);
  t.is('привет', stream.peekString(0, 14, 'utf16bom'));
  t.is('привет', stream.readString(14, 'utf16bom'));
  t.is(14, stream.offset);

  stream = makeStream([0xFF, 0xFE, 0xF6, 0, 0xE5, 0x65, 0x2C, 0x67, 0x9E, 0x8A]);
  t.is('ö日本語', stream.peekString(0, 10, 'utf16bom'));
  t.is('ö日本語', stream.readString(10, 'utf16bom'));
  t.is(10, stream.offset);

  stream = makeStream([0xFF, 0xFE, 0x3D, 0xD8, 0x4D, 0xDC]);
  t.is('👍', stream.peekString(0, 6, 'utf16bom'));
  t.is('👍', stream.readString(6, 'utf16bom'));
  t.is(6, stream.offset);
});

test('utf16-bom little endian, null terminated', (t) => {
  let stream = makeStream([0xFF, 0xFE, 252, 0, 98, 0, 101, 0, 114, 0, 0, 0]);
  t.is('über', stream.peekString(0, null, 'utf16-bom'));
  t.is('über', stream.readString(null, 'utf16-bom'));
  t.is(12, stream.offset);

  stream = makeStream([0xFF, 0xFE, 63, 4, 64, 4, 56, 4, 50, 4, 53, 4, 66, 4, 0, 0]);
  t.is('привет', stream.peekString(0, null, 'utf16bom'));
  t.is('привет', stream.readString(null, 'utf16bom'));
  t.is(16, stream.offset);

  stream = makeStream([0xFF, 0xFE, 0xF6, 0, 0xE5, 0x65, 0x2C, 0x67, 0x9E, 0x8A, 0, 0]);
  t.is('ö日本語', stream.peekString(0, null, 'utf16bom'));
  t.is('ö日本語', stream.readString(null, 'utf16bom'));
  t.is(12, stream.offset);

  stream = makeStream([0xFF, 0xFE, 0x3D, 0xD8, 0x4D, 0xDC, 0, 0]);
  t.is('👍', stream.peekString(0, null, 'utf16bom'));
  t.is('👍', stream.readString(null, 'utf16bom'));
  t.is(8, stream.offset);
});

test('decodeString', (t) => {
  const stream = makeStream([0xFF, 0xFE, 252, 0, 98, 0, 101, 0, 114, 0, 0, 0]);
  t.is('', stream.decodeString(0, 1, 'utf16-bom', true));
  t.is('', stream.decodeString(0, 1, 'utf16-bom', false));
});

test('decodeString invalid encoding', (t) => {
  const stream = makeStream([0xDC, 0x00, 0xDC, 0xBB, 0xDC, 0x00]);
  const error = t.throws(() => {
    stream.decodeString(0, null, 'magic');
  }, Error);

  t.is(error.message, 'Unknown encoding: magic');
});

test('decodeString invalid utf8-sequence', (t) => {
  const stream = makeStream([0xDC, 0x00, 0xE0, 0xBB, 0xDC, 0x00]);
  const error = t.throws(() => {
    stream.decodeString(0, null, 'utf16be');
  }, Error);

  t.is(error.message, 'Invalid utf16 sequence.');
});

test('read: can read files of any size', async (t) => {
  const data = await FileUtility.readFile('./test/assets', '4x4xGRAY-ZOPFLI', 'png', null);
  const buffer = new DataBuffer(data);
  const list = new DataBufferList();
  list.append(buffer);
  const stream = new DataStream(list, { size: 71 });

  const out = stream.read(71);
  t.is(out.length, 71);
});

test('peek: can peek files of any size', async (t) => {
  const data = await FileUtility.readFile('./test/assets', '4x4x8-RGB-MAGENTA-ZOPFLI', 'png', null);
  const buffer = new DataBuffer(data);
  const list = new DataBufferList();
  list.append(buffer);
  const stream = new DataStream(list, { size: 78 });

  const out = stream.peek(78);
  t.is(out.length, 78);
});
