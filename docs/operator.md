## Classes

<dl>
<dt><a href="#Operator">Operator</a></dt>
<dd><p>A wrapper class around operators to distinguish them from regular tokens.</p>
</dd>
</dl>

## Constants

<dl>
<dt><a href="#OPERATOR_UNARY_MINUS">OPERATOR_UNARY_MINUS</a></dt>
<dd><p>To distinguish between the binary minus and unary.</p>
</dd>
<dt><a href="#OPERATOR_TYPE_UNARY">OPERATOR_TYPE_UNARY</a></dt>
<dd><p>Number of operands in a unary operation.</p>
</dd>
<dt><a href="#OPERATOR_TYPE_BINARY">OPERATOR_TYPE_BINARY</a></dt>
<dd><p>Number of operands in a binary operation.</p>
</dd>
<dt><a href="#OPERATOR_TYPE_TERNARY">OPERATOR_TYPE_TERNARY</a></dt>
<dd><p>Number of operands in a ternary operation.</p>
</dd>
</dl>

<a name="Operator"></a>

## Operator
A wrapper class around operators to distinguish them from regular tokens.

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value. |
| type | <code>\*</code> | The type of operator. |
| precedence | <code>Number</code> | Priority to sort the operators with. |


* [Operator](#Operator)
    * [new Operator(value, type, precedence)](#new_Operator_new)
    * _instance_
        * [.toJSON()](#Operator+toJSON) ⇒ <code>\*</code>
        * [.toString()](#Operator+toString) ⇒ <code>String</code>
    * _static_
        * [.type(value)](#Operator.type) ⇒ <code>\*</code>

<a name="new_Operator_new"></a>

### new Operator(value, type, precedence)
Creates an instance of Operator.


| Param | Type | Description |
| --- | --- | --- |
| value | <code>\*</code> | The value. |
| type | <code>\*</code> | The type of operator. |
| precedence | <code>Number</code> | Priority to sort the operators with. |

**Example** *(Init TokenizeThis)*  
```js
const op = new Operator(value, type, precedence);
```
<a name="Operator+toJSON"></a>

### operator.toJSON() ⇒ <code>\*</code>
Returns the value as is for JSON.

**Kind**: instance method of [<code>Operator</code>](#Operator)  
**Returns**: <code>\*</code> - value.  
<a name="Operator+toString"></a>

### operator.toString() ⇒ <code>String</code>
Returns the value as its string format.

**Kind**: instance method of [<code>Operator</code>](#Operator)  
**Returns**: <code>String</code> - String representation of value.  
<a name="Operator.type"></a>

### Operator.type(value) ⇒ <code>\*</code>
Returns a type for a given string.

**Kind**: static method of [<code>Operator</code>](#Operator)  
**Returns**: <code>\*</code> - Either number of parameters or Unary Minus Symbol.  

| Param | Type | Description |
| --- | --- | --- |
| value | <code>String</code> | The type to lookup. |

<a name="OPERATOR_UNARY_MINUS"></a>

## OPERATOR\_UNARY\_MINUS
To distinguish between the binary minus and unary.

**Kind**: global constant  
<a name="OPERATOR_TYPE_UNARY"></a>

## OPERATOR\_TYPE\_UNARY
Number of operands in a unary operation.

**Kind**: global constant  
<a name="OPERATOR_TYPE_BINARY"></a>

## OPERATOR\_TYPE\_BINARY
Number of operands in a binary operation.

**Kind**: global constant  
<a name="OPERATOR_TYPE_TERNARY"></a>

## OPERATOR\_TYPE\_TERNARY
Number of operands in a ternary operation.

**Kind**: global constant  
