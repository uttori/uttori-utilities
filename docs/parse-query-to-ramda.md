<a name="parseQueryToRamda"></a>

## parseQueryToRamda()
Using default SQL tree output, iterate over that to convert to items to be checked group by group (AND, OR), prop by prop to filter functions.
Both `+` and `-` should be done in a pre-parser step or before the query is constructed, or after results are returned.

**Kind**: global function  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| ast | <code>Object</code> | The parsed output of SqlWhereParser to be filtered. |

**Example** *(parseQueryToRamda(ast))*  
```js
const filters = parseQueryToRamda(ast);
return R.filter(filters)(docs);
➜ [{ ... }, { ... }, ...]
```
