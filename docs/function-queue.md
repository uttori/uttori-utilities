<a name="FunctionQueue"></a>

## FunctionQueue
Queue functionality for function calling.

**Kind**: global class  
<a name="FunctionQueue.throttle"></a>

### FunctionQueue.throttle(max_requests_per_interval, interval, [evenly_spaced]) ⇒ <code>function</code>
**Kind**: static method of [<code>FunctionQueue</code>](#FunctionQueue)  
**Returns**: <code>function</code> - A function that can enqueue items.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| max_requests_per_interval | <code>number</code> |  | The number of calls to execute for a single interval. |
| interval | <code>number</code> |  | The time between calls in ms. |
| [evenly_spaced] | <code>boolean</code> | <code>false</code> | Determines if all requests should be evenly spaced. |

