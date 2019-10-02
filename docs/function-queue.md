<a name="FunctionQueue"></a>

## FunctionQueue
Queue functionality for function calling.

**Kind**: global class  
<a name="FunctionQueue.throttle"></a>

### FunctionQueue.throttle(max_requests_per_interval, interval, evenly_spaced)
**Kind**: static method of [<code>FunctionQueue</code>](#FunctionQueue)  

| Param | Type | Description |
| --- | --- | --- |
| max_requests_per_interval | <code>Number</code> | The number of calls to execute for a single interval. |
| interval | <code>Number</code> | The time between calls in ms. |
| evenly_spaced | <code>Boolean</code> | Determines if all requests should be evenly spaced. |

