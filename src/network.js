const debug = require('debug')('Uttori.Utilities.Network');
const http = require('http');
const https = require('https');

/**
 * Execute a HTTP(S) request with options provided.
 * @param {String|URL} url - URL to communicate with.
 * @param {Object} options - Configuration to pass to `http(s).request()`.
 * @param {Object} [context] - Internal options and data used in the request.
 * @param {String} [context.responseEncoding] - Encoding to specify response should be parsed as.
 * @param {Boolean} [context.parseResponseBody] - Flag to determine if the returned response is parsed as JSON.
 * @param {String|Buffer} [context.data] - Data to be sent for POST/PUT requests.
 * @return {Promise} a Promise of requested call
 * @example <caption>Network.request(url, options, context)</caption>
 * const json = await Network.request('https://api.domain.tld', { method: 'POST', data: '{ "user": 1 }' }, { parseResponseBody: true });
 * @external https://nodejs.org/api/http.html#http_http_request_options_callback
 * @external https://nodejs.org/api/https.html#https_https_request_url_options_callback
 */
const requester = (url, options = {}, context = {}) => {
  debug('request:', url, options, context);
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
        let output = responseBody;
        if (context.parseResponseBody) {
          output = JSON.parse(responseBody);
        }
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

module.exports = {
  request: requester,
};
