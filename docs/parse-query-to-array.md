<a name="parseQueryToArray"></a>

## parseQueryToArray(query)
Parse a query into an array-like structure, where each sub-array is its own group of parentheses in the query.

**Kind**: global function  

| Param | Type | Description |
| --- | --- | --- |
| query | <code>String</code> | The SQL-like string to be parsed. |

**Example** *(toArray(&#x27;SQL-LIKE-QUERY&#x27;))*  
```js
parseQueryToArray('(name = "First Last") AND (age >= (20 + 7))');
➜ [
   [
     'name',
     Operator('=', 2, 5), // '=',
     'First Last',
   ],
   Operator('AND', 2, 9), // 'AND',
   [
     'age',
     Operator('>=', 2, 5), // '>=',
     [
       20,
       Operator('+', 2, 4), // '+',
       7,
     ],
   ],
 ]
```
