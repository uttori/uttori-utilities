## Classes

<dl>
<dt><a href="#Tokenizer">Tokenizer</a></dt>
<dd><p>Parse a string into a token structure.
Create an instance of this class for each new string you wish to parse.</p>
</dd>
<dt><a href="#TokenizeThis">TokenizeThis</a></dt>
<dd><p>Takes in the config, processes it, and creates tokenizer instances based on that config.</p>
</dd>
</dl>

## Functions

<dl>
<dt><a href="#sortTokenizableSubstrings">sortTokenizableSubstrings(a, b)</a> ⇒ <code>number</code></dt>
<dd><p>Sorts the tokenizable substrings by their length DESC.</p>
</dd>
</dl>

<a name="Tokenizer"></a>

## Tokenizer
Parse a string into a token structure.
Create an instance of this class for each new string you wish to parse.

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| factory | [<code>TokenizeThis</code>](#TokenizeThis) | Holds the processed configuration. |
| str | <code>string</code> | The string to tokenize. |
| forEachToken | <code>function</code> | The function to call for teach token. |
| previousChr | <code>String</code> | The previous character consumed. |
| toMatch | <code>String</code> | The current quote to match. |
| currentToken | <code>String</code> | The current token being created. |
| modeStack | <code>Array</code> | Keeps track of the current "mode" of tokenization. The tokenization rules are different depending if you are tokenizing an explicit string (surrounded by quotes), versus a non-explicit string (not surrounded by quotes). |


* [Tokenizer](#Tokenizer)
    * [new Tokenizer(factory, str, forEachToken)](#new_Tokenizer_new)
    * [.consume(chr)](#Tokenizer+consume)
    * [.MODE_NONE(chr)](#Tokenizer+MODE_NONE) ⇒ <code>\*</code>
    * [.MODE_DEFAULT(chr)](#Tokenizer+MODE_DEFAULT) ⇒ <code>string</code>
    * [.pushDefaultModeTokenizables()](#Tokenizer+pushDefaultModeTokenizables) ⇒ <code>\*</code>
    * [.MODE_MATCH(chr)](#Tokenizer+MODE_MATCH) ⇒ <code>string</code>

<a name="new_Tokenizer_new"></a>

### new Tokenizer(factory, str, forEachToken)

| Param | Type | Description |
| --- | --- | --- |
| factory | [<code>TokenizeThis</code>](#TokenizeThis) | Holds the processed configuration. |
| str | <code>String</code> | The string to tokenize. |
| forEachToken | <code>function</code> | The function to call for teach token. |

**Example** *(Init Tokenizer)*  
```js
const tokenizerInstance = new Tokenizer(this, str, forEachToken);
return tokenizerInstance.tokenize();
```
<a name="Tokenizer+consume"></a>

### tokenizer.consume(chr)
**Kind**: instance method of [<code>Tokenizer</code>](#Tokenizer)  

| Param | Type |
| --- | --- |
| chr | <code>string</code> | 

<a name="Tokenizer+MODE_NONE"></a>

### tokenizer.MODE\_NONE(chr) ⇒ <code>\*</code>
**Kind**: instance method of [<code>Tokenizer</code>](#Tokenizer)  

| Param | Type |
| --- | --- |
| chr | <code>string</code> | 

<a name="Tokenizer+MODE_DEFAULT"></a>

### tokenizer.MODE\_DEFAULT(chr) ⇒ <code>string</code>
**Kind**: instance method of [<code>Tokenizer</code>](#Tokenizer)  

| Param | Type |
| --- | --- |
| chr | <code>string</code> | 

<a name="Tokenizer+pushDefaultModeTokenizables"></a>

### tokenizer.pushDefaultModeTokenizables() ⇒ <code>\*</code>
Parse out potential tokenizable substrings out of the current token.

**Kind**: instance method of [<code>Tokenizer</code>](#Tokenizer)  
<a name="Tokenizer+MODE_MATCH"></a>

### tokenizer.MODE\_MATCH(chr) ⇒ <code>string</code>
**Kind**: instance method of [<code>Tokenizer</code>](#Tokenizer)  

| Param | Type |
| --- | --- |
| chr | <code>string</code> | 

<a name="TokenizeThis"></a>

## TokenizeThis
Takes in the config, processes it, and creates tokenizer instances based on that config.

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | The configuration object. |
| convertLiterals | <code>Boolean</code> | If literals should be converted or not, ie 'true' -> true. |
| escapeCharacter | <code>String</code> | Character to use as an escape in strings. |
| tokenizeList | <code>Object</code> | Holds the list of tokenizable substrings. |
| tokenizeMap | <code>Object</code> | Holds an easy lookup map of tokenizable substrings. |
| matchList | <code>Object</code> | Holds the list of quotes to match explicit strings with. |
| matchMap | <code>Object</code> | Holds an easy lookup map of quotes to match explicit strings with. |
| delimiterList | <code>Object</code> | Holds the list of delimiters. |
| delimiterMap | <code>Object</code> | Holds an easy lookup map of delimiters. |

<a name="TokenizeThis+tokenize"></a>

### tokenizeThis.tokenize(str, forEachToken) ⇒ <code>\*</code>
Creates a Tokenizer, then immediately calls "tokenize".

**Kind**: instance method of [<code>TokenizeThis</code>](#TokenizeThis)  

| Param | Type |
| --- | --- |
| str | <code>string</code> | 
| forEachToken | <code>function</code> | 

<a name="sortTokenizableSubstrings"></a>

## sortTokenizableSubstrings(a, b) ⇒ <code>number</code>
Sorts the tokenizable substrings by their length DESC.

**Kind**: global function  

| Param | Type |
| --- | --- |
| a | <code>string</code> | 
| b | <code>string</code> | 

