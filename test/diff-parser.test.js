/* eslint-disable no-useless-escape, no-tabs */
/* eslint-disable no-console, no-loop-func */
const test = require('ava');
const { DiffParser } = require('../src');

test('parse(sql): parses a unified diff string into an abstract syntax tree', (t) => {
  const diff = `--- site/content/superdisc-memory-map.json	2019-09-29 20:15:46.000000000 -0700
+++ site/content/history/superdisc-memory-map/1557361655980.json	2019-09-29 20:15:46.000000000 -0700
@@ -1,13 +1,11 @@
  {
    "createDate": null,
-  "excerpt": "SuperDisc Memory Map",
+  "excerpt": "1111",
    "html": "",
    "language": "",
-  "updateDate": 1557722844706
+  "updateDate": 1557361655973
  }
\\ No newline at end of file
`;
  const parser = new DiffParser();
  const result = parser.parse(diff);
  t.is(1, result.length);
  t.deepEqual(result[0], {
    chunks: [
      {
        header: {
          line_numbers_from_file: {
            count: 13,
            start: 1,
          },
          line_numbers_to_file: {
            count: 11,
            start: 1,
          },
          mode: 'unified',
          raw: '@@ -1,13 +1,11 @@',
        },
        lines: [
          {
            line_number_new: 1,
            line_number_old: 1,
            raw: '  {',
            text: ' {',
            type: 'unchanged',
          },
          {
            line_number_new: 2,
            line_number_old: 2,
            raw: '    "createDate": null,',
            text: '   "createDate": null,',
            type: 'unchanged',
          },
          {
            line_number_new: null,
            line_number_old: 3,
            raw: '-  "excerpt": "SuperDisc Memory Map",',
            text: '  "excerpt": "SuperDisc Memory Map",',
            type: 'change-old',
          },
          {
            line_number_new: 3,
            line_number_old: null,
            raw: '+  "excerpt": "1111",',
            text: '  "excerpt": "1111",',
            type: 'change-new',
          },
          {
            line_number_new: 4,
            line_number_old: 4,
            raw: '    "html": "",',
            text: '   "html": "",',
            type: 'unchanged',
          },
          {
            line_number_new: 5,
            line_number_old: 5,
            raw: '    "language": "",',
            text: '   "language": "",',
            type: 'unchanged',
          },
          {
            line_number_new: null,
            line_number_old: 6,
            raw: '-  "updateDate": 1557722844706',
            text: '  "updateDate": 1557722844706',
            type: 'change-old',
          },
          {
            line_number_new: 6,
            line_number_old: null,
            raw: '+  "updateDate": 1557361655973',
            text: '  "updateDate": 1557361655973',
            type: 'change-new',
          },
          {
            line_number_new: 7,
            line_number_old: 7,
            raw: '  }',
            text: ' }',
            type: 'unchanged',
          },
          {
            line_number_new: null,
            line_number_old: null,
            raw: '\\ No newline at end of file',
            text: ' No newline at end of file',
            type: 'missing-new-line-eof',
          },
        ],
      },
    ],
    cli: '',
    new: {
      date: '2019-09-29',
      filename: 'site/content/history/superdisc-memory-map/1557361655980.json',
      fraction_seconds: '000000000',
      raw: '+++ site/content/history/superdisc-memory-map/1557361655980.json\t2019-09-29 20:15:46.000000000 -0700',
      time: '20:15:46',
      time_zone: '-0700',
      type: 'new-file',
    },
    old: {
      date: '2019-09-29',
      filename: 'site/content/superdisc-memory-map.json',
      fraction_seconds: '000000000',
      raw: '--- site/content/superdisc-memory-map.json\t2019-09-29 20:15:46.000000000 -0700',
      time: '20:15:46',
      time_zone: '-0700',
      type: 'old-file',
    },
    type: 'text',
  });
});

test('should parse unix with \\n diff', (t) => {
  const diff = 'diff --git a/sample b/sample\n'
    + 'index 0000001..0ddf2ba\n'
    + '--- a/sample\n'
    + '+++ b/sample\n'
    + '@@ -1 +1 @@\n'
    + '-test\n'
    + '+test1r\n';

  const parser = new DiffParser();
  const result = parser.parse(diff);
  t.is(1, result.length);
  t.deepEqual(result[0], {
    chunks: [
      {
        header: {
          line_numbers_from_file: {
            count: 0,
            start: 1,
          },
          line_numbers_to_file: {
            count: 0,
            start: 1,
          },
          mode: 'unified',
          raw: '@@ -1 +1 @@',
        },
        lines: [
          {
            line_number_new: null,
            line_number_old: 1,
            raw: '-test',
            text: 'test',
            type: 'change-old',
          },
          {
            line_number_new: 1,
            line_number_old: null,
            raw: '+test1r',
            text: 'test1r',
            type: 'change-new',
          },
        ],
      },
    ],
    cli: 'diff --git a/sample b/sample',
    index: 'index 0000001..0ddf2ba',
    type: 'text',
    old: {
      date: '',
      filename: 'sample',
      fraction_seconds: '',
      raw: '--- a/sample',
      time: '',
      time_zone: '',
      type: 'old-file',
    },
    new: {
      date: '',
      filename: 'sample',
      fraction_seconds: '',
      raw: '+++ b/sample',
      time: '',
      time_zone: '',
      type: 'new-file',
    },
  });
});

test('should parse windows with \\r\\n diff', (t) => {
  const diff = 'diff --git a/sample b/sample\r\n'
    + 'index 0000001..0ddf2ba\r\n'
    + '--- a/sample\r\n'
    + '+++ b/sample\r\n'
    + '@@ -1 +1 @@\r\n'
    + '-test\r\n'
    + '+test1r\r\n';

  const parser = new DiffParser();
  const result = parser.parse(diff);
  t.is(1, result.length);
  t.deepEqual(result[0], {
    chunks: [
      {
        header: {
          line_numbers_from_file: {
            count: 0,
            start: 1,
          },
          line_numbers_to_file: {
            count: 0,
            start: 1,
          },
          mode: 'unified',
          raw: '@@ -1 +1 @@',
        },
        lines: [
          {
            line_number_new: null,
            line_number_old: 1,
            raw: '-test',
            text: 'test',
            type: 'change-old',
          },
          {
            line_number_new: 1,
            line_number_old: null,
            raw: '+test1r',
            text: 'test1r',
            type: 'change-new',
          },
        ],
      },
    ],
    cli: 'diff --git a/sample b/sample',
    index: 'index 0000001..0ddf2ba',
    new: {
      date: '',
      filename: 'sample',
      fraction_seconds: '',
      raw: '+++ b/sample',
      time: '',
      time_zone: '',
      type: 'new-file',
    },
    old: {
      date: '',
      filename: 'sample',
      fraction_seconds: '',
      raw: '--- a/sample',
      time: '',
      time_zone: '',
      type: 'old-file',
    },
    type: 'text',
  });
});

test('should parse old os x with \\r diff', (t) => {
  const diff = 'diff --git a/sample b/sample\r'
    + 'index 0000001..0ddf2ba\r'
    + '--- a/sample\r'
    + '+++ b/sample\r'
    + '@@ -1 +1 @@\r'
    + '-test\r'
    + '+test1r\r';

  const parser = new DiffParser();
  const result = parser.parse(diff);
  t.is(1, result.length);
  t.deepEqual(result[0], {
    chunks: [
      {
        header: {
          line_numbers_from_file: {
            count: 0,
            start: 1,
          },
          line_numbers_to_file: {
            count: 0,
            start: 1,
          },
          mode: 'unified',
          raw: '@@ -1 +1 @@',
        },
        lines: [
          {
            line_number_new: null,
            line_number_old: 1,
            raw: '-test',
            text: 'test',
            type: 'change-old',
          },
          {
            line_number_new: 1,
            line_number_old: null,
            raw: '+test1r',
            text: 'test1r',
            type: 'change-new',
          },
        ],
      },
    ],
    cli: 'diff --git a/sample b/sample',
    index: 'index 0000001..0ddf2ba',
    new: {
      date: '',
      filename: 'sample',
      fraction_seconds: '',
      raw: '+++ b/sample',
      time: '',
      time_zone: '',
      type: 'new-file',
    },
    old: {
      date: '',
      filename: 'sample',
      fraction_seconds: '',
      raw: '--- a/sample',
      time: '',
      time_zone: '',
      type: 'old-file',
    },
    type: 'text',
  });
});

test('should parse mixed eols diff', (t) => {
  const diff = 'diff --git a/sample b/sample\n'
    + 'index 0000001..0ddf2ba\r\n'
    + '--- a/sample\r'
    + '+++ b/sample\r\n'
    + '@@ -1 +1 @@\n'
    + '-test\r'
    + '+test1r\n';

  const parser = new DiffParser();
  const result = parser.parse(diff);
  t.is(1, result.length);
  t.deepEqual(result[0], {
    chunks: [
      {
        header: {
          line_numbers_from_file: {
            count: 0,
            start: 1,
          },
          line_numbers_to_file: {
            count: 0,
            start: 1,
          },
          mode: 'unified',
          raw: '@@ -1 +1 @@',
        },
        lines: [
          {
            line_number_new: null,
            line_number_old: 1,
            raw: '-test',
            text: 'test',
            type: 'change-old',
          },
          {
            line_number_new: 1,
            line_number_old: null,
            raw: '+test1r',
            text: 'test1r',
            type: 'change-new',
          },
        ],
      },
    ],
    cli: 'diff --git a/sample b/sample',
    index: 'index 0000001..0ddf2ba',
    new: {
      date: '',
      filename: 'sample',
      fraction_seconds: '',
      raw: '+++ b/sample',
      time: '',
      time_zone: '',
      type: 'new-file',
    },
    old: {
      date: '',
      filename: 'sample',
      fraction_seconds: '',
      raw: '--- a/sample',
      time: '',
      time_zone: '',
      type: 'old-file',
    },
    type: 'text',
  });
});

test('should parse diff with special characters', (t) => {
  const diff = 'diff --git "a/bla with \ttab.scala" "b/bla with \ttab.scala"\n'
    + 'index 4c679d7..e9bd385 100644\n'
    + '--- "a/bla with \ttab.scala"\n'
    + '+++ "b/bla with \ttab.scala"\n'
    + '@@ -1 +1,2 @@\n'
    + '-cenas\n'
    + '+cenas com ananas\n'
    + '+bananas';

  const parser = new DiffParser();
  const result = parser.parse(diff);
  t.is(1, result.length);
  t.deepEqual(result[0], {
    chunks: [
      {
        header: {
          line_numbers_from_file: {
            count: 0,
            start: 1,
          },
          line_numbers_to_file: {
            count: 2,
            start: 1,
          },
          mode: 'unified',
          raw: '@@ -1 +1,2 @@',
        },
        lines: [
          {
            line_number_new: null,
            line_number_old: 1,
            raw: '-cenas',
            text: 'cenas',
            type: 'change-old',
          },
          {
            line_number_new: 1,
            line_number_old: null,
            raw: '+cenas com ananas',
            text: 'cenas com ananas',
            type: 'change-new',
          },
          {
            line_number_new: 2,
            line_number_old: null,
            raw: '+bananas',
            text: 'bananas',
            type: 'change-new',
          },
        ],
      },
    ],
    cli: 'diff --git "a/bla with \ttab.scala" "b/bla with \ttab.scala"',
    index: 'index 4c679d7..e9bd385 100644',
    new: {
      date: '',
      filename: 'bla with \ttab.scala',
      fraction_seconds: '',
      raw: '+++ "b/bla with \ttab.scala"',
      time: '',
      time_zone: '',
      type: 'new-file',
    },
    old: {
      date: '',
      filename: 'bla with \ttab.scala',
      fraction_seconds: '',
      raw: '--- "a/bla with \ttab.scala"',
      time: '',
      time_zone: '',
      type: 'old-file',
    },
    type: 'text',
  });
});

