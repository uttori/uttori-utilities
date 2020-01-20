<a name="UttoriEvent"></a>

## UttoriEvent
Event class used in conjunction with the Event Dispatcher.

**Kind**: global class  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| label | <code>String</code> | The human readable identifier of the event. |
| callbacks | <code>Array.&lt;function()&gt;</code> | The functions to be executed when an event is fired. |


* [UttoriEvent](#UttoriEvent)
    * [new UttoriEvent(label)](#new_UttoriEvent_new)
    * [.register(callback)](#UttoriEvent+register)
    * [.unregister(callback)](#UttoriEvent+unregister)
    * [.validate(data, [context])](#UttoriEvent+validate) ⇒ <code>Promise</code>
    * [.filter(data, [context])](#UttoriEvent+filter) ⇒ <code>Promise</code>
    * [.fire(data, [context])](#UttoriEvent+fire)
    * [.fetch(data, [context])](#UttoriEvent+fetch) ⇒ <code>Array</code>

<a name="new_UttoriEvent_new"></a>

### new UttoriEvent(label)
Creates a new event UttoriEvent.


| Param | Type | Description |
| --- | --- | --- |
| label | <code>String</code> | The human readable identifier of the event. |

**Example** *(new UttoriEvent(label))*  
```js
const event = new UttoriEvent('event-label');
event.register(callback);
event.fire({ data });
```
<a name="UttoriEvent+register"></a>

### uttoriEvent.register(callback)
Add a function to an event that will be called when the event is fired.

**Kind**: instance method of [<code>UttoriEvent</code>](#UttoriEvent)  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | Function to be called when the event is fired. |

**Example**  
```js
event.register(callback);
```
<a name="UttoriEvent+unregister"></a>

### uttoriEvent.unregister(callback)
Remove a function from an event that would be called when the event is fired.

**Kind**: instance method of [<code>UttoriEvent</code>](#UttoriEvent)  

| Param | Type | Description |
| --- | --- | --- |
| callback | <code>function</code> | Function to be removed from the event. |

**Example**  
```js
event.unregister(callback);
```
<a name="UttoriEvent+validate"></a>

### uttoriEvent.validate(data, [context]) ⇒ <code>Promise</code>
Executes all the callbacks present on an event with passed in data and context.

**Kind**: instance method of [<code>UttoriEvent</code>](#UttoriEvent)  
**Returns**: <code>Promise</code> - - A Promise resolving to the result of the check, either true (invalid) or false (valid).  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>\*</code> | Data to be used, updated, or modified by event callbacks. |
| [context] | <code>Object</code> | Context to help with updating or modification of the data. |

**Example**  
```js
is_spam = await event.validate({ data }, this);
```
<a name="UttoriEvent+filter"></a>

### uttoriEvent.filter(data, [context]) ⇒ <code>Promise</code>
Executes all the callbacks present on an event with passed in data and context.

**Kind**: instance method of [<code>UttoriEvent</code>](#UttoriEvent)  
**Returns**: <code>Promise</code> - - A Promise resolving to the original input data, either modified or untouched.  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>\*</code> | Data to be used, updated, or modified by event callbacks. |
| [context] | <code>Object</code> | Context to help with updating or modification of the data. |

**Example**  
```js
output = await event.filter({ data }, this);
```
<a name="UttoriEvent+fire"></a>

### uttoriEvent.fire(data, [context])
Executes all the callbacks present on an event with passed in data and context.

**Kind**: instance method of [<code>UttoriEvent</code>](#UttoriEvent)  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>\*</code> | Data to be used, updated, or modified by event callbacks. |
| [context] | <code>Object</code> | Context to help with updating or modification of the data. |

**Example**  
```js
event.fire({ data }, this);
```
<a name="UttoriEvent+fetch"></a>

### uttoriEvent.fetch(data, [context]) ⇒ <code>Array</code>
Executes all the callbacks present on an event with passed in data and context and returns their output.

**Kind**: instance method of [<code>UttoriEvent</code>](#UttoriEvent)  
**Returns**: <code>Array</code> - - An array of the results from the fetch.  

| Param | Type | Description |
| --- | --- | --- |
| data | <code>\*</code> | Data to be used by event callbacks. |
| [context] | <code>Object</code> | Context to help with computing of the data. |

**Example**  
```js
output = await event.fetch({ data }, this);
```
