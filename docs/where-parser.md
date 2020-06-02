<a name="SqlWhereParser"></a>

## SqlWhereParser
Parses the WHERE portion of an SQL-like string into an abstract syntax tree.
The tree is object-based, where each key is the operator, and its value is an array of the operands.
The number of operands depends on if the operation is defined as unary, binary, or ternary in the config.

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | The configuration object. |
| tokenizer | <code>TokenizeThis</code> | The tokenizer instance. |
| operators | <code>object</code> | The operators from config converted to Operator objects. |


* [SqlWhereParser](#SqlWhereParser)
    * [new SqlWhereParser(config)](#new_SqlWhereParser_new)
    * _instance_
        * [.parse(sql, [evaluator])](#SqlWhereParser+parse) ⇒ <code>object</code>
        * [.operatorPrecedenceFromValues(operatorValue1, operatorValue2)](#SqlWhereParser+operatorPrecedenceFromValues) ⇒ <code>boolean</code>
        * [.getOperator(operatorValue)](#SqlWhereParser+getOperator) ⇒ <code>\*</code>
    * _static_
        * [.defaultEvaluator(operatorValue, operands)](#SqlWhereParser.defaultEvaluator) ⇒ <code>Array</code> \| <code>object</code>

<a name="new_SqlWhereParser_new"></a>

### new SqlWhereParser(config)
Creates an instance of SqlWhereParser.


| Param | Type | Description |
| --- | --- | --- |
| config | <code>object</code> | A configuration object. |

**Example** *(Init SqlWhereParser)*  
```js
const parser = new SqlWhereParser();
const parsed = parser.parse(sql);
```
<a name="SqlWhereParser+parse"></a>

### sqlWhereParser.parse(sql, [evaluator]) ⇒ <code>object</code>
Parse a SQL statement with an evaluator function.
Uses an implementation of the Shunting-Yard Algorithm: https://wcipeg.com/wiki/Shunting_yard_algorithm
See also: https://en.wikipedia.org/wiki/Shunting-yard_algorithm

**Kind**: instance method of [<code>SqlWhereParser</code>](#SqlWhereParser)  
**Returns**: <code>object</code> - - The parsed query tree.  

| Param | Type | Description |
| --- | --- | --- |
| sql | <code>string</code> | Query string to process. |
| [evaluator] | <code>function</code> | Function to evaluate operators. |

<a name="SqlWhereParser+operatorPrecedenceFromValues"></a>

### sqlWhereParser.operatorPrecedenceFromValues(operatorValue1, operatorValue2) ⇒ <code>boolean</code>
Returns the precedence order from two values.

**Kind**: instance method of [<code>SqlWhereParser</code>](#SqlWhereParser)  
**Returns**: <code>boolean</code> - That operatorValue2 precedence is less than or equal to the precedence of operatorValue1.  

| Param | Type | Description |
| --- | --- | --- |
| operatorValue1 | <code>string</code> \| <code>symbol</code> | First operator. |
| operatorValue2 | <code>string</code> \| <code>symbol</code> | Second operator. |

<a name="SqlWhereParser+getOperator"></a>

### sqlWhereParser.getOperator(operatorValue) ⇒ <code>\*</code>
Returns the operator from the string or Symbol provided.

**Kind**: instance method of [<code>SqlWhereParser</code>](#SqlWhereParser)  
**Returns**: <code>\*</code> - The operator from the list of operators.  

| Param | Type | Description |
| --- | --- | --- |
| operatorValue | <code>string</code> \| <code>symbol</code> | The operator. |

<a name="SqlWhereParser.defaultEvaluator"></a>

### SqlWhereParser.defaultEvaluator(operatorValue, operands) ⇒ <code>Array</code> \| <code>object</code>
A default fallback evaluator for the parse function.

**Kind**: static method of [<code>SqlWhereParser</code>](#SqlWhereParser)  
**Returns**: <code>Array</code> \| <code>object</code> - Either comma seperated values concated, or an object with the key of the operator and operands as the value.  

| Param | Type | Description |
| --- | --- | --- |
| operatorValue | <code>string</code> \| <code>symbol</code> | The operator to evaluate. |
| operands | <code>Array</code> | The list of operands. |