test('should parse diff with deleted file', (t) => {
  const diff = 'diff --git a/src/var/str.js b/src/var/str.js\n'
    + 'deleted file mode 100644\n'
    + 'index 04e16b0..0000000\n'
    + '--- a/src/var/str.js\n'
    + '+++ /dev/null\n'
    + '@@ -1,3 +0,0 @@\n'
    + '-define(function() {\n'
    + '-  return typeof undefined;\n'
    + '-});\n';

  const parser = new DiffParser();
  const result = parser.parse(diff);
  t.is(1, result.length);
  t.deepEqual(result[0], {
    chunks: [
      {
        header: {
          line_numbers_from_file: {
            count: 3,
            start: 1,
          },
          line_numbers_to_file: {
            count: 0,
            start: 0,
          },
          mode: 'unified',
          raw: '@@ -1,3 +0,0 @@',
        },
        lines: [
          {
            line_number_new: null,
            line_number_old: 1,
            raw: '-define(function() {',
            text: 'define(function() {',
            type: 'change-old',
          },
          {
            line_number_new: null,
            line_number_old: 2,
            raw: '-  return typeof undefined;',
            text: '  return typeof undefined;',
            type: 'change-old',
          },
          {
            line_number_new: null,
            line_number_old: 3,
            raw: '-});',
            text: '});',
            type: 'change-old',
          },
        ],
      },
    ],
    cli: 'diff --git a/src/var/str.js b/src/var/str.js',
    deleted: 'deleted file mode 100644',
    index: 'index 04e16b0..0000000',
    new: {
      date: '',
      filename: '/dev/null',
      fraction_seconds: '',
      raw: '+++ /dev/null',
      time: '',
      time_zone: '',
      type: 'new-file',
    },
    old: {
      date: '',
      filename: 'src/var/str.js',
      fraction_seconds: '',
      raw: '--- a/src/var/str.js',
      time: '',
      time_zone: '',
      type: 'old-file',
    },
    type: 'text',
  });
});

test('should parse diff with new file', (t) => {
  const diff = 'diff --git a/test.js b/test.js\n'
    + 'new file mode 100644\n'
    + 'index 0000000..e1e22ec\n'
    + '--- /dev/null\n'
    + '+++ b/test.js\n'
    + '@@ -0,0 +1,5 @@\n'
    + "+var parser = require('./source/git-parser');\n"
    + '+\n'
    + '+var patchLineList = [ false, false, false, false ];\n'
    + '+\n'
    + '+console.log(parser.parsePatchDiffResult(text, patchLineList));\n';

  const parser = new DiffParser();
  const result = parser.parse(diff);
  t.is(1, result.length);
  t.deepEqual(result[0], {
    chunks: [
      {
        header: {
          line_numbers_from_file: {
            count: 0,
            start: 0,
          },
          line_numbers_to_file: {
            count: 5,
            start: 1,
          },
          mode: 'unified',
          raw: '@@ -0,0 +1,5 @@',
        },
        lines: [
          {
            line_number_new: 1,
            line_number_old: null,
            raw: '+var parser = require(\'./source/git-parser\');',
            text: 'var parser = require(\'./source/git-parser\');',
            type: 'change-new',
          },
          {
            line_number_new: 2,
            line_number_old: null,
            raw: '+',
            text: '',
            type: 'change-new',
          },
          {
            line_number_new: 3,
            line_number_old: null,
            raw: '+var patchLineList = [ false, false, false, false ];',
            text: 'var patchLineList = [ false, false, false, false ];',
            type: 'change-new',
          },
          {
            line_number_new: 4,
            line_number_old: null,
            raw: '+',
            text: '',
            type: 'change-new',
          },
          {
            line_number_new: 5,
            line_number_old: null,
            raw: '+console.log(parser.parsePatchDiffResult(text, patchLineList));',
            text: 'console.log(parser.parsePatchDiffResult(text, patchLineList));',
            type: 'change-new',
          },
        ],
      },
    ],
    cli: 'diff --git a/test.js b/test.js',
    index: 'index 0000000..e1e22ec',
    new: {
      date: '',
      filename: 'test.js',
      fraction_seconds: '',
      raw: '+++ b/test.js',
      time: '',
      time_zone: '',
      type: 'new-file',
    },
    new_file: 'new file mode 100644',
    old: {
      date: '',
      filename: '/dev/null',
      fraction_seconds: '',
      raw: '--- /dev/null',
      time: '',
      time_zone: '',
      type: 'old-file',
    },
    type: 'text',
  });
});

test('should parse diff with nested diff', (t) => {
  const diff = 'diff --git a/src/offset.js b/src/offset.js\n'
    + 'index cc6ffb4..fa51f18 100644\n'
    + '--- a/src/offset.js\n'
    + '+++ b/src/offset.js\n'
    + '@@ -1,6 +1,5 @@\n'
    + "+var parser = require('./source/git-parser');\n"
    + '+\n'
    + "+var text = 'diff --git a/components/app/app.html b/components/app/app.html\\nindex ecb7a95..027bd9b 100644\\n--- a/components/app/app.html\\n+++ b/components/app/app.html\\n@@ -52,0 +53,3 @@\\n+\\n+\\n+\\n@@ -56,0 +60,3 @@\\n+\\n+\\n+\\n'\n"
    + '+var patchLineList = [ false, false, false, false ];\n'
    + '+\n'
    + '+console.log(parser.parsePatchDiffResult(text, patchLineList));\n';

  const parser = new DiffParser();
  const result = parser.parse(diff);
  t.is(1, result.length);
  t.deepEqual(result[0], {
    chunks: [
      {
        header: {
          line_numbers_from_file: {
            count: 6,
            start: 1,
          },
          line_numbers_to_file: {
            count: 5,
            start: 1,
          },
          mode: 'unified',
          raw: '@@ -1,6 +1,5 @@',
        },
        lines: [
          {
            line_number_new: 1,
            line_number_old: null,
            raw: '+var parser = require(\'./source/git-parser\');',
            text: 'var parser = require(\'./source/git-parser\');',
            type: 'change-new',
          },
          {
            line_number_new: 2,
            line_number_old: null,
            raw: '+',
            text: '',
            type: 'change-new',
          },
          {
            line_number_new: 3,
            line_number_old: null,
            raw: '+var text = \'diff --git a/components/app/app.html b/components/app/app.html\\nindex ecb7a95..027bd9b 100644\\n--- a/components/app/app.html\\n+++ b/components/app/app.html\\n@@ -52,0 +53,3 @@\\n+\\n+\\n+\\n@@ -56,0 +60,3 @@\\n+\\n+\\n+\\n\'',
            text: 'var text = \'diff --git a/components/app/app.html b/components/app/app.html\\nindex ecb7a95..027bd9b 100644\\n--- a/components/app/app.html\\n+++ b/components/app/app.html\\n@@ -52,0 +53,3 @@\\n+\\n+\\n+\\n@@ -56,0 +60,3 @@\\n+\\n+\\n+\\n\'',
            type: 'change-new',
          },
          {
            line_number_new: 4,
            line_number_old: null,
            raw: '+var patchLineList = [ false, false, false, false ];',
            text: 'var patchLineList = [ false, false, false, false ];',
            type: 'change-new',
          },
          {
            line_number_new: 5,
            line_number_old: null,
            raw: '+',
            text: '',
            type: 'change-new',
          },
          {
            line_number_new: 6,
            line_number_old: null,
            raw: '+console.log(parser.parsePatchDiffResult(text, patchLineList));',
            text: 'console.log(parser.parsePatchDiffResult(text, patchLineList));',
            type: 'change-new',
          },
        ],
      },
    ],
    cli: 'diff --git a/src/offset.js b/src/offset.js',
    index: 'index cc6ffb4..fa51f18 100644',
    new: {
      date: '',
      filename: 'src/offset.js',
      fraction_seconds: '',
      raw: '+++ b/src/offset.js',
      time: '',
      time_zone: '',
      type: 'new-file',
    },
    old: {
      date: '',
      filename: 'src/offset.js',
      fraction_seconds: '',
      raw: '--- a/src/offset.js',
      time: '',
      time_zone: '',
      type: 'old-file',
    },
    type: 'text',
  });
});

test('should parse diff with multiple blocks', (t) => {
  const diff = 'diff --git a/src/attributes/classes.js b/src/attributes/classes.js\n'
    + 'index c617824..c8d1393 100644\n'
    + '--- a/src/attributes/classes.js\n'
    + '+++ b/src/attributes/classes.js\n'
    + '@@ -1,10 +1,9 @@\n'
    + ' define([\n'
    + '   "../core",\n'
    + '   "../var/rnotwhite",\n'
    + '-  "../var/strundefined",\n'
    + '   "../data/var/dataPriv",\n'
    + '   "../core/init"\n'
    + '-], function( jQuery, rnotwhite, strundefined, dataPriv ) {\n'
    + '+], function( jQuery, rnotwhite, dataPriv ) {\n'
    + ' \n'
    + ' var rclass = /[\\t\\r\\n\\f]/g;\n'
    + ' \n'
    + '@@ -128,7 +127,7 @@\n'
    + ' jQuery.fn.extend({\n'
    + '         }\n'
    + ' \n'
    + '       // Toggle whole class name\n'
    + '-      } else if ( type === strundefined || type === "boolean" ) {\n'
    + '+      } else if ( value === undefined || type === "boolean" ) {\n'
    + '         if ( this.className ) {\n'
    + '           // store className if set\n'
    + '           dataPriv.set( this, "__className__", this.className );\n';

  const parser = new DiffParser();
  const result = parser.parse(diff);
  t.is(1, result.length);
  t.deepEqual(result[0], {
    chunks: [
      {
        header: {
          line_numbers_from_file: {
            count: 10,
            start: 1,
          },
          line_numbers_to_file: {
            count: 9,
            start: 1,
          },
          mode: 'unified',
          raw: '@@ -1,10 +1,9 @@',
        },
        lines: [
          {
            line_number_new: 1,
            line_number_old: 1,
            raw: ' define([',
            text: 'define([',
            type: 'unchanged',
          },
          {
            line_number_new: 2,
            line_number_old: 2,
            raw: '   "../core",',
            text: '  "../core",',
            type: 'unchanged',
          },
          {
            line_number_new: 3,
            line_number_old: 3,
            raw: '   "../var/rnotwhite",',
            text: '  "../var/rnotwhite",',
            type: 'unchanged',
          },
          {
            line_number_new: null,
            line_number_old: 4,
            raw: '-  "../var/strundefined",',
            text: '  "../var/strundefined",',
            type: 'change-old',
          },
          {
            line_number_new: 4,
            line_number_old: 5,
            raw: '   "../data/var/dataPriv",',
            text: '  "../data/var/dataPriv",',
            type: 'unchanged',
          },
          {
            line_number_new: 5,
            line_number_old: 6,
            raw: '   "../core/init"',
            text: '  "../core/init"',
            type: 'unchanged',
          },
          {
            line_number_new: null,
            line_number_old: 7,
            raw: '-], function( jQuery, rnotwhite, strundefined, dataPriv ) {',
            text: '], function( jQuery, rnotwhite, strundefined, dataPriv ) {',
            type: 'change-old',
          },
          {
            line_number_new: 6,
            line_number_old: null,
            raw: '+], function( jQuery, rnotwhite, dataPriv ) {',
            text: '], function( jQuery, rnotwhite, dataPriv ) {',
            type: 'change-new',
          },
          {
            line_number_new: 7,
            line_number_old: 8,
            raw: ' ',
            text: '',
            type: 'unchanged',
          },
          {
            line_number_new: 8,
            line_number_old: 9,
            raw: ' var rclass = /[\\t\\r\\n\\f]/g;',
            text: 'var rclass = /[\\t\\r\\n\\f]/g;',
            type: 'unchanged',
          },
          {
            line_number_new: 9,
            line_number_old: 10,
            raw: ' ',
            text: '',
            type: 'unchanged',
          },
        ],
      },
      {
        header: {
          line_numbers_from_file: {
            count: 7,
            start: 128,
          },
          line_numbers_to_file: {
            count: 7,
            start: 127,
          },
          mode: 'unified',
          raw: '@@ -128,7 +127,7 @@',
        },
        lines: [
          {
            line_number_new: 127,
            line_number_old: 128,
            raw: ' jQuery.fn.extend({',
            text: 'jQuery.fn.extend({',
            type: 'unchanged',
          },
          {
            line_number_new: 128,
            line_number_old: 129,
            raw: '         }',
            text: '        }',
            type: 'unchanged',
          },
          {
            line_number_new: 129,
            line_number_old: 130,
            raw: ' ',
            text: '',
            type: 'unchanged',
          },
          {
            line_number_new: 130,
            line_number_old: 131,
            raw: '       // Toggle whole class name',
            text: '      // Toggle whole class name',
            type: 'unchanged',
          },
          {
            line_number_new: null,
            line_number_old: 132,
            raw: '-      } else if ( type === strundefined || type === "boolean" ) {',
            text: '      } else if ( type === strundefined || type === "boolean" ) {',
            type: 'change-old',
          },
          {
            line_number_new: 131,
            line_number_old: null,
            raw: '+      } else if ( value === undefined || type === "boolean" ) {',
            text: '      } else if ( value === undefined || type === "boolean" ) {',
            type: 'change-new',
          },
          {
            line_number_new: 132,
            line_number_old: 133,
            raw: '         if ( this.className ) {',
            text: '        if ( this.className ) {',
            type: 'unchanged',
          },
          {
            line_number_new: 133,
            line_number_old: 134,
            raw: '           // store className if set',
            text: '          // store className if set',
            type: 'unchanged',
          },
          {
            line_number_new: 134,
            line_number_old: 135,
            raw: '           dataPriv.set( this, "__className__", this.className );',
            text: '          dataPriv.set( this, "__className__", this.className );',
            type: 'unchanged',
          },
        ],
      },
    ],
    cli: 'diff --git a/src/attributes/classes.js b/src/attributes/classes.js',
    index: 'index c617824..c8d1393 100644',
    new: {
      date: '',
      filename: 'src/attributes/classes.js',
      fraction_seconds: '',
      raw: '+++ b/src/attributes/classes.js',
      time: '',
      time_zone: '',
      type: 'new-file',
    },
    old: {
      date: '',
      filename: 'src/attributes/classes.js',
      fraction_seconds: '',
      raw: '--- a/src/attributes/classes.js',
      time: '',
      time_zone: '',
      type: 'old-file',
    },
    type: 'text',
  });
});

