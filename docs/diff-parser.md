<a name="DiffParser"></a>

## DiffParser
Parses the output of a unified `diff` string into an abstract syntax tree.
The tree is object-based, where each key is the operator, and its value is an array of the operands.
The number of operands depends on if the operation is defined as unary, binary, or ternary in the config.

**Kind**: global class
**See**

- [git-diff](https://git-scm.com/docs/git-diff)
- [Git Tools Advanced Merging](https://git-scm.com/book/en/v2/Git-Tools-Advanced-Merging)

**Properties**

| Name | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | The configuration object. |
| tokenizer | <code>TokenizeThis</code> | The tokenizer instance. |
| operators | <code>Object</code> | The operators from config converted to Operator objects. |


* [DiffParser](#DiffParser)
    * [new DiffParser(config)](#new_DiffParser_new)
    * _instance_
        * [.parse(sql, [evaluator])](#DiffParser+parse) ⇒ <code>Object</code>
    * _static_
        * [.detectLineType(line)](#DiffParser.detectLineType) ⇒ <code>String</code>
        * [.parseUnifiedContent(line, [header])](#DiffParser.parseUnifiedContent) ⇒ <code>Object</code>
        * [.parseCombinedContent(line, [header])](#DiffParser.parseCombinedContent) ⇒ <code>Object</code>
        * [.praseChunkHeader(raw)](#DiffParser.praseChunkHeader) ⇒ <code>Object</code>

<a name="new_DiffParser_new"></a>

### new DiffParser(config)
Creates an instance of SqlWhereParser.


| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | A configuration object. |

**Example** *(Init DiffParser)*
```js
const parser = new DiffParser();
const parsed = parser.parse(unified_diff);
```
<a name="DiffParser+parse"></a>

### diffParser.parse(sql, [evaluator]) ⇒ <code>Object</code>
Parse a SQL statement with an evaluator function.
Uses an implementation of the Shunting-Yard Algorithm.

**Kind**: instance method of [<code>DiffParser</code>](#DiffParser)
**Returns**: <code>Object</code> - - The parsed query tree.
**See**

- [Shunting-Yard Algorithm](https://en.wikipedia.org/wiki/Shunting-yard_algorithm)
- [Shunting-Yard Algorithm](https://wcipeg.com/wiki/Shunting_yard_algorithm)


| Param | Type | Description |
| --- | --- | --- |
| sql | <code>String</code> | Query string to process. |
| [evaluator] | <code>function</code> | Function to evaluate operators. |

<a name="DiffParser.detectLineType"></a>

### DiffParser.detectLineType(line) ⇒ <code>String</code>
Detect the type of diff line provided.

**Kind**: static method of [<code>DiffParser</code>](#DiffParser)
**Returns**: <code>String</code> - - The type of line detected.

| Param | Type | Description |
| --- | --- | --- |
| line | <code>String</code> | The line to detect the type of. |

<a name="DiffParser.parseUnifiedContent"></a>

### DiffParser.parseUnifiedContent(line, [header]) ⇒ <code>Object</code>
Parse Unified Diff content.

**Kind**: static method of [<code>DiffParser</code>](#DiffParser)
**Returns**: <code>Object</code> - - The line parsed into its various parts.

| Param | Type | Description |
| --- | --- | --- |
| line | <code>String</code> | The line to parse. |
| [header] | <code>Object</code> | The the header for the diff block. |
| [header.old] | <code>Number</code> | The previous line number of the current line. |
| [header.new] | <code>Number</code> | The new line number of the current line. |

<a name="DiffParser.parseCombinedContent"></a>

### DiffParser.parseCombinedContent(line, [header]) ⇒ <code>Object</code>
Parse Combined Diff content.

**Kind**: static method of [<code>DiffParser</code>](#DiffParser)
**Returns**: <code>Object</code> - - The line parsed into its various parts.

| Param | Type | Description |
| --- | --- | --- |
| line | <code>String</code> | The line to parse. |
| [header] | <code>Object</code> | The the header for the diff block. |
| [header.old] | <code>Number</code> | The previous line number of the current line. |
| [header.new] | <code>Number</code> | The new line number of the current line. |

<a name="DiffParser.praseChunkHeader"></a>

### DiffParser.praseChunkHeader(raw) ⇒ <code>Object</code>
Parse a chunk header.
Hunks of differences; each hunk shows one area where the files differ.
If a hunk contains just one line, only its start line number appears. Otherwise its line numbers look like ‘start,count’. An empty hunk is considered to start at the line that follows the hunk.
If a hunk and its context contain two or more lines, its line numbers look like ‘start,count’. Otherwise only its end line number appears. An empty hunk is considered to end at the line that precedes the hunk.

**Kind**: static method of [<code>DiffParser</code>](#DiffParser)
**Returns**: <code>Object</code> - - The text parsed into its various parts.

| Param | Type | Description |
| --- | --- | --- |
| raw | <code>String</code> | The text to parse. |

**Example** *(DiffParser.praseChunkHeader(raw))*
```js
const { line_numbers_from_file, line_numbers_to_file, mode, raw } = DiffParser.praseChunkHeader('@@ -1,5 +1,5 @@');
```
