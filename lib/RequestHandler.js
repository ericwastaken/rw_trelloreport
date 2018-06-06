const rp = require('request-promise');

/**
 * A class to handle http requests
 */
class RequestHandler {

  /**
   * Perform a GET request against the given uri withe the passed headers and qs (query string).
   *
   * @param uri
   * @param headers
   * @param qs
   * @return {Promise<any>}
   */
  static get(uri, headers, qs) {

    return new Promise((resolve,reject) => {
      const options = {
        method: 'GET',
        uri: uri,
        qs: qs,
        headers: headers,
        json: true,
      };

      rp(options).then(response => {
        resolve(response)
      }).catch(error => reject(error));
    })
  }

}

module.exports = RequestHandler;