test('should parse diff with multiple files', (t) => {
  const diff = 'diff --git a/src/core/init.js b/src/core/init.js\n'
    + 'index e49196a..50f310c 100644\n'
    + '--- a/src/core/init.js\n'
    + '+++ b/src/core/init.js\n'
    + '@@ -101,7 +101,7 @@ var rootjQuery,\n'
    + '     // HANDLE: $(function)\n'
    + '     // Shortcut for document ready\n'
    + '     } else if ( jQuery.isFunction( selector ) ) {\n'
    + '-      return typeof rootjQuery.ready !== "undefined" ?\n'
    + '+      return rootjQuery.ready !== undefined ?\n'
    + '         rootjQuery.ready( selector ) :\n'
    + '         // Execute immediately if ready is not present\n'
    + '         selector( jQuery );\n'
    + 'diff --git a/src/event.js b/src/event.js\n'
    + 'index 7336f4d..6183f70 100644\n'
    + '--- a/src/event.js\n'
    + '+++ b/src/event.js\n'
    + '@@ -1,6 +1,5 @@\n'
    + ' define([\n'
    + '   "./core",\n'
    + '-  "./var/strundefined",\n'
    + '   "./var/rnotwhite",\n'
    + '   "./var/hasOwn",\n'
    + '   "./var/slice",\n';

  const parser = new DiffParser();
  const result = parser.parse(diff);
  t.is(2, result.length);
  t.deepEqual(result[0], {
    chunks: [
      {
        header: {
          line_numbers_from_file: {
            count: 7,
            start: 101,
          },
          line_numbers_to_file: {
            count: 7,
            start: 101,
          },
          mode: 'unified',
          raw: '@@ -101,7 +101,7 @@',
        },
        lines: [
          {
            line_number_new: 101,
            line_number_old: 101,
            raw: ' var rootjQuery,',
            text: 'var rootjQuery,',
            type: 'unchanged',
          },
          {
            line_number_new: 102,
            line_number_old: 102,
            raw: '     // HANDLE: $(function)',
            text: '    // HANDLE: $(function)',
            type: 'unchanged',
          },
          {
            line_number_new: 103,
            line_number_old: 103,
            raw: '     // Shortcut for document ready',
            text: '    // Shortcut for document ready',
            type: 'unchanged',
          },
          {
            line_number_new: 104,
            line_number_old: 104,
            raw: '     } else if ( jQuery.isFunction( selector ) ) {',
            text: '    } else if ( jQuery.isFunction( selector ) ) {',
            type: 'unchanged',
          },
          {
            line_number_new: null,
            line_number_old: 105,
            raw: '-      return typeof rootjQuery.ready !== "undefined" ?',
            text: '      return typeof rootjQuery.ready !== "undefined" ?',
            type: 'change-old',
          },
          {
            line_number_new: 105,
            line_number_old: null,
            raw: '+      return rootjQuery.ready !== undefined ?',
            text: '      return rootjQuery.ready !== undefined ?',
            type: 'change-new',
          },
          {
            line_number_new: 106,
            line_number_old: 106,
            raw: '         rootjQuery.ready( selector ) :',
            text: '        rootjQuery.ready( selector ) :',
            type: 'unchanged',
          },
          {
            line_number_new: 107,
            line_number_old: 107,
            raw: '         // Execute immediately if ready is not present',
            text: '        // Execute immediately if ready is not present',
            type: 'unchanged',
          },
          {
            line_number_new: 108,
            line_number_old: 108,
            raw: '         selector( jQuery );',
            text: '        selector( jQuery );',
            type: 'unchanged',
          },
        ],
      },
    ],
    cli: 'diff --git a/src/core/init.js b/src/core/init.js',
    index: 'index e49196a..50f310c 100644',
    new: {
      date: '',
      filename: 'src/core/init.js',
      fraction_seconds: '',
      raw: '+++ b/src/core/init.js',
      time: '',
      time_zone: '',
      type: 'new-file',
    },
    old: {
      date: '',
      filename: 'src/core/init.js',
      fraction_seconds: '',
      raw: '--- a/src/core/init.js',
      time: '',
      time_zone: '',
      type: 'old-file',
    },
    type: 'text',
  });
  t.deepEqual(result[1], {
    chunks: [
      {
        header: {
          line_numbers_from_file: {
            count: 6,
            start: 1,
          },
          line_numbers_to_file: {
            count: 5,
            start: 1,
          },
          mode: 'unified',
          raw: '@@ -1,6 +1,5 @@',
        },
        lines: [
          {
            line_number_new: 1,
            line_number_old: 1,
            raw: ' define([',
            text: 'define([',
            type: 'unchanged',
          },
          {
            line_number_new: 2,
            line_number_old: 2,
            raw: '   "./core",',
            text: '  "./core",',
            type: 'unchanged',
          },
          {
            line_number_new: null,
            line_number_old: 3,
            raw: '-  "./var/strundefined",',
            text: '  "./var/strundefined",',
            type: 'change-old',
          },
          {
            line_number_new: 3,
            line_number_old: 4,
            raw: '   "./var/rnotwhite",',
            text: '  "./var/rnotwhite",',
            type: 'unchanged',
          },
          {
            line_number_new: 4,
            line_number_old: 5,
            raw: '   "./var/hasOwn",',
            text: '  "./var/hasOwn",',
            type: 'unchanged',
          },
          {
            line_number_new: 5,
            line_number_old: 6,
            raw: '   "./var/slice",',
            text: '  "./var/slice",',
            type: 'unchanged',
          },
        ],
      },
    ],
    cli: 'diff --git a/src/event.js b/src/event.js',
    index: 'index 7336f4d..6183f70 100644',
    new: {
      date: '',
      filename: 'src/event.js',
      fraction_seconds: '',
      raw: '+++ b/src/event.js',
      time: '',
      time_zone: '',
      type: 'new-file',
    },
    old: {
      date: '',
      filename: 'src/event.js',
      fraction_seconds: '',
      raw: '--- a/src/event.js',
      time: '',
      time_zone: '',
      type: 'old-file',
    },
    type: 'text',
  });
});

test('should parse diffs with copied files', (t) => {
  const diff = 'diff --git a/index.js b/more-index.js\n'
    + 'dissimilarity index 5%\n'
    + 'copy from index.js\n'
    + 'copy to more-index.js\n';

  const parser = new DiffParser();
  const result = parser.parse(diff);
  t.is(1, result.length);
  t.deepEqual(result[0], {
    chunks: [],
    cli: 'diff --git a/index.js b/more-index.js',
    copy_from: 'copy from index.js',
    copy_to: 'copy to more-index.js',
    dissimilarity_index: 'dissimilarity index 5%',
    type: 'text',
  });
});

test('should parse diffs with moved files', (t) => {
  const diff = 'diff --git a/more-index.js b/other-index.js\n'
    + 'similarity index 86%\n'
    + 'rename from more-index.js\n'
    + 'rename to other-index.js\n';

  const parser = new DiffParser();
  const result = parser.parse(diff);
  t.is(1, result.length);
  t.deepEqual(result[0], {
    chunks: [],
    cli: 'diff --git a/more-index.js b/other-index.js',
    rename_to: 'rename to other-index.js',
    similarity_index: 'similarity index 86%',
    type: 'text',
  });
});

test('should parse unified non git diff and strip timestamps off the headers', (t) => {
  // 2 hours ahead of GMT
  let diff = '--- a/sample.js  2016-10-25 11:37:14.000000000 +0200\n'
      + '+++ b/sample.js  2016-10-25 11:37:14.000000000 +0200\n'
      + '@@ -1 +1,2 @@\n'
      + '-test\n'
      + '+test1r\n'
      + '+test2r\n';
  const parser = new DiffParser();
  let result = parser.parse(diff);
  t.is(1, result.length);
  t.deepEqual(result[0], {
    chunks: [
      {
        header: {
          line_numbers_from_file: {
            count: 0,
            start: 1,
          },
          line_numbers_to_file: {
            count: 2,
            start: 1,
          },
          mode: 'unified',
          raw: '@@ -1 +1,2 @@',
        },
        lines: [
          {
            line_number_new: null,
            line_number_old: 1,
            raw: '-test',
            text: 'test',
            type: 'change-old',
          },
          {
            line_number_new: 1,
            line_number_old: null,
            raw: '+test1r',
            text: 'test1r',
            type: 'change-new',
          },
          {
            line_number_new: 2,
            line_number_old: null,
            raw: '+test2r',
            text: 'test2r',
            type: 'change-new',
          },
        ],
      },
    ],
    cli: '',
    new: {
      date: '2016-10-25',
      filename: 'sample.js',
      fraction_seconds: '000000000',
      raw: '+++ b/sample.js  2016-10-25 11:37:14.000000000 +0200',
      time: '11:37:14',
      time_zone: '+0200',
      type: 'new-file',
    },
    old: {
      date: '2016-10-25',
      filename: 'sample.js',
      fraction_seconds: '000000000',
      raw: '--- a/sample.js  2016-10-25 11:37:14.000000000 +0200',
      time: '11:37:14',
      time_zone: '+0200',
      type: 'old-file',
    },
    type: 'text',
  });

  // 2 hours behind GMT
  diff = '--- a/sample.js 2016-10-25 11:37:14.000000000 -0200\n'
      + '+++ b/sample.js  2016-10-25 11:37:14.000000000 -0200\n'
      + '@@ -1 +1,2 @@\n'
      + '-test\n'
      + '+test1r\n'
      + '+test2r\n';
  result = parser.parse(diff);
  t.is(1, result.length);
  t.deepEqual(result[0], {
    chunks: [
      {
        header: {
          line_numbers_from_file: {
            count: 0,
            start: 1,
          },
          line_numbers_to_file: {
            count: 2,
            start: 1,
          },
          mode: 'unified',
          raw: '@@ -1 +1,2 @@',
        },
        lines: [
          {
            line_number_new: null,
            line_number_old: 1,
            raw: '-test',
            text: 'test',
            type: 'change-old',
          },
          {
            line_number_new: 1,
            line_number_old: null,
            raw: '+test1r',
            text: 'test1r',
            type: 'change-new',
          },
          {
            line_number_new: 2,
            line_number_old: null,
            raw: '+test2r',
            text: 'test2r',
            type: 'change-new',
          },
        ],
      },
    ],
    cli: '',
    new: {
      date: '2016-10-25',
      filename: 'sample.js',
      fraction_seconds: '000000000',
      raw: '+++ b/sample.js  2016-10-25 11:37:14.000000000 -0200',
      time: '11:37:14',
      time_zone: '-0200',
      type: 'new-file',
    },
    old: {
      date: '2016-10-25',
      filename: 'sample.js',
      fraction_seconds: '000000000',
      raw: '--- a/sample.js 2016-10-25 11:37:14.000000000 -0200',
      time: '11:37:14',
      time_zone: '-0200',
      type: 'old-file',
    },
    type: 'text',
  });
});

