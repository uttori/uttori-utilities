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
| config | <code>object</code> | The configuration object. |
| tokenizer | <code>TokenizeThis</code> | The tokenizer instance. |
| operators | <code>object</code> | The operators from config converted to Operator objects. |


* [DiffParser](#DiffParser)
    * [new DiffParser(config)](#new_DiffParser_new)
    * _instance_
        * [.parse(diff)](#DiffParser+parse) ⇒ <code>object</code>
    * _static_
        * [.detectLineType(line)](#DiffParser.detectLineType) ⇒ <code>string</code>
        * [.parseUnifiedContent(line, [header])](#DiffParser.parseUnifiedContent) ⇒ <code>object</code>
        * [.parseCombinedContent(line, [header])](#DiffParser.parseCombinedContent) ⇒ <code>object</code>
        * [.praseChunkHeader(raw)](#DiffParser.praseChunkHeader) ⇒ <code>object</code>
        * [.praseFileLine(raw)](#DiffParser.praseFileLine) ⇒ <code>object</code>

<a name="new_DiffParser_new"></a>

### new DiffParser(config)
Creates an instance of SqlWhereParser.


| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | A configuration object. |

**Example** *(Init DiffParser)*  
```js
const parser = new DiffParser();
const parsed = parser.parse(unified_diff);
```
<a name="DiffParser+parse"></a>

### diffParser.parse(diff) ⇒ <code>object</code>
Parse a SQL statement with an evaluator function.
Uses an implementation of the Shunting-Yard Algorithm.

**Kind**: instance method of [<code>DiffParser</code>](#DiffParser)  
**Returns**: <code>object</code> - - The parsed query tree.  
**See**

- [Shunting-Yard Algorithm](https://en.wikipedia.org/wiki/Shunting-yard_algorithm)
- [Shunting-Yard Algorithm](https://wcipeg.com/wiki/Shunting_yard_algorithm)


| Param | Type | Description |
| --- | --- | --- |
| diff | <code>string</code> | The diff to be parsed. |

<a name="DiffParser.detectLineType"></a>

### DiffParser.detectLineType(line) ⇒ <code>string</code>
Detect the type of diff line provided.

**Kind**: static method of [<code>DiffParser</code>](#DiffParser)  
**Returns**: <code>string</code> - - The type of line detected.  

| Param | Type | Description |
| --- | --- | --- |
| line | <code>string</code> | The line to detect the type of. |

<a name="DiffParser.parseUnifiedContent"></a>

### DiffParser.parseUnifiedContent(line, [header]) ⇒ <code>object</code>
Parse Unified Diff content.

**Kind**: static method of [<code>DiffParser</code>](#DiffParser)  
**Returns**: <code>object</code> - - The line parsed into its various parts.  

| Param | Type | Description |
| --- | --- | --- |
| line | <code>string</code> | The line to parse. |
| [header] | <code>object</code> | The the header for the diff block. |
| [header.old] | <code>number</code> | The previous line number of the current line. |
| [header.new] | <code>number</code> | The new line number of the current line. |

<a name="DiffParser.parseCombinedContent"></a>

### DiffParser.parseCombinedContent(line, [header]) ⇒ <code>object</code>
Parse Combined Diff content.

**Kind**: static method of [<code>DiffParser</code>](#DiffParser)  
**Returns**: <code>object</code> - - The line parsed into its various parts.  

| Param | Type | Description |
| --- | --- | --- |
| line | <code>string</code> | The line to parse. |
| [header] | <code>object</code> | The the header for the diff block. |
| [header.old] | <code>number</code> | The previous line number of the current line. |
| [header.new] | <code>number</code> | The new line number of the current line. |

<a name="DiffParser.praseChunkHeader"></a>

### DiffParser.praseChunkHeader(raw) ⇒ <code>object</code>
Parse a chunk header.
Hunks of differences; each hunk shows one area where the files differ.
If a hunk contains just one line, only its start line number appears. Otherwise its line numbers look like ‘start,count’. An empty hunk is considered to start at the line that follows the hunk.
If a hunk and its context contain two or more lines, its line numbers look like ‘start,count’. Otherwise only its end line number appears. An empty hunk is considered to end at the line that precedes the hunk.

**Kind**: static method of [<code>DiffParser</code>](#DiffParser)  
**Returns**: <code>object</code> - - The text parsed into its various parts.  

| Param | Type | Description |
| --- | --- | --- |
| raw | <code>string</code> | The text to parse. |

**Example** *(DiffParser.praseChunkHeader(raw))*  
```js
const { line_numbers_from_file, line_numbers_to_file, mode, raw } = DiffParser.praseChunkHeader('@@ -1,5 +1,5 @@');
```
<a name="DiffParser.praseFileLine"></a>

### DiffParser.praseFileLine(raw) ⇒ <code>object</code>
Parse file lines.

**Kind**: static method of [<code>DiffParser</code>](#DiffParser)  
**Returns**: <code>object</code> - - The text parsed into its various parts.  
**See**: [Detailed Description of Unified Format](https://www.gnu.org/software/diffutils/manual/html_node/Detailed-Unified.html)  

| Param | Type | Description |
| --- | --- | --- |
| raw | <code>string</code> | The text to parse. |

**Example** *(DiffParser.praseFileLine(raw))*  
```js
// +++ Date Timestamp[FractionalSeconds] TimeZone
// +++ 2002-02-21 23:30:39.942229878 -0800
const { filename, fraction_seconds, raw, time_zone, time, type } = DiffParser.praseFileLine('--- a/src/attributes/classes.js\n');
```
