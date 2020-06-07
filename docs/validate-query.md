<a name="validateQuery"></a>

## validateQuery(query) ⇒ <code>object</code>
Validates and parses a SQL-like query structure.
Pass in: fields, table, conditions, order, limit as a query string:
`SELECT {fields} FROM {table} WHERE {conditions} ORDER BY {order} LIMIT {limit}`

**Kind**: global function  
**Returns**: <code>object</code> - The extrated and validated fields, table, where, order and limit properties.  

| Param | Type | Description |
| --- | --- | --- |
| query | <code>string</code> | The conditions on which a document should be returned. |