test('should parse unified non git diff', (t) => {
  const diff = '--- a/sample.js\n'
    + '+++ b/sample.js\n'
    + '@@ -1 +1,2 @@\n'
    + '-test\n'
    + '+test1r\n'
    + '+test2r\n';

  const parser = new DiffParser();
  const result = parser.parse(diff);
  t.is(1, result.length);
  t.deepEqual(result[0], {
    chunks: [
      {
        header: {
          line_numbers_from_file: {
            count: 0,
            start: 1,
          },
          line_numbers_to_file: {
            count: 2,
            start: 1,
          },
          mode: 'unified',
          raw: '@@ -1 +1,2 @@',
        },
        lines: [
          {
            line_number_new: null,
            line_number_old: 1,
            raw: '-test',
            text: 'test',
            type: 'change-old',
          },
          {
            line_number_new: 1,
            line_number_old: null,
            raw: '+test1r',
            text: 'test1r',
            type: 'change-new',
          },
          {
            line_number_new: 2,
            line_number_old: null,
            raw: '+test2r',
            text: 'test2r',
            type: 'change-new',
          },
        ],
      },
    ],
    cli: '',
    new: {
      date: '',
      filename: 'sample.js',
      fraction_seconds: '',
      raw: '+++ b/sample.js',
      time: '',
      time_zone: '',
      type: 'new-file',
    },
    old: {
      date: '',
      filename: 'sample.js',
      fraction_seconds: '',
      raw: '--- a/sample.js',
      time: '',
      time_zone: '',
      type: 'old-file',
    },
    type: 'text',
  });
});

test('should parse unified diff with multiple hunks and files', (t) => {
  const diff = '--- sample.js\n'
    + '+++ sample.js\n'
    + '@@ -1 +1,2 @@\n'
    + '-test\n'
    + '@@ -10 +20,2 @@\n'
    + '+test\n'
    + '--- sample1.js\n'
    + '+++ sample1.js\n'
    + '@@ -1 +1,2 @@\n'
    + '+test1';

  const parser = new DiffParser();
  const result = parser.parse(diff);
  t.is(2, result.length);
  t.deepEqual(result[0], {
    chunks: [
      {
        header: {
          line_numbers_from_file: {
            count: 0,
            start: 1,
          },
          line_numbers_to_file: {
            count: 2,
            start: 1,
          },
          mode: 'unified',
          raw: '@@ -1 +1,2 @@',
        },
        lines: [
          {
            line_number_new: null,
            line_number_old: 1,
            raw: '-test',
            text: 'test',
            type: 'change-old',
          },
        ],
      },
      {
        header: {
          line_numbers_from_file: {
            count: 0,
            start: 10,
          },
          line_numbers_to_file: {
            count: 2,
            start: 20,
          },
          mode: 'unified',
          raw: '@@ -10 +20,2 @@',
        },
        lines: [
          {
            line_number_new: 20,
            line_number_old: null,
            raw: '+test',
            text: 'test',
            type: 'change-new',
          },
        ],
      },
    ],
    cli: '',
    new: {
      date: '',
      filename: 'sample.js',
      fraction_seconds: '',
      raw: '+++ sample.js',
      time: '',
      time_zone: '',
      type: 'new-file',
    },
    old: {
      date: '',
      filename: 'sample.js',
      fraction_seconds: '',
      raw: '--- sample.js',
      time: '',
      time_zone: '',
      type: 'old-file',
    },
    type: 'text',
  });
  t.deepEqual(result[1], {
    chunks: [
      {
        header: {
          line_numbers_from_file: {
            count: 0,
            start: 1,
          },
          line_numbers_to_file: {
            count: 2,
            start: 1,
          },
          mode: 'unified',
          raw: '@@ -1 +1,2 @@',
        },
        lines: [
          {
            line_number_new: 1,
            line_number_old: null,
            raw: '+test1',
            text: 'test1',
            type: 'change-new',
          },
        ],
      },
    ],
    cli: '',
    new: {
      date: '',
      filename: 'sample1.js',
      fraction_seconds: '',
      raw: '+++ sample1.js',
      time: '',
      time_zone: '',
      type: 'new-file',
    },
    old: {
      date: '',
      filename: 'sample1.js',
      fraction_seconds: '',
      raw: '--- sample1.js',
      time: '',
      time_zone: '',
      type: 'old-file',
    },
    type: 'text',
  });
});

test('should parse binary file diff', (t) => {
  const diff = 'diff --git a/last-changes-config.png b/last-changes-config.png\n'
    + 'index 322248b..56fc1f2 100644\n'
    + '--- a/last-changes-config.png\n'
    + '+++ b/last-changes-config.png\n'
    + 'Binary files differ';

  const parser = new DiffParser();
  const result = parser.parse(diff);
  t.is(1, result.length);
  t.deepEqual(result[0], {
    chunks: [],
    cli: 'diff --git a/last-changes-config.png b/last-changes-config.png',
    index: 'index 322248b..56fc1f2 100644',
    new: {
      date: '',
      filename: 'last-changes-config.png',
      fraction_seconds: '',
      raw: '+++ b/last-changes-config.png',
      time: '',
      time_zone: '',
      type: 'new-file',
    },
    old: {
      date: '',
      filename: 'last-changes-config.png',
      fraction_seconds: '',
      raw: '--- a/last-changes-config.png',
      time: '',
      time_zone: '',
      type: 'old-file',
    },
    text: 'Binary files differ',
    type: 'binary',
  });
});

test('should parse diff with --find-renames', (t) => {
  const diff = 'diff --git a/src/test-bar.js b/src/test-baz.js\n'
    + 'similarity index 98%\n'
    + 'rename from src/test-bar.js\n'
    + 'rename to src/test-baz.js\n'
    + 'index e01513b..f14a870 100644\n'
    + '--- a/src/test-bar.js\n'
    + '+++ b/src/test-baz.js\n'
    + '@@ -1,4 +1,32 @@\n'
    + ' function foo() {\n'
    + '-var bar = "Whoops!";\n'
    + '+var baz = "Whoops!";\n'
    + ' }\n'
    + ' ';

  const parser = new DiffParser();
  const result = parser.parse(diff);
  t.is(1, result.length);
  t.deepEqual(result[0], {
    chunks: [
      {
        header: {
          line_numbers_from_file: {
            count: 4,
            start: 1,
          },
          line_numbers_to_file: {
            count: 32,
            start: 1,
          },
          mode: 'unified',
          raw: '@@ -1,4 +1,32 @@',
        },
        lines: [
          {
            line_number_new: 1,
            line_number_old: 1,
            raw: ' function foo() {',
            text: 'function foo() {',
            type: 'unchanged',
          },
          {
            line_number_new: null,
            line_number_old: 2,
            raw: '-var bar = "Whoops!";',
            text: 'var bar = "Whoops!";',
            type: 'change-old',
          },
          {
            line_number_new: 2,
            line_number_old: null,
            raw: '+var baz = "Whoops!";',
            text: 'var baz = "Whoops!";',
            type: 'change-new',
          },
          {
            line_number_new: 3,
            line_number_old: 3,
            raw: ' }',
            text: '}',
            type: 'unchanged',
          },
          {
            line_number_new: 4,
            line_number_old: 4,
            raw: ' ',
            text: '',
            type: 'unchanged',
          },
        ],
      },
    ],
    cli: 'diff --git a/src/test-bar.js b/src/test-baz.js',
    index: 'index e01513b..f14a870 100644',
    new: {
      date: '',
      filename: 'src/test-baz.js',
      fraction_seconds: '',
      raw: '+++ b/src/test-baz.js',
      time: '',
      time_zone: '',
      type: 'new-file',
    },
    old: {
      date: '',
      filename: 'src/test-bar.js',
      fraction_seconds: '',
      raw: '--- a/src/test-bar.js',
      time: '',
      time_zone: '',
      type: 'old-file',
    },
    rename_to: 'rename to src/test-baz.js',
    similarity_index: 'similarity index 98%',
    type: 'text',
  });
});

