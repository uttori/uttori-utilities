## Functions

<dl>
<dt><a href="#debugHelper">debugHelper(value)</a> ⇒ <code>string</code></dt>
<dd><p>Pretty format a value as JSON or a joined array.</p>
</dd>
<dt><a href="#parseQueryToRamda">parseQueryToRamda(ast)</a> ⇒ <code>Array</code></dt>
<dd><p>Using default SQL tree output, iterate over that to convert to items to be checked group by group (AND, OR), prop by prop to filter functions.
Both <code>+</code> and <code>-</code> should be done in a pre-parser step or before the query is constructed, or after results are returned.</p>
</dd>
</dl>

<a name="debugHelper"></a>

## debugHelper(value) ⇒ <code>string</code>
Pretty format a value as JSON or a joined array.

**Kind**: global function  
**Returns**: <code>string</code> - The value in a cleaner string format.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value to be converted to a nice string. |

**Example** *(parseQueryToRamda(ast))*  
```js
debugHelper(['one','two']);
➜ '["one", "two"]'
```
<a name="parseQueryToRamda"></a>

## parseQueryToRamda(ast) ⇒ <code>Array</code>
Using default SQL tree output, iterate over that to convert to items to be checked group by group (AND, OR), prop by prop to filter functions.
Both `+` and `-` should be done in a pre-parser step or before the query is constructed, or after results are returned.

**Kind**: global function  
**Returns**: <code>Array</code> - The collected set of Ramda filter functions.  

| Param | Type | Description |
| --- | --- | --- |
| ast | <code>object</code> | The parsed output of SqlWhereParser to be filtered. |

**Example** *(parseQueryToRamda(ast))*  
```js
const filters = parseQueryToRamda(ast);
return R.filter(filters)(docs);
➜ [{ ... }, { ... }, ...]
```
