const debug = require('debug')('Uttori.Utilities.Network');
const http = require('http');
const https = require('https');

/**
 * Execute a HTTP(S) request with options provided.
 *
 * @param {string|URL} url - URL to communicate with.
 * @param {object} options - Configuration to pass to `http(s).request()`.
 * @param {object} options.method - HTTP Method to use.
 * @param {object} context - Internal options and data used in the request.
 * @param {string} context.responseEncoding - Encoding to specify response should be parsed as.
 * @param {string|Buffer} context.data - Data to be sent for POST/PUT requests.
 * @param {Function} callback - Logic for responding to non-error responses.
 * @returns {Promise} a Promise of requested call
 * @example <caption>Network.request(url, options, context)</caption>
 * const output = await Network.base('https://api.domain.tld', { method: 'POST', data: '{ "user": 1 }' }, {}, callback);
 * @see {@link https://nodejs.org/api/http.html#http_http_request_options_callback|http_http_request_options_callback}
 * @see {@link https://nodejs.org/api/https.html#https_https_request_url_options_callback|https_https_request_url_options_callback}
 */
const base = (url, options, context, callback) => {
  debug('base:', url, options, context);
  return new Promise((resolve, reject) => {
    /* istanbul ignore next */
    const caller = String(url).startsWith('https') ? https : http;
    const request = caller.request(url, options, (response) => {
      if (context.responseEncoding) {
        response.setEncoding(context.responseEncoding);
      }

      let responseBody = '';
      response.on('data', (chunk) => {
        responseBody += chunk;
      });

      response.on('end', () => {
        debug('statusCode:', response.statusCode);
        debug('headers:', response.headers);
        response.responseBody = responseBody;
        debug('responseBody:', response.responseBody);
        const output = callback(response, options, context);
        resolve(output);
      });
    });

    /* istanbul ignore next */
    request.on('error', (error) => {
      debug('Error:', error);
      reject(error);
    });

    // If we are POST or PUT we write the data, assuming we have data.
    if ((options.method === 'POST' || options.method === 'PUT') && context.data) {
      request.write(context.data);
    }
    request.end();
  });
};

/**
 * Execute a HTTP(S) request with options provided and returns a parsed JSON response or a fallback.
 *
 * @param {string|URL} url - URL to communicate with.
 * @param {object} [options] - Configuration to pass to `http(s).request()`.
 * @param {object} [options.method] - HTTP Method to use.
 * @param {object} [context] - Internal options and data used in the request.
 * @param {string} [context.responseEncoding] - Encoding to specify response should be parsed as.
 * @param {string|Buffer} [context.data] - Data to be sent for POST/PUT requests.
 * @param {*} [context.fallback] - Data to return if no JSON is found.
 * @returns {Promise} a Promise of requested call
 * @example <caption>Network.request(url, options, context)</caption>
 * const json = await Network.json('https://api.domain.tld', { method: 'POST', data: '{ "user": 1 }' }, { fallback: '' });
 * @see {@link https://nodejs.org/api/http.html#http_http_request_options_callback|http_http_request_options_callback}
 * @see {@link https://nodejs.org/api/https.html#https_https_request_url_options_callback|https_https_request_url_options_callback}
 */
const json = (url, options = {}, context = {}) => {
  debug('json:', url, options, context);
  return base(url, options, context, (response) => {
    let output = context.fallback || undefined;
    if (response && response.responseBody) {
      try {
        output = JSON.parse(response.responseBody);
      } catch (error) {
        debug('Error Parsing JSON:', error);
      }
    }
    return output;
  });
};

/**
 * Execute a HTTP(S) request with options provided and returns the full response object.
 *
 * @param {string|URL} url - URL to communicate with.
 * @param {object} [options] - Configuration to pass to `http(s).request()`.
 * @param {object} [options.method] - HTTP Method to use.
 * @param {object} [context] - Internal options and data used in the request.
 * @param {string} [context.responseEncoding] - Encoding to specify response should be parsed as.
 * @param {string|Buffer} [context.data] - Data to be sent for POST/PUT requests.
 * @returns {Promise} a Promise of requested call
 * @example <caption>Network.request(url, options, context)</caption>
 * const { headers, responseBody } = await Network.raw('https://api.domain.tld', { method: 'POST', data: '{ "user": 1 }' });
 * @see {@link https://nodejs.org/api/http.html#http_http_request_options_callback|http_http_request_options_callback}
 * @see {@link https://nodejs.org/api/https.html#https_https_request_url_options_callback|https_https_request_url_options_callback}
 */
const raw = (url, options = {}, context = {}) => {
  debug('raw:', url, options, context);
  return base(url, options, context, (response) => response);
};

/**
 * Execute a HTTP(S) request with options provided and returns a response body or a fallback.
 *
 * @param {string|URL} url - URL to communicate with.
 * @param {object} [options] - Configuration to pass to `http(s).request()`.
 * @param {object} [options.method] - HTTP Method to use.
 * @param {object} [context] - Internal options and data used in the request.
 * @param {string} [context.responseEncoding] - Encoding to specify response should be parsed as.
 * @param {string|Buffer} [context.data] - Data to be sent for POST/PUT requests.
 * @param {*} [context.fallback] - Data to return if no responseBody is found.
 * @returns {Promise} a Promise of requested call
 * @example <caption>Network.request(url, options, context)</caption>
 * const responseBody = await Network.request('https://api.domain.tld', { method: 'POST', data: '{ "user": 1 }' }, { fallback: '' });
 * @see {@link https://nodejs.org/api/http.html#http_http_request_options_callback|http_http_request_options_callback}
 * @see {@link https://nodejs.org/api/https.html#https_https_request_url_options_callback|https_https_request_url_options_callback}
 */
const request = (url, options = {}, context = {}) => {
  debug('request:', url, options, context);
  return base(url, options, context, (response) => {
    if (response && response.responseBody) {
      return response.responseBody;
    }
    return context.fallback;
  });
};

module.exports = {
  base,
  json,
  raw,
  request,
};