test('should parse diff with prefix', (t) => {
  const diff = 'diff --git "\tTest.scala" "\tScalaTest.scala"\n'
    + 'similarity index 88%\n'
    + 'rename from Test.scala\n'
    + 'rename to ScalaTest.scala\n'
    + 'index 7d1f9bf..8b13271 100644\n'
    + '--- "\tTest.scala"\n'
    + '+++ "\tScalaTest.scala"\n'
    + '@@ -1,6 +1,8 @@\n'
    + ' class Test {\n'
    + ' \n'
    + '   def method1 = ???\n'
    + '+\n'
    + '+  def method2 = ???\n'
    + ' \n'
    + '   def myMethod = ???\n'
    + ' \n'
    + '@@ -10,7 +12,6 @@ class Test {\n'
    + ' \n'
    + '   def + = ???\n'
    + ' \n'
    + '-  def |> = ???\n'
    + ' \n'
    + ' }\n'
    + ' \n'
    + 'diff --git "\ttardis.png" "\ttardis.png"\n'
    + 'new file mode 100644\n'
    + 'index 0000000..d503a29\n'
    + 'Binary files /dev/null and "\ttardis.png" differ\n'
    + 'diff --git a/src/test-bar.js b/src/test-baz.js\n'
    + 'similarity index 98%\n'
    + 'rename from src/test-bar.js\n'
    + 'rename to src/test-baz.js\n'
    + 'index e01513b..f14a870 100644\n'
    + '--- a/src/test-bar.js\n'
    + '+++ b/src/test-baz.js\n'
    + '@@ -1,4 +1,32 @@\n'
    + ' function foo() {\n'
    + '-var bar = "Whoops!";\n'
    + '+var baz = "Whoops!";\n'
    + ' }\n'
    + ' ';

  const parser = new DiffParser();
  const result = parser.parse(diff);
  t.is(3, result.length);
  t.deepEqual(result[0], {
    chunks: [
      {
        header: {
          line_numbers_from_file: {
            count: 6,
            start: 1,
          },
          line_numbers_to_file: {
            count: 8,
            start: 1,
          },
          mode: 'unified',
          raw: '@@ -1,6 +1,8 @@',
        },
        lines: [
          {
            line_number_new: 1,
            line_number_old: 1,
            raw: ' class Test {',
            text: 'class Test {',
            type: 'unchanged',
          },
          {
            line_number_new: 2,
            line_number_old: 2,
            raw: ' ',
            text: '',
            type: 'unchanged',
          },
          {
            line_number_new: 3,
            line_number_old: 3,
            raw: '   def method1 = ???',
            text: '  def method1 = ???',
            type: 'unchanged',
          },
          {
            line_number_new: 4,
            line_number_old: null,
            raw: '+',
            text: '',
            type: 'change-new',
          },
          {
            line_number_new: 5,
            line_number_old: null,
            raw: '+  def method2 = ???',
            text: '  def method2 = ???',
            type: 'change-new',
          },
          {
            line_number_new: 6,
            line_number_old: 4,
            raw: ' ',
            text: '',
            type: 'unchanged',
          },
          {
            line_number_new: 7,
            line_number_old: 5,
            raw: '   def myMethod = ???',
            text: '  def myMethod = ???',
            type: 'unchanged',
          },
          {
            line_number_new: 8,
            line_number_old: 6,
            raw: ' ',
            text: '',
            type: 'unchanged',
          },
        ],
      },
      {
        header: {
          line_numbers_from_file: {
            count: 7,
            start: 10,
          },
          line_numbers_to_file: {
            count: 6,
            start: 12,
          },
          mode: 'unified',
          raw: '@@ -10,7 +12,6 @@',
        },
        lines: [
          {
            line_number_new: 12,
            line_number_old: 10,
            raw: ' class Test {',
            text: 'class Test {',
            type: 'unchanged',
          },
          {
            line_number_new: 13,
            line_number_old: 11,
            raw: ' ',
            text: '',
            type: 'unchanged',
          },
          {
            line_number_new: 14,
            line_number_old: 12,
            raw: '   def + = ???',
            text: '  def + = ???',
            type: 'unchanged',
          },
          {
            line_number_new: 15,
            line_number_old: 13,
            raw: ' ',
            text: '',
            type: 'unchanged',
          },
          {
            line_number_new: null,
            line_number_old: 14,
            raw: '-  def |> = ???',
            text: '  def |> = ???',
            type: 'change-old',
          },
          {
            line_number_new: 16,
            line_number_old: 15,
            raw: ' ',
            text: '',
            type: 'unchanged',
          },
          {
            line_number_new: 17,
            line_number_old: 16,
            raw: ' }',
            text: '}',
            type: 'unchanged',
          },
          {
            line_number_new: 18,
            line_number_old: 17,
            raw: ' ',
            text: '',
            type: 'unchanged',
          },
        ],
      },
    ],
    cli: 'diff --git "\tTest.scala" "\tScalaTest.scala"',
    index: 'index 7d1f9bf..8b13271 100644',
    new: {
      date: '',
      filename: 'ScalaTest.scala',
      fraction_seconds: '',
      raw: '+++ "\tScalaTest.scala"',
      time: '',
      time_zone: '',
      type: 'new-file',
    },
    old: {
      date: '',
      filename: 'Test.scala',
      fraction_seconds: '',
      raw: '--- "\tTest.scala"',
      time: '',
      time_zone: '',
      type: 'old-file',
    },
    rename_to: 'rename to ScalaTest.scala',
    similarity_index: 'similarity index 88%',
    type: 'text',
  });
  t.deepEqual(result[1], {
    chunks: [],
    cli: 'diff --git "\ttardis.png" "\ttardis.png"',
    index: 'index 0000000..d503a29',
    new_file: 'new file mode 100644',
    text: 'Binary files /dev/null and "\ttardis.png" differ',
    type: 'binary',
  });
  t.deepEqual(result[2], {
    chunks: [
      {
        header: {
          line_numbers_from_file: {
            count: 4,
            start: 1,
          },
          line_numbers_to_file: {
            count: 32,
            start: 1,
          },
          mode: 'unified',
          raw: '@@ -1,4 +1,32 @@',
        },
        lines: [
          {
            line_number_new: 1,
            line_number_old: 1,
            raw: ' function foo() {',
            text: 'function foo() {',
            type: 'unchanged',
          },
          {
            line_number_new: null,
            line_number_old: 2,
            raw: '-var bar = "Whoops!";',
            text: 'var bar = "Whoops!";',
            type: 'change-old',
          },
          {
            line_number_new: 2,
            line_number_old: null,
            raw: '+var baz = "Whoops!";',
            text: 'var baz = "Whoops!";',
            type: 'change-new',
          },
          {
            line_number_new: 3,
            line_number_old: 3,
            raw: ' }',
            text: '}',
            type: 'unchanged',
          },
          {
            line_number_new: 4,
            line_number_old: 4,
            raw: ' ',
            text: '',
            type: 'unchanged',
          },
        ],
      },
    ],
    cli: 'diff --git a/src/test-bar.js b/src/test-baz.js',
    index: 'index e01513b..f14a870 100644',
    new: {
      date: '',
      filename: 'src/test-baz.js',
      fraction_seconds: '',
      raw: '+++ b/src/test-baz.js',
      time: '',
      time_zone: '',
      type: 'new-file',
    },
    old: {
      date: '',
      filename: 'src/test-bar.js',
      fraction_seconds: '',
      raw: '--- a/src/test-bar.js',
      time: '',
      time_zone: '',
      type: 'old-file',
    },
    rename_to: 'rename to src/test-baz.js',
    similarity_index: 'similarity index 98%',
    type: 'text',
  });
});

test('should parse binary with content', (t) => {
  const diff = 'diff --git a/favicon.png b/favicon.png\n'
    + 'deleted file mode 100644\n'
    + 'index 2a9d516a5647205d7be510dd0dff93a3663eff6f..0000000000000000000000000000000000000000\n'
    + 'GIT binary patch\n'
    + 'literal 0\n'
    + 'HcmV?d00001\n'
    + '\n'
    + 'literal 471\n'
    + 'zcmeAS@N?(olHy`uVBq!ia0vp^0wB!61|;P_|4#%`EX7WqAsj$Z!;#Vf<Z~8yL>4nJ\n'
    + 'za0`Jj<E6WGe}IBwC9V-A&PAz-C7Jno3L%-fsSJk3`UaNzMkcGzh!g=;$beJ?=ckpF\n'
    + 'zCl;kLIHu$$r7E~(7NwTw7iAYKI0u`(*t4mJfq_xq)5S5wqIc=!hrWj$cv|<b{x!c(\n'
    + 'z;3r#y;31Y&=1q>qPVOAS4ANVKzqmCp=Cty@U^(7zk!jHsvT~YI{F^=Ex6g|gox78w\n'
    + 'z+Sn2Du3GS9U7qU`1*NYYlJi3u-!<?H-eky}wyIIL;8VU@wCDrb0``&v(jQ*DWSR4K\n'
    + 'zPq(3;isEyho{emNa=%%!jDPE`l3u;5d=q=<+v8kO-=C`*G#t-*AiE-D>-_B#8k9H0\n'
    + 'zGl{FnZs<2$wz5^=Q2h-1XI^s{LQL1#T4epqNPC%Orl(tD_@!*EY++~^Lt2<2&!&%=\n'
    + 'z`m>(TYj6uS7jDdt=eH>iOyQg(QMR<-Fw8)Dk^ZG)XQTuzEgl{`GpS?Cfq9818R9~=\n'
    + 'z{&h9@9n8F^?|qusoPy{k#%tVHzu7H$t26CR`BJZk*Ixf&u36WuS=?6m2^ho-p00i_\n'
    + 'I>zopr0Nz-&lmGw#\n'
    + 'diff --git a/src/test-bar.js b/src/test-baz.js\n'
    + 'similarity index 98%\n'
    + 'rename from src/test-bar.js\n'
    + 'rename to src/test-baz.js\n'
    + 'index e01513b..f14a870 100644\n'
    + '--- a/src/test-bar.js\n'
    + '+++ b/src/test-baz.js\n'
    + '@@ -1,4 +1,32 @@\n'
    + ' function foo() {\n'
    + '-var bar = "Whoops!";\n'
    + '+var baz = "Whoops!";\n'
    + ' }\n'
    + ' ';

  const parser = new DiffParser();
  const result = parser.parse(diff);
  t.is(2, result.length);
  t.deepEqual(result[0], {
    chunks: [],
    cli: 'diff --git a/favicon.png b/favicon.png',
    deleted: 'deleted file mode 100644',
    git_binary_patch: 'GIT binary patch',
    git_binary_patch_literals: [
      {
        header: 'literal 0',
        lines: [
          'HcmV?d00001',
        ],
      },
      {
        header: 'literal 471',
        lines: [
          'zcmeAS@N?(olHy`uVBq!ia0vp^0wB!61|;P_|4#%`EX7WqAsj$Z!;#Vf<Z~8yL>4nJ',
          'za0`Jj<E6WGe}IBwC9V-A&PAz-C7Jno3L%-fsSJk3`UaNzMkcGzh!g=;$beJ?=ckpF',
          'zCl;kLIHu$$r7E~(7NwTw7iAYKI0u`(*t4mJfq_xq)5S5wqIc=!hrWj$cv|<b{x!c(',
          'z;3r#y;31Y&=1q>qPVOAS4ANVKzqmCp=Cty@U^(7zk!jHsvT~YI{F^=Ex6g|gox78w',
          'z+Sn2Du3GS9U7qU`1*NYYlJi3u-!<?H-eky}wyIIL;8VU@wCDrb0``&v(jQ*DWSR4K',
          'zPq(3;isEyho{emNa=%%!jDPE`l3u;5d=q=<+v8kO-=C`*G#t-*AiE-D>-_B#8k9H0',
          'zGl{FnZs<2$wz5^=Q2h-1XI^s{LQL1#T4epqNPC%Orl(tD_@!*EY++~^Lt2<2&!&%=',
          'z`m>(TYj6uS7jDdt=eH>iOyQg(QMR<-Fw8)Dk^ZG)XQTuzEgl{`GpS?Cfq9818R9~=',
          'z{&h9@9n8F^?|qusoPy{k#%tVHzu7H$t26CR`BJZk*Ixf&u36WuS=?6m2^ho-p00i_',
          'I>zopr0Nz-&lmGw#',
        ],
      },
    ],
    index: 'index 2a9d516a5647205d7be510dd0dff93a3663eff6f..0000000000000000000000000000000000000000',
    type: 'binary',
  });
  t.deepEqual(result[1], {
    chunks: [
      {
        header: {
          line_numbers_from_file: {
            count: 4,
            start: 1,
          },
          line_numbers_to_file: {
            count: 32,
            start: 1,
          },
          mode: 'unified',
          raw: '@@ -1,4 +1,32 @@',
        },
        lines: [
          {
            line_number_new: 1,
            line_number_old: 1,
            raw: ' function foo() {',
            text: 'function foo() {',
            type: 'unchanged',
          },
          {
            line_number_new: null,
            line_number_old: 2,
            raw: '-var bar = "Whoops!";',
            text: 'var bar = "Whoops!";',
            type: 'change-old',
          },
          {
            line_number_new: 2,
            line_number_old: null,
            raw: '+var baz = "Whoops!";',
            text: 'var baz = "Whoops!";',
            type: 'change-new',
          },
          {
            line_number_new: 3,
            line_number_old: 3,
            raw: ' }',
            text: '}',
            type: 'unchanged',
          },
          {
            line_number_new: 4,
            line_number_old: 4,
            raw: ' ',
            text: '',
            type: 'unchanged',
          },
        ],
      },
    ],
    cli: 'diff --git a/src/test-bar.js b/src/test-baz.js',
    index: 'index e01513b..f14a870 100644',
    new: {
      date: '',
      filename: 'src/test-baz.js',
      fraction_seconds: '',
      raw: '+++ b/src/test-baz.js',
      time: '',
      time_zone: '',
      type: 'new-file',
    },
    old: {
      date: '',
      filename: 'src/test-bar.js',
      fraction_seconds: '',
      raw: '--- a/src/test-bar.js',
      time: '',
      time_zone: '',
      type: 'old-file',
    },
    rename_to: 'rename to src/test-baz.js',
    similarity_index: 'similarity index 98%',
    type: 'text',
  });
});

test('should parse diff without proper hunk headers', (t) => {
  const diff = '--- sample.js\n'
    + '+++ sample.js\n'
    + '@@ @@\n'
    + ' test';

  const parser = new DiffParser();
  const result = parser.parse(diff);
  t.is(1, result.length);
  t.deepEqual(result[0], {
    chunks: [
      {
        header: {
          error: 'invalid',
          line_numbers_from_file: {
            count: 0,
            start: 1,
          },
          line_numbers_to_file: {
            count: 0,
            start: 1,
          },
          mode: 'unified',
          raw: '@@ @@',
        },
        lines: [
          {
            line_number_new: 1,
            line_number_old: 1,
            raw: ' test',
            text: 'test',
            type: 'unchanged',
          },
        ],
      },
    ],
    cli: '',
    new: {
      date: '',
      filename: 'sample.js',
      fraction_seconds: '',
      raw: '+++ sample.js',
      time: '',
      time_zone: '',
      type: 'new-file',
    },
    old: {
      date: '',
      filename: 'sample.js',
      fraction_seconds: '',
      raw: '--- sample.js',
      time: '',
      time_zone: '',
      type: 'old-file',
    },
    type: 'text',
  });
});

