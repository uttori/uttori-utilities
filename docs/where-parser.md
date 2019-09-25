<a name="SqlWhereParser"></a>

## SqlWhereParser
Parses the WHERE portion of an SQL-like string into an abstract syntax tree.
The tree is object-based, where each key is the operator, and its value is an array of the operands.
The number of operands depends on if the operation is defined as unary, binary, or ternary in the config.

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | The configuration object. |
| tokenizer | <code>TokenizeThis</code> | The tokenizer instance. |
| operators | <code>Object</code> | The operators from config converted to Operator objects. |


* [SqlWhereParser](#SqlWhereParser)
    * [new SqlWhereParser(config)](#new_SqlWhereParser_new)
    * _instance_
        * [.parse(sql, [evaluator])](#SqlWhereParser+parse) ⇒ <code>Object</code>
        * [.operatorPrecedenceFromValues(operatorValue1, operatorValue2)](#SqlWhereParser+operatorPrecedenceFromValues) ⇒ <code>Boolean</code>
        * [.getOperator(operatorValue)](#SqlWhereParser+getOperator) ⇒ <code>\*</code>
    * _static_
        * [.defaultEvaluator(operatorValue, operands)](#SqlWhereParser.defaultEvaluator) ⇒ <code>Object</code>

<a name="new_SqlWhereParser_new"></a>

### new SqlWhereParser(config)
Creates an instance of SqlWhereParser.


| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | A configuration object. |

**Example** *(Init SqlWhereParser)*  
```js
const parser = new SqlWhereParser();
const parsed = parser.parse(sql);
```
<a name="SqlWhereParser+parse"></a>

### sqlWhereParser.parse(sql, [evaluator]) ⇒ <code>Object</code>
Parse a SQL statement with an evaluator function.
Uses an implementation of the Shunting-Yard Algorithm: https://wcipeg.com/wiki/Shunting_yard_algorithm
See also: https://en.wikipedia.org/wiki/Shunting-yard_algorithm

**Kind**: instance method of [<code>SqlWhereParser</code>](#SqlWhereParser)  
**Returns**: <code>Object</code> - - The parsed query tree.  

| Param | Type | Description |
| --- | --- | --- |
| sql | <code>String</code> | Query string to process. |
| [evaluator] | <code>function</code> | Function to evaluate operators. |

<a name="SqlWhereParser+operatorPrecedenceFromValues"></a>

### sqlWhereParser.operatorPrecedenceFromValues(operatorValue1, operatorValue2) ⇒ <code>Boolean</code>
Returns the precedence order from two values.

**Kind**: instance method of [<code>SqlWhereParser</code>](#SqlWhereParser)  

| Param | Type |
| --- | --- |
| operatorValue1 | <code>String</code> \| <code>Symbol</code> | 
| operatorValue2 | <code>String</code> \| <code>Symbol</code> | 

<a name="SqlWhereParser+getOperator"></a>

### sqlWhereParser.getOperator(operatorValue) ⇒ <code>\*</code>
Returns the operator from the string or Symbol provided.

**Kind**: instance method of [<code>SqlWhereParser</code>](#SqlWhereParser)  

| Param | Type |
| --- | --- |
| operatorValue | <code>String</code> \| <code>Symbol</code> | 

<a name="SqlWhereParser.defaultEvaluator"></a>

### SqlWhereParser.defaultEvaluator(operatorValue, operands) ⇒ <code>Object</code>
A default fallback evaluator for the parse function.

**Kind**: static method of [<code>SqlWhereParser</code>](#SqlWhereParser)  

| Param | Type | Description |
| --- | --- | --- |
| operatorValue | <code>String</code> \| <code>Symbol</code> | The operator to evaluate. |
| operands | <code>Array</code> | The list of operands. |

