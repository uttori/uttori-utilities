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
| previousCharacter | <code>string</code> | The previous character consumed. |
| toMatch | <code>string</code> | The current quote to match. |
| currentToken | <code>string</code> | The current token being created. |
| modeStack | <code>Array</code> | Keeps track of the current "mode" of tokenization. The tokenization rules are different depending if you are tokenizing an explicit string (surrounded by quotes), versus a non-explicit string (not surrounded by quotes). |


* [Tokenizer](#Tokenizer)
    * [new Tokenizer(factory, str, forEachToken)](#new_Tokenizer_new)
    * [.getCurrentMode()](#Tokenizer+getCurrentMode) ⇒ <code>string</code>
    * [.setCurrentMode(mode)](#Tokenizer+setCurrentMode) ⇒ <code>number</code>
    * [.completeCurrentMode()](#Tokenizer+completeCurrentMode) ⇒ <code>string</code>
    * [.push(token)](#Tokenizer+push)
    * [.tokenize()](#Tokenizer+tokenize)
    * [.consume(character)](#Tokenizer+consume)
    * [.MODE_NONE(character)](#Tokenizer+MODE_NONE)
    * [.MODE_DEFAULT(character)](#Tokenizer+MODE_DEFAULT) ⇒ <code>string</code>
    * [.pushDefaultModeTokenizables()](#Tokenizer+pushDefaultModeTokenizables)
    * [.MODE_MATCH(character)](#Tokenizer+MODE_MATCH) ⇒ <code>string</code>

<a name="new_Tokenizer_new"></a>

### new Tokenizer(factory, str, forEachToken)

| Param | Type | Description |
| --- | --- | --- |
| factory | [<code>TokenizeThis</code>](#TokenizeThis) | Holds the processed configuration. |
| str | <code>string</code> | The string to tokenize. |
| forEachToken | <code>function</code> | The function to call for teach token. |

**Example** *(Init Tokenizer)*  
```js
const tokenizerInstance = new Tokenizer(this, str, forEachToken);
return tokenizerInstance.tokenize();
```
<a name="Tokenizer+getCurrentMode"></a>

### tokenizer.getCurrentMode() ⇒ <code>string</code>
Get the current mode from the stack.

**Kind**: instance method of [<code>Tokenizer</code>](#Tokenizer)  
**Returns**: <code>string</code> - The current mode from the stack.  
<a name="Tokenizer+setCurrentMode"></a>

### tokenizer.setCurrentMode(mode) ⇒ <code>number</code>
Set the current mode on the stack.

**Kind**: instance method of [<code>Tokenizer</code>](#Tokenizer)  
**Returns**: <code>number</code> - The size of the mode stack.  

| Param | Type | Description |
| --- | --- | --- |
| mode | <code>string</code> | The mode to set on the stack. |

<a name="Tokenizer+completeCurrentMode"></a>

### tokenizer.completeCurrentMode() ⇒ <code>string</code>
Ends the current mode and removes it from the stack.

**Kind**: instance method of [<code>Tokenizer</code>](#Tokenizer)  
**Returns**: <code>string</code> - The last mode of the stack.  
<a name="Tokenizer+push"></a>

### tokenizer.push(token)
Parse the provided token.

**Kind**: instance method of [<code>Tokenizer</code>](#Tokenizer)  

| Param | Type | Description |
| --- | --- | --- |
| token | <code>\*</code> | The token to parse. |

<a name="Tokenizer+tokenize"></a>

### tokenizer.tokenize()
Process the string.

**Kind**: instance method of [<code>Tokenizer</code>](#Tokenizer)  
<a name="Tokenizer+consume"></a>

### tokenizer.consume(character)
Adds a character with the current mode.

**Kind**: instance method of [<code>Tokenizer</code>](#Tokenizer)  

| Param | Type | Description |
| --- | --- | --- |
| character | <code>string</code> | The character to process. |

<a name="Tokenizer+MODE_NONE"></a>

### tokenizer.MODE\_NONE(character)
Changs the current mode depending on the character.

**Kind**: instance method of [<code>Tokenizer</code>](#Tokenizer)  

| Param | Type | Description |
| --- | --- | --- |
| character | <code>string</code> | The character to consider. |

<a name="Tokenizer+MODE_DEFAULT"></a>

### tokenizer.MODE\_DEFAULT(character) ⇒ <code>string</code>
Checks the token for delimiter or quotes, else continue building token.

**Kind**: instance method of [<code>Tokenizer</code>](#Tokenizer)  
**Returns**: <code>string</code> - The current token.  

| Param | Type | Description |
| --- | --- | --- |
| character | <code>string</code> | The character to consider. |

<a name="Tokenizer+pushDefaultModeTokenizables"></a>

### tokenizer.pushDefaultModeTokenizables()
Parse out potential tokenizable substrings out of the current token.

**Kind**: instance method of [<code>Tokenizer</code>](#Tokenizer)  
<a name="Tokenizer+MODE_MATCH"></a>

### tokenizer.MODE\_MATCH(character) ⇒ <code>string</code>
Checks for a completed match between characters.

**Kind**: instance method of [<code>Tokenizer</code>](#Tokenizer)  
**Returns**: <code>string</code> - - The current token.  

| Param | Type | Description |
| --- | --- | --- |
| character | <code>string</code> | The character to match. |

<a name="TokenizeThis"></a>

## TokenizeThis
Takes in the config, processes it, and creates tokenizer instances based on that config.

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | The configuration object. |
| convertLiterals | <code>boolean</code> | If literals should be converted or not, ie 'true' -> true. |
| escapeCharacter | <code>string</code> | Character to use as an escape in strings. |
| tokenizeList | <code>object</code> | Holds the list of tokenizable substrings. |
| tokenizeMap | <code>object</code> | Holds an easy lookup map of tokenizable substrings. |
| matchList | <code>object</code> | Holds the list of quotes to match explicit strings with. |
| matchMap | <code>object</code> | Holds an easy lookup map of quotes to match explicit strings with. |
| delimiterList | <code>object</code> | Holds the list of delimiters. |
| delimiterMap | <code>object</code> | Holds an easy lookup map of delimiters. |

<a name="TokenizeThis+tokenize"></a>

### tokenizeThis.tokenize(input, forEachToken) ⇒ <code>\*</code>
Creates a Tokenizer, then immediately calls "tokenize".

**Kind**: instance method of [<code>TokenizeThis</code>](#TokenizeThis)  
**Returns**: <code>\*</code> - The new Tokenizer instance after being tokenized.  

| Param | Type | Description |
| --- | --- | --- |
| input | <code>string</code> | The string to scan for tokens. |
| forEachToken | <code>function</code> | Function to run over each token. |

<a name="sortTokenizableSubstrings"></a>

## sortTokenizableSubstrings(a, b) ⇒ <code>number</code>
Sorts the tokenizable substrings by their length DESC.

**Kind**: global function  
**Returns**: <code>number</code> - -1 if A is longer than B, 1 if B is longer than A, else 0.  

| Param | Type | Description |
| --- | --- | --- |
| a | <code>string</code> | Substring A |
| b | <code>string</code> | Substring B |