test('should parse diff with --- and +++ in the context lines', (t) => {
  const diff = '--- trick-lines.old.log	2019-10-28 23:11:08.000000000 -0700\n'
  + '+++ trick-lines.new.log	2019-10-28 23:11:18.000000000 -0700\n'
  + '@@ -1,5 +1,5 @@\n'
  + ' test\n'
  + ' \n'
  + '-- 1\n'
  + '--- 1\n'
  + '---- 1\n'
  + '++ 2\n'
  + '+++ 2\n'
  + '++++ 2\n';

  const parser = new DiffParser();
  const result = parser.parse(diff);
  t.is(1, result.length);
  t.deepEqual(result[0], {
    chunks: [
      {
        header: {
          line_numbers_from_file: {
            count: 5,
            start: 1,
          },
          line_numbers_to_file: {
            count: 5,
            start: 1,
          },
          mode: 'unified',
          raw: '@@ -1,5 +1,5 @@',
        },
        lines: [
          {
            line_number_new: 1,
            line_number_old: 1,
            raw: ' test',
            text: 'test',
            type: 'unchanged',
          },
          {
            line_number_new: 2,
            line_number_old: 2,
            raw: ' ',
            text: '',
            type: 'unchanged',
          },
          {
            line_number_new: null,
            line_number_old: 3,
            raw: '-- 1',
            text: '- 1',
            type: 'change-old',
          },
          {
            line_number_new: null,
            line_number_old: 4,
            raw: '---- 1',
            text: '--- 1',
            type: 'change-old',
          },
          {
            line_number_new: 3,
            line_number_old: null,
            raw: '++ 2',
            text: '+ 2',
            type: 'change-new',
          },
          {
            line_number_new: 4,
            line_number_old: null,
            raw: '++++ 2',
            text: '+++ 2',
            type: 'change-new',
          },
        ],
      },
    ],
    cli: '',
    new: {
      date: '2019-10-28',
      filename: 'trick-lines.new.log',
      fraction_seconds: '000000000',
      raw: '+++ trick-lines.new.log\t2019-10-28 23:11:18.000000000 -0700',
      time: '23:11:18',
      time_zone: '-0700',
      type: 'new-file',
    },
    old: {
      date: '2019-10-28',
      filename: 'trick-lines.old.log',
      fraction_seconds: '000000000',
      raw: '--- trick-lines.old.log\t2019-10-28 23:11:08.000000000 -0700',
      time: '23:11:08',
      time_zone: '-0700',
      type: 'old-file',
    },
    type: 'text',
  });
});

test('should parse diffs correct line numbers', (t) => {
  const diff = 'diff --git a/sample b/sample\n'
    + 'index 0000001..0ddf2ba\n'
    + '--- a/sample\n'
    + '+++ b/sample\n'
    + '@@ -1 +1,2 @@\n'
    + '-test\n'
    + '+test1r\n';

  const parser = new DiffParser();
  const result = parser.parse(diff);
  t.is(1, result.length);
  t.deepEqual(result[0], {
    chunks: [
      {
        header: {
          line_numbers_from_file: {
            count: 0,
            start: 1,
          },
          line_numbers_to_file: {
            count: 2,
            start: 1,
          },
          mode: 'unified',
          raw: '@@ -1 +1,2 @@',
        },
        lines: [
          {
            line_number_new: null,
            line_number_old: 1,
            raw: '-test',
            text: 'test',
            type: 'change-old',
          },
          {
            line_number_new: 1,
            line_number_old: null,
            raw: '+test1r',
            text: 'test1r',
            type: 'change-new',
          },
        ],
      },
    ],
    cli: 'diff --git a/sample b/sample',
    index: 'index 0000001..0ddf2ba',
    new: {
      date: '',
      filename: 'sample',
      fraction_seconds: '',
      raw: '+++ b/sample',
      time: '',
      time_zone: '',
      type: 'new-file',
    },
    old: {
      date: '',
      filename: 'sample',
      fraction_seconds: '',
      raw: '--- a/sample',
      time: '',
      time_zone: '',
      type: 'old-file',
    },
    type: 'text',
  });
});

test('should parse combined diff', (t) => {
  const diff = 'diff --combined describe.c\n'
    + 'index fabadb8,cc95eb0..4866510\n'
    + '--- a/describe.c\n'
    + '+++ b/describe.c\n'
    + '@@@ -98,20 -98,12 +98,20 @@@\n'
    + '   return (a_date > b_date) ? -1 : (a_date == b_date) ? 0 : 1;\n'
    + '  }\n'
    + '  \n'
    + '- static void describe(char *arg)\n'
    + ' -static void describe(struct commit *cmit, int last_one)\n'
    + '++static void describe(char *arg, int last_one)\n'
    + '  {\n'
    + ' + unsigned char sha1[20];\n'
    + ' + struct commit *cmit;\n'
    + '   struct commit_list *list;\n'
    + '   static int initialized = 0;\n'
    + '   struct commit_name *n;\n'
    + '  \n'
    + ' + if (get_sha1(arg, sha1) < 0)\n'
    + ' +     usage(describe_usage);\n'
    + ' + cmit = lookup_commit_reference(sha1);\n'
    + ' + if (!cmit)\n'
    + ' +     usage(describe_usage);\n'
    + ' +\n'
    + '   if (!initialized) {\n'
    + '       initialized = 1;\n'
    + '       for_each_ref(get_name);\n';

  const parser = new DiffParser();
  const result = parser.parse(diff);
  t.is(1, result.length);
  t.deepEqual(result[0], {
    chunks: [
      {
        header: {
          line_numbers_from_file_a: {
            count: 20,
            start: 98,
          },
          line_numbers_from_file_b: {
            count: 12,
            start: 98,
          },
          line_numbers_to_file: {
            count: 20,
            start: 98,
          },
          mode: 'combined',
          raw: '@@@ -98,20 -98,12 +98,20 @@@',
        },
        lines: [
          {
            file: ['a', 'b'],
            line_number_new: 98,
            line_number_old: 98,
            raw: '   return (a_date > b_date) ? -1 : (a_date == b_date) ? 0 : 1;',
            text: ' return (a_date > b_date) ? -1 : (a_date == b_date) ? 0 : 1;',
            type: 'unchanged',
          },
          {
            file: ['a', 'b'],
            line_number_new: 99,
            line_number_old: 99,
            raw: '  }',
            text: '}',
            type: 'unchanged',
          },
          {
            file: ['a', 'b'],
            line_number_new: 100,
            line_number_old: 100,
            raw: '  ',
            text: '',
            type: 'unchanged',
          },
          {
            file: ['a'],
            line_number_new: 101,
            line_number_old: 101,
            raw: '- static void describe(char *arg)',
            text: 'static void describe(char *arg)',
            type: 'change-old',
          },
          {
            file: ['b'],
            line_number_new: 102,
            line_number_old: 102,
            raw: ' -static void describe(struct commit *cmit, int last_one)',
            text: 'static void describe(struct commit *cmit, int last_one)',
            type: 'change-old',
          },
          {
            file: ['a', 'b'],
            line_number_new: 103,
            line_number_old: null,
            raw: '++static void describe(char *arg, int last_one)',
            text: 'static void describe(char *arg, int last_one)',
            type: 'change-both-add',
          },
          {
            file: ['a', 'b'],
            line_number_new: 104,
            line_number_old: 103,
            raw: '  {',
            text: '{',
            type: 'unchanged',
          },
          {
            file: ['b'],
            line_number_new: 105,
            line_number_old: 104,
            raw: ' + unsigned char sha1[20];',
            text: ' unsigned char sha1[20];',
            type: 'change-new',
          },
          {
            file: ['b'],
            line_number_new: 106,
            line_number_old: 105,
            raw: ' + struct commit *cmit;',
            text: ' struct commit *cmit;',
            type: 'change-new',
          },
          {
            file: ['a', 'b'],
            line_number_new: 107,
            line_number_old: 106,
            raw: '   struct commit_list *list;',
            text: ' struct commit_list *list;',
            type: 'unchanged',
          },
          {
            file: ['a', 'b'],
            line_number_new: 108,
            line_number_old: 107,
            raw: '   static int initialized = 0;',
            text: ' static int initialized = 0;',
            type: 'unchanged',
          },
          {
            file: ['a', 'b'],
            line_number_new: 109,
            line_number_old: 108,
            raw: '   struct commit_name *n;',
            text: ' struct commit_name *n;',
            type: 'unchanged',
          },
          {
            file: ['a', 'b'],
            line_number_new: 110,
            line_number_old: 109,
            raw: '  ',
            text: '',
            type: 'unchanged',
          },
          {
            file: ['b'],
            line_number_new: 111,
            line_number_old: 110,
            raw: ' + if (get_sha1(arg, sha1) < 0)',
            text: ' if (get_sha1(arg, sha1) < 0)',
            type: 'change-new',
          },
          {
            file: ['b'],
            line_number_new: 112,
            line_number_old: 111,
            raw: ' +     usage(describe_usage);',
            text: '     usage(describe_usage);',
            type: 'change-new',
          },
          {
            file: ['b'],
            line_number_new: 113,
            line_number_old: 112,
            raw: ' + cmit = lookup_commit_reference(sha1);',
            text: ' cmit = lookup_commit_reference(sha1);',
            type: 'change-new',
          },
          {
            file: ['b'],
            line_number_new: 114,
            line_number_old: 113,
            raw: ' + if (!cmit)',
            text: ' if (!cmit)',
            type: 'change-new',
          },
          {
            file: ['b'],
            line_number_new: 115,
            line_number_old: 114,
            raw: ' +     usage(describe_usage);',
            text: '     usage(describe_usage);',
            type: 'change-new',
          },
          {
            file: ['b'],
            line_number_new: 116,
            line_number_old: 115,
            raw: ' +',
            text: '',
            type: 'change-new',
          },
          {
            file: ['a', 'b'],
            line_number_new: 117,
            line_number_old: 116,
            raw: '   if (!initialized) {',
            text: ' if (!initialized) {',
            type: 'unchanged',
          },
          {
            file: ['a', 'b'],
            line_number_new: 118,
            line_number_old: 117,
            raw: '       initialized = 1;',
            text: '     initialized = 1;',
            type: 'unchanged',
          },
          {
            file: ['a', 'b'],
            line_number_new: 119,
            line_number_old: 118,
            raw: '       for_each_ref(get_name);',
            text: '     for_each_ref(get_name);',
            type: 'unchanged',
          },
        ],
      },
    ],
    cli: 'diff --combined describe.c',
    index: 'index fabadb8,cc95eb0..4866510',
    new: {
      date: '',
      filename: 'describe.c',
      fraction_seconds: '',
      raw: '+++ b/describe.c',
      time: '',
      time_zone: '',
      type: 'new-file',
    },
    old: {
      date: '',
      filename: 'describe.c',
      fraction_seconds: '',
      raw: '--- a/describe.c',
      time: '',
      time_zone: '',
      type: 'old-file',
    },
    type: 'text',
  });
});

