## Functions

<dl>
<dt><a href="#base">base(url, options, context, callback)</a> ⇒ <code>Promise</code></dt>
<dd><p>Execute a HTTP(S) request with options provided.</p>
</dd>
<dt><a href="#json">json(url, [options], [context])</a> ⇒ <code>Promise</code></dt>
<dd><p>Execute a HTTP(S) request with options provided and returns a parsed JSON response or a fallback.</p>
</dd>
<dt><a href="#raw">raw(url, [options], [context])</a> ⇒ <code>Promise</code></dt>
<dd><p>Execute a HTTP(S) request with options provided and returns the full response object.</p>
</dd>
<dt><a href="#request">request(url, [options], [context])</a> ⇒ <code>Promise</code></dt>
<dd><p>Execute a HTTP(S) request with options provided and returns a response body or a fallback.</p>
</dd>
</dl>

<a name="base"></a>

## base(url, options, context, callback) ⇒ <code>Promise</code>
Execute a HTTP(S) request with options provided.

**Kind**: global function  
**Returns**: <code>Promise</code> - a Promise of requested call  
**See**

- [http_http_request_options_callback](https://nodejs.org/api/http.html#http_http_request_options_callback)
- [https_https_request_url_options_callback](https://nodejs.org/api/https.html#https_https_request_url_options_callback)


| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> \| <code>URL</code> | URL to communicate with. |
| options | <code>object</code> | Configuration to pass to `http(s).request()`. |
| options.method | <code>object</code> | HTTP Method to use. |
| context | <code>object</code> | Internal options and data used in the request. |
| context.responseEncoding | <code>string</code> | Encoding to specify response should be parsed as. |
| context.data | <code>string</code> \| <code>Buffer</code> | Data to be sent for POST/PUT requests. |
| callback | <code>function</code> | Logic for responding to non-error responses. |

**Example** *(Network.request(url, options, context))*  
```js
const output = await Network.base('https://api.domain.tld', { method: 'POST', data: '{ "user": 1 }' }, {}, callback);
```
<a name="json"></a>

## json(url, [options], [context]) ⇒ <code>Promise</code>
Execute a HTTP(S) request with options provided and returns a parsed JSON response or a fallback.

**Kind**: global function  
**Returns**: <code>Promise</code> - a Promise of requested call  
**See**

- [http_http_request_options_callback](https://nodejs.org/api/http.html#http_http_request_options_callback)
- [https_https_request_url_options_callback](https://nodejs.org/api/https.html#https_https_request_url_options_callback)


| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> \| <code>URL</code> | URL to communicate with. |
| [options] | <code>object</code> | Configuration to pass to `http(s).request()`. |
| [options.method] | <code>object</code> | HTTP Method to use. |
| [context] | <code>object</code> | Internal options and data used in the request. |
| [context.responseEncoding] | <code>string</code> | Encoding to specify response should be parsed as. |
| [context.data] | <code>string</code> \| <code>Buffer</code> | Data to be sent for POST/PUT requests. |
| [context.fallback] | <code>\*</code> | Data to return if no JSON is found. |

**Example** *(Network.request(url, options, context))*  
```js
const json = await Network.json('https://api.domain.tld', { method: 'POST', data: '{ "user": 1 }' }, { fallback: '' });
```
<a name="raw"></a>

## raw(url, [options], [context]) ⇒ <code>Promise</code>
Execute a HTTP(S) request with options provided and returns the full response object.

**Kind**: global function  
**Returns**: <code>Promise</code> - a Promise of requested call  
**See**

- [http_http_request_options_callback](https://nodejs.org/api/http.html#http_http_request_options_callback)
- [https_https_request_url_options_callback](https://nodejs.org/api/https.html#https_https_request_url_options_callback)


| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> \| <code>URL</code> | URL to communicate with. |
| [options] | <code>object</code> | Configuration to pass to `http(s).request()`. |
| [options.method] | <code>object</code> | HTTP Method to use. |
| [context] | <code>object</code> | Internal options and data used in the request. |
| [context.responseEncoding] | <code>string</code> | Encoding to specify response should be parsed as. |
| [context.data] | <code>string</code> \| <code>Buffer</code> | Data to be sent for POST/PUT requests. |

**Example** *(Network.request(url, options, context))*  
```js
const { headers, responseBody } = await Network.raw('https://api.domain.tld', { method: 'POST', data: '{ "user": 1 }' });
```
<a name="request"></a>

## request(url, [options], [context]) ⇒ <code>Promise</code>
Execute a HTTP(S) request with options provided and returns a response body or a fallback.

**Kind**: global function  
**Returns**: <code>Promise</code> - a Promise of requested call  
**See**

- [http_http_request_options_callback](https://nodejs.org/api/http.html#http_http_request_options_callback)
- [https_https_request_url_options_callback](https://nodejs.org/api/https.html#https_https_request_url_options_callback)


| Param | Type | Description |
| --- | --- | --- |
| url | <code>string</code> \| <code>URL</code> | URL to communicate with. |
| [options] | <code>object</code> | Configuration to pass to `http(s).request()`. |
| [options.method] | <code>object</code> | HTTP Method to use. |
| [context] | <code>object</code> | Internal options and data used in the request. |
| [context.responseEncoding] | <code>string</code> | Encoding to specify response should be parsed as. |
| [context.data] | <code>string</code> \| <code>Buffer</code> | Data to be sent for POST/PUT requests. |
| [context.fallback] | <code>\*</code> | Data to return if no responseBody is found. |

**Example** *(Network.request(url, options, context))*  
```js
const responseBody = await Network.request('https://api.domain.tld', { method: 'POST', data: '{ "user": 1 }' }, { fallback: '' });
```