test('should parse combined diff with sloppy header', (t) => {
  const diff = 'diff --combined describe.c\n'
    + 'index fabadb8,cc95eb0..4866510\n'
    + '--- a/describe.c\n'
    + '+++ b/describe.c\n'
    + '@@@ -98,20 -98,12 +98,20 @@@   return (a_date > b_date) ? -1 : (a_date == b_date) ? 0 : 1;\n'
    + '  }\n'
    + '  \n'
    + '- static void describe(char *arg)\n'
    + ' -static void describe(struct commit *cmit, int last_one)\n'
    + '++static void describe(char *arg, int last_one)\n'
    + '  {\n'
    + ' + unsigned char sha1[20];\n'
    + ' + struct commit *cmit;\n'
    + '   struct commit_list *list;\n'
    + '   static int initialized = 0;\n'
    + '   struct commit_name *n;\n'
    + '  \n'
    + ' + if (get_sha1(arg, sha1) < 0)\n'
    + ' +     usage(describe_usage);\n'
    + ' + cmit = lookup_commit_reference(sha1);\n'
    + ' + if (!cmit)\n'
    + ' +     usage(describe_usage);\n'
    + ' +\n'
    + '   if (!initialized) {\n'
    + '       initialized = 1;\n'
    + '       for_each_ref(get_name);\n';

  const parser = new DiffParser();
  const result = parser.parse(diff);
  t.is(1, result.length);
  t.deepEqual(result[0], {
    chunks: [
      {
        header: {
          line_numbers_from_file_a: {
            count: 20,
            start: 98,
          },
          line_numbers_from_file_b: {
            count: 12,
            start: 98,
          },
          line_numbers_to_file: {
            count: 20,
            start: 98,
          },
          mode: 'combined',
          raw: '@@@ -98,20 -98,12 +98,20 @@@',
        },
        lines: [
          {
            file: ['a', 'b'],
            line_number_new: 98,
            line_number_old: 98,
            raw: '   return (a_date > b_date) ? -1 : (a_date == b_date) ? 0 : 1;',
            text: ' return (a_date > b_date) ? -1 : (a_date == b_date) ? 0 : 1;',
            type: 'unchanged',
          },
          {
            file: ['a', 'b'],
            line_number_new: 99,
            line_number_old: 99,
            raw: '  }',
            text: '}',
            type: 'unchanged',
          },
          {
            file: ['a', 'b'],
            line_number_new: 100,
            line_number_old: 100,
            raw: '  ',
            text: '',
            type: 'unchanged',
          },
          {
            file: ['a'],
            line_number_new: 101,
            line_number_old: 101,
            raw: '- static void describe(char *arg)',
            text: 'static void describe(char *arg)',
            type: 'change-old',
          },
          {
            file: ['b'],
            line_number_new: 102,
            line_number_old: 102,
            raw: ' -static void describe(struct commit *cmit, int last_one)',
            text: 'static void describe(struct commit *cmit, int last_one)',
            type: 'change-old',
          },
          {
            file: ['a', 'b'],
            line_number_new: 103,
            line_number_old: null,
            raw: '++static void describe(char *arg, int last_one)',
            text: 'static void describe(char *arg, int last_one)',
            type: 'change-both-add',
          },
          {
            file: ['a', 'b'],
            line_number_new: 104,
            line_number_old: 103,
            raw: '  {',
            text: '{',
            type: 'unchanged',
          },
          {
            file: ['b'],
            line_number_new: 105,
            line_number_old: 104,
            raw: ' + unsigned char sha1[20];',
            text: ' unsigned char sha1[20];',
            type: 'change-new',
          },
          {
            file: ['b'],
            line_number_new: 106,
            line_number_old: 105,
            raw: ' + struct commit *cmit;',
            text: ' struct commit *cmit;',
            type: 'change-new',
          },
          {
            file: ['a', 'b'],
            line_number_new: 107,
            line_number_old: 106,
            raw: '   struct commit_list *list;',
            text: ' struct commit_list *list;',
            type: 'unchanged',
          },
          {
            file: ['a', 'b'],
            line_number_new: 108,
            line_number_old: 107,
            raw: '   static int initialized = 0;',
            text: ' static int initialized = 0;',
            type: 'unchanged',
          },
          {
            file: ['a', 'b'],
            line_number_new: 109,
            line_number_old: 108,
            raw: '   struct commit_name *n;',
            text: ' struct commit_name *n;',
            type: 'unchanged',
          },
          {
            file: ['a', 'b'],
            line_number_new: 110,
            line_number_old: 109,
            raw: '  ',
            text: '',
            type: 'unchanged',
          },
          {
            file: ['b'],
            line_number_new: 111,
            line_number_old: 110,
            raw: ' + if (get_sha1(arg, sha1) < 0)',
            text: ' if (get_sha1(arg, sha1) < 0)',
            type: 'change-new',
          },
          {
            file: ['b'],
            line_number_new: 112,
            line_number_old: 111,
            raw: ' +     usage(describe_usage);',
            text: '     usage(describe_usage);',
            type: 'change-new',
          },
          {
            file: ['b'],
            line_number_new: 113,
            line_number_old: 112,
            raw: ' + cmit = lookup_commit_reference(sha1);',
            text: ' cmit = lookup_commit_reference(sha1);',
            type: 'change-new',
          },
          {
            file: ['b'],
            line_number_new: 114,
            line_number_old: 113,
            raw: ' + if (!cmit)',
            text: ' if (!cmit)',
            type: 'change-new',
          },
          {
            file: ['b'],
            line_number_new: 115,
            line_number_old: 114,
            raw: ' +     usage(describe_usage);',
            text: '     usage(describe_usage);',
            type: 'change-new',
          },
          {
            file: ['b'],
            line_number_new: 116,
            line_number_old: 115,
            raw: ' +',
            text: '',
            type: 'change-new',
          },
          {
            file: ['a', 'b'],
            line_number_new: 117,
            line_number_old: 116,
            raw: '   if (!initialized) {',
            text: ' if (!initialized) {',
            type: 'unchanged',
          },
          {
            file: ['a', 'b'],
            line_number_new: 118,
            line_number_old: 117,
            raw: '       initialized = 1;',
            text: '     initialized = 1;',
            type: 'unchanged',
          },
          {
            file: ['a', 'b'],
            line_number_new: 119,
            line_number_old: 118,
            raw: '       for_each_ref(get_name);',
            text: '     for_each_ref(get_name);',
            type: 'unchanged',
          },
        ],
      },
    ],
    cli: 'diff --combined describe.c',
    index: 'index fabadb8,cc95eb0..4866510',
    new: {
      date: '',
      filename: 'describe.c',
      fraction_seconds: '',
      raw: '+++ b/describe.c',
      time: '',
      time_zone: '',
      type: 'new-file',
    },
    old: {
      date: '',
      filename: 'describe.c',
      fraction_seconds: '',
      raw: '--- a/describe.c',
      time: '',
      time_zone: '',
      type: 'old-file',
    },
    type: 'text',
  });
});

test('should parse combined diff with escaped quotes', (t) => {
  const diff = 'diff --cc hello.rb\n'
    + 'index 0399cd5,59727f0..0000000\n'
    + 'mode 100644\n'
    + '--- a/hello.rb\n'
    + '+++ b/hello.rb\n'
    + '@@@ -1,7 -1,7 +1,7 @@@\n'
    + '  #! /usr/bin/env ruby\n'
    + '  \n'
    + '  def hello\n'
    + '-   puts \'hola world\'\n'
    + ' -  puts \'hello mundo\'\n'
    + '++  puts \'hola mundo\'\n'
    + '  end\n'
    + '  \n'
    + '  hello()\n';

  const parser = new DiffParser();
  const result = parser.parse(diff);
  t.is(1, result.length);
  t.deepEqual(result[0], {
    chunks: [
      {
        header: {
          line_numbers_from_file_a: {
            count: 7,
            start: 1,
          },
          line_numbers_from_file_b: {
            count: 7,
            start: 1,
          },
          line_numbers_to_file: {
            count: 7,
            start: 1,
          },
          mode: 'combined',
          raw: '@@@ -1,7 -1,7 +1,7 @@@',
        },
        lines: [
          {
            file: ['a', 'b'],
            line_number_new: 1,
            line_number_old: 1,
            raw: '  #! /usr/bin/env ruby',
            text: '#! /usr/bin/env ruby',
            type: 'unchanged',
          },
          {
            file: ['a', 'b'],
            line_number_new: 2,
            line_number_old: 2,
            raw: '  ',
            text: '',
            type: 'unchanged',
          },
          {
            file: ['a', 'b'],
            line_number_new: 3,
            line_number_old: 3,
            raw: '  def hello',
            text: 'def hello',
            type: 'unchanged',
          },
          {
            file: ['a'],
            line_number_new: 4,
            line_number_old: 4,
            raw: '-   puts \'hola world\'',
            text: '  puts \'hola world\'',
            type: 'change-old',
          },
          {
            file: ['b'],
            line_number_new: 5,
            line_number_old: 5,
            raw: ' -  puts \'hello mundo\'',
            text: '  puts \'hello mundo\'',
            type: 'change-old',
          },
          {
            file: ['a', 'b'],
            line_number_new: 6,
            line_number_old: null,
            raw: '++  puts \'hola mundo\'',
            text: '  puts \'hola mundo\'',
            type: 'change-both-add',
          },
          {
            file: ['a', 'b'],
            line_number_new: 7,
            line_number_old: 6,
            raw: '  end',
            text: 'end',
            type: 'unchanged',
          },
          {
            file: ['a', 'b'],
            line_number_new: 8,
            line_number_old: 7,
            raw: '  ',
            text: '',
            type: 'unchanged',
          },
          {
            file: ['a', 'b'],
            line_number_new: 9,
            line_number_old: 8,
            raw: '  hello()',
            text: 'hello()',
            type: 'unchanged',
          },
        ],
      },
    ],
    cli: 'diff --cc hello.rb',
    index: 'index 0399cd5,59727f0..0000000',
    mode_change: 'mode 100644',
    new: {
      date: '',
      filename: 'hello.rb',
      fraction_seconds: '',
      raw: '+++ b/hello.rb',
      time: '',
      time_zone: '',
      type: 'new-file',
    },
    old: {
      date: '',
      filename: 'hello.rb',
      fraction_seconds: '',
      raw: '--- a/hello.rb',
      time: '',
      time_zone: '',
      type: 'old-file',
    },
    type: 'text',
  });
});

test('DiffParser.praseFileLine(line): can parse lines of all types', (t) => {
  let result = DiffParser.praseFileLine('--- a/src/attributes/classes.js\n');
  t.deepEqual(result, {
    date: '',
    filename: 'src/attributes/classes.js',
    fraction_seconds: '',
    raw: '--- a/src/attributes/classes.js\n',
    time_zone: '',
    time: '',
    type: 'old-file',
  });

  result = DiffParser.praseFileLine('+++ b/src/attributes/classes.js\n');
  t.deepEqual(result, {
    date: '',
    filename: 'src/attributes/classes.js',
    fraction_seconds: '',
    raw: '+++ b/src/attributes/classes.js\n',
    time_zone: '',
    time: '',
    type: 'new-file',
  });

  result = DiffParser.praseFileLine('$$$ z/src/hook.js');
  t.deepEqual(result, {
    date: '',
    filename: '$$$ z/src/hook.js',
    fraction_seconds: '',
    raw: '$$$ z/src/hook.js',
    time_zone: '',
    time: '',
    type: 'unknown',
  });

  result = DiffParser.praseFileLine('--- site/content/superdisc-memory-map.json	2019-09-29 20:15:46.000000000 -0700');
  t.deepEqual(result, {
    date: '2019-09-29',
    filename: 'site/content/superdisc-memory-map.json',
    fraction_seconds: '000000000',
    raw: '--- site/content/superdisc-memory-map.json\t2019-09-29 20:15:46.000000000 -0700',
    time: '20:15:46',
    time_zone: '-0700',
    type: 'old-file',
  });

  result = DiffParser.praseFileLine('+++ site/content/name with spaces.json 2019-09-29 20:15:46.000000000 -0700');
  t.deepEqual(result, {
    date: '2019-09-29',
    filename: 'site/content/name with spaces.json',
    fraction_seconds: '000000000',
    raw: '+++ site/content/name with spaces.json 2019-09-29 20:15:46.000000000 -0700',
    time: '20:15:46',
    time_zone: '-0700',
    type: 'new-file',
  });

  result = DiffParser.praseFileLine('+++ a/test.json 2019-09-29 20:15:46 -0700');
  t.deepEqual(result, {
    date: '2019-09-29',
    filename: 'test.json',
    fraction_seconds: '',
    raw: '+++ a/test.json 2019-09-29 20:15:46 -0700',
    time: '20:15:46',
    time_zone: '-0700',
    type: 'new-file',
  });
});

test('DiffParser.praseChunkHeader(line): can parse chunk headers of all types', (t) => {
  let result = DiffParser.praseChunkHeader('@@ @@\n');
  t.deepEqual(result, {
    error: 'invalid',
    line_numbers_from_file: {
      count: 0,
      start: 1,
    },
    line_numbers_to_file: {
      count: 0,
      start: 1,
    },
    mode: 'unified',
    raw: '@@ @@\n',
  });

  result = DiffParser.praseChunkHeader();
  t.deepEqual(result, {
    line_numbers_from_file: {
      count: 0,
      start: 1,
    },
    line_numbers_to_file: {
      count: 0,
      start: 1,
    },
    mode: 'none',
    raw: '',
  });

  result = DiffParser.praseChunkHeader('@@ -1 @@\n');
  t.deepEqual(result, {
    line_numbers_from_file: {
      count: 0,
      start: 1,
    },
    line_numbers_to_file: {
      count: 0,
      start: 1,
    },
    error: 'invalid',
    mode: 'unified',
    raw: '@@ -1 @@\n',
  });

  result = DiffParser.praseChunkHeader('@@ -1 +1 @@\n');
  t.deepEqual(result, {
    line_numbers_from_file: {
      count: 0,
      start: 1,
    },
    line_numbers_to_file: {
      count: 0,
      start: 1,
    },
    mode: 'unified',
    raw: '@@ -1 +1 @@\n',
  });

  result = DiffParser.praseChunkHeader('@@ -1 +1,2 @@');
  t.deepEqual(result, {
    line_numbers_from_file: {
      count: 0,
      start: 1,
    },
    line_numbers_to_file: {
      count: 2,
      start: 1,
    },
    mode: 'unified',
    raw: '@@ -1 +1,2 @@',
  });

  result = DiffParser.praseChunkHeader('@@ -10 +20,2 @@');
  t.deepEqual(result, {
    line_numbers_from_file: {
      count: 0,
      start: 10,
    },
    line_numbers_to_file: {
      count: 2,
      start: 20,
    },
    mode: 'unified',
    raw: '@@ -10 +20,2 @@',
  });

  result = DiffParser.praseChunkHeader('@@ -1,5 +1,5 @@');
  t.deepEqual(result, {
    line_numbers_from_file: {
      count: 5,
      start: 1,
    },
    line_numbers_to_file: {
      count: 5,
      start: 1,
    },
    mode: 'unified',
    raw: '@@ -1,5 +1,5 @@',
  });

  result = DiffParser.praseChunkHeader('@@ -101,7 +101,7 @@ var rootjQuery,');
  t.deepEqual(result, {
    line_numbers_from_file: {
      count: 0,
      start: 1,
    },
    line_numbers_to_file: {
      count: 0,
      start: 1,
    },
    mode: 'none',
    raw: '@@ -101,7 +101,7 @@ var rootjQuery,',
  });

  result = DiffParser.praseChunkHeader('@@@ -1,7 @@@\n');
  t.deepEqual(result, {
    line_numbers_from_file_a: {
      count: 0,
      start: 1,
    },
    line_numbers_from_file_b: {
      count: 0,
      start: 1,
    },
    line_numbers_to_file: {
      count: 0,
      start: 1,
    },
    error: 'invalid',
    mode: 'combined',
    raw: '@@@ -1,7 @@@\n',
  });

  result = DiffParser.praseChunkHeader('@@@ -1,7 -1,7 @@@\n');
  t.deepEqual(result, {
    line_numbers_from_file_a: {
      count: 0,
      start: 1,
    },
    line_numbers_from_file_b: {
      count: 0,
      start: 1,
    },
    line_numbers_to_file: {
      count: 0,
      start: 1,
    },
    error: 'invalid',
    mode: 'combined',
    raw: '@@@ -1,7 -1,7 @@@\n',
  });

  result = DiffParser.praseChunkHeader('@@@ -1,7 -1,7 +1,7 @@@\n');
  t.deepEqual(result, {
    line_numbers_from_file_a: {
      count: 7,
      start: 1,
    },
    line_numbers_from_file_b: {
      count: 7,
      start: 1,
    },
    line_numbers_to_file: {
      count: 7,
      start: 1,
    },
    mode: 'combined',
    raw: '@@@ -1,7 -1,7 +1,7 @@@\n',
  });

  result = DiffParser.praseChunkHeader('@@@ -98,20 -98,12 +98,20 @@@');
  t.deepEqual(result, {
    line_numbers_from_file_a: {
      count: 20,
      start: 98,
    },
    line_numbers_from_file_b: {
      count: 12,
      start: 98,
    },
    line_numbers_to_file: {
      count: 20,
      start: 98,
    },
    mode: 'combined',
    raw: '@@@ -98,20 -98,12 +98,20 @@@',
  });

  result = DiffParser.praseChunkHeader('@@@ -98 -98 +98 @@@');
  t.deepEqual(result, {
    line_numbers_from_file_a: {
      count: 0,
      start: 98,
    },
    line_numbers_from_file_b: {
      count: 0,
      start: 98,
    },
    line_numbers_to_file: {
      count: 0,
      start: 98,
    },
    mode: 'combined',
    raw: '@@@ -98 -98 +98 @@@',
  });
});

test('DiffParser.parseUnifiedContent(line): can parse unified diff content of all types', (t) => {
  let result = DiffParser.parseUnifiedContent();
  t.deepEqual(result, {
    line_number_new: null,
    line_number_old: null,
    raw: '',
    text: '',
    type: 'unknown',
  });

  result = DiffParser.parseUnifiedContent(' \n');
  t.deepEqual(result, {
    line_number_new: 0,
    line_number_old: 0,
    raw: ' \n',
    text: '\n',
    type: 'unchanged',
  });

  result = DiffParser.parseUnifiedContent(' test');
  t.deepEqual(result, {
    line_number_new: 0,
    line_number_old: 0,
    raw: ' test',
    text: 'test',
    type: 'unchanged',
  });

  result = DiffParser.parseUnifiedContent('+test');
  t.deepEqual(result, {
    line_number_new: 0,
    line_number_old: null,
    raw: '+test',
    text: 'test',
    type: 'change-new',
  });

  result = DiffParser.parseUnifiedContent('-test');
  t.deepEqual(result, {
    line_number_new: null,
    line_number_old: 0,
    raw: '-test',
    text: 'test',
    type: 'change-old',
  });

  result = DiffParser.parseUnifiedContent('+test', { old: 32, new: 33 });
  t.deepEqual(result, {
    line_number_new: 33,
    line_number_old: null,
    raw: '+test',
    text: 'test',
    type: 'change-new',
  });

  result = DiffParser.parseUnifiedContent('-test', { old: 32, new: 33 });
  t.deepEqual(result, {
    line_number_new: null,
    line_number_old: 32,
    raw: '-test',
    text: 'test',
    type: 'change-old',
  });
});

test('DiffParser.parseCombinedContent(line): can parse combined diff content of all types', (t) => {
  let result = DiffParser.parseCombinedContent();
  t.deepEqual(result, {
    file: [],
    line_number_new: null,
    line_number_old: null,
    raw: '',
    text: '',
    type: 'unknown',
  });

  result = DiffParser.parseCombinedContent('  \n');
  t.deepEqual(result, {
    file: ['a', 'b'],
    line_number_new: 0,
    line_number_old: 0,
    raw: '  \n',
    text: '\n',
    type: 'unchanged',
  });

  result = DiffParser.parseCombinedContent('++test');
  t.deepEqual(result, {
    file: ['a', 'b'],
    line_number_new: 0,
    line_number_old: null,
    raw: '++test',
    text: 'test',
    type: 'change-both-add',
  });

  result = DiffParser.parseCombinedContent(' +test');
  t.deepEqual(result, {
    file: ['b'],
    line_number_new: 0,
    line_number_old: 0,
    raw: ' +test',
    text: 'test',
    type: 'change-new',
  });

  result = DiffParser.parseCombinedContent('+ test');
  t.deepEqual(result, {
    file: ['a'],
    line_number_new: 0,
    line_number_old: 0,
    raw: '+ test',
    text: 'test',
    type: 'change-new',
  });

  result = DiffParser.parseCombinedContent('-+test');
  t.deepEqual(result, {
    file: ['a', 'b'],
    line_number_new: 0,
    line_number_old: 0,
    raw: '-+test',
    text: 'test',
    type: 'change-both-remove-add',
  });

  result = DiffParser.parseCombinedContent('+-test');
  t.deepEqual(result, {
    file: ['a', 'b'],
    line_number_new: 0,
    line_number_old: 0,
    raw: '+-test',
    text: 'test',
    type: 'change-both-add-remove',
  });

  result = DiffParser.parseCombinedContent('--test');
  t.deepEqual(result, {
    file: ['a', 'b'],
    line_number_new: null,
    line_number_old: 0,
    raw: '--test',
    text: 'test',
    type: 'change-both-remove',
  });

  result = DiffParser.parseCombinedContent(' -test');
  t.deepEqual(result, {
    file: ['b'],
    line_number_new: 0,
    line_number_old: 0,
    raw: ' -test',
    text: 'test',
    type: 'change-old',
  });

  result = DiffParser.parseCombinedContent('- test');
  t.deepEqual(result, {
    file: ['a'],
    line_number_new: 0,
    line_number_old: 0,
    raw: '- test',
    text: 'test',
    type: 'change-old',
  });

  result = DiffParser.parseCombinedContent('  test', { old: 2, new: 3 });
  t.deepEqual(result, {
    file: ['a', 'b'],
    line_number_new: 3,
    line_number_old: 2,
    raw: '  test',
    text: 'test',
    type: 'unchanged',
  });
});

test('DiffParser.detectLineType(line): can detect lines of all types', (t) => {
  t.is(DiffParser.detectLineType('diff --git a/src/var/str.js b/src/var/str.js\n'), 'diff-cli');

  t.is(DiffParser.detectLineType('--- a/sample\r\n'), 'old-file');
  t.is(DiffParser.detectLineType('--- a/src/var/str.js\n'), 'old-file');

  t.is(DiffParser.detectLineType('+++ b/sample\r\n'), 'new-file');
  t.is(DiffParser.detectLineType('+++ /dev/null\n'), 'new-file');

  t.is(DiffParser.detectLineType('index 2a9d516a5647205d7be510dd0dff93a3663eff6f..0000000000000000000000000000000000000000\n'), 'index-checksum');
  t.is(DiffParser.detectLineType('index e01513b..f14a870 100644\n'), 'index-checksum');

  t.is(DiffParser.detectLineType('mode <mode>,<mode>..<mode>'), 'mode-change');

  t.is(DiffParser.detectLineType('deleted file mode 100644\n'), 'deleted-file');

  t.is(DiffParser.detectLineType('Binary files differ\n'), 'binary');
  t.is(DiffParser.detectLineType('Binary files old/image.jpg and new/image.jpg differ'), 'binary');

  t.is(DiffParser.detectLineType('new file mode 100644\n'), 'new-file-git');
  t.is(DiffParser.detectLineType('dissimilarity index 5%\n'), 'dissimilarity-index');
  t.is(DiffParser.detectLineType('similarity index 86%\n'), 'similarity-index');

  t.is(DiffParser.detectLineType('copy from index.js\n'), 'copy-from');
  t.is(DiffParser.detectLineType('copy to more-index.js\n'), 'copy-to');

  t.is(DiffParser.detectLineType('rename from src/test-bar.js\n'), 'rename-from');
  t.is(DiffParser.detectLineType('rename to src/test-baz.js\n'), 'rename-to');

  t.is(DiffParser.detectLineType('GIT binary patch\n'), 'git-binary-patch');

  t.is(DiffParser.detectLineType('literal 0\n'), 'git-binary-patch-literal');
  t.is(DiffParser.detectLineType('literal 471\n'), 'git-binary-patch-literal');

  t.is(DiffParser.detectLineType('@@@ <from-file-range> <from-file-range> <to-file-range> @@@'), 'chunk-header-combined');
  t.is(DiffParser.detectLineType('@@@ -98,20 -98,12 +98,20 @@@\n'), 'chunk-header-combined');

  t.is(DiffParser.detectLineType('@@ @@'), 'chunk-header');
  t.is(DiffParser.detectLineType('@@ -1 +1 @@'), 'chunk-header');
  t.is(DiffParser.detectLineType('@@ -1 +1,2 @@'), 'chunk-header');
  t.is(DiffParser.detectLineType('@@ -10 +20,2 @@'), 'chunk-header');
  t.is(DiffParser.detectLineType('@@ -1,5 +1,5 @@\n'), 'chunk-header');
  t.is(DiffParser.detectLineType('@@ -101,7 +101,7 @@ var rootjQuery,\n'), 'chunk-header');

  t.is(DiffParser.detectLineType(), 'unknown');
  t.is(DiffParser.detectLineType(''), 'unknown');
  t.is(DiffParser.detectLineType(null), 'unknown');
  t.is(DiffParser.detectLineType(NaN), 'unknown');
  t.is(DiffParser.detectLineType(false), 'unknown');
});
