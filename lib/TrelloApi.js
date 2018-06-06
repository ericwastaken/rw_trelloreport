// Imports
const RequestHandler = require('./RequestHandler.js');

// Constants
const TRELLO_API_KEY = require('./../conf/secrets.json').trello_api.key;
const TRELLO_API_TOKEN = require('./../conf/secrets.json').trello_api.token;
const LIST_FIELD_LIST = require('./../conf/conf.json').board.card_fields;

/**
 * A class to manage communicating with Trello.
 */
class TrelloApi {
  static getListsForBoard(boardId) {
    return new Promise((resolve, reject) => {
      const uri = `https://api.trello.com/1/boards/${boardId}/lists`;
      const headers = { 'Cache-Control': 'no-cache' };
      const qs = {
        key: TRELLO_API_KEY,
        token: TRELLO_API_TOKEN,
      };

      RequestHandler.get(uri, headers, qs)
        .then(response => resolve(response))
        .catch(error => reject(error));
    });
  }

  /**
   * Gets the cards for a given list.
   * Note, several items must be defined in /conf/ either conf.json or secrets.json:
   * - conf.json
   *  - 'card_fields' the card fields (from the Trello API object for 'card') to pull from Trello
   * - secrets.json
   *  - 'api_key', 'api_token' - the credentials to Trello with access to the board
   *
   * @param listId
   * @return {Promise<any>}
   */
  static getCardsForList(listId) {
    return new Promise((resolve, reject) => {
      const uri = `https://api.trello.com/1/lists/${listId}/cards`;
      const headers = { 'Cache-Control': 'no-cache' };
      const qs = {
        fields: LIST_FIELD_LIST,
        key: TRELLO_API_KEY,
        token: TRELLO_API_TOKEN,
      };

      RequestHandler.get(uri, headers, qs)
        .then(response => resolve(response))
        .catch(error => reject(error));
    });
  }

  /**
   * Returns the name of a given list.
   *
   * @param listId
   * @return {Promise<any>}
   */
  static getListName(listId) {
    return new Promise((resolve, reject) => {
      const uri = `https://api.trello.com/1/lists/${listId}`;
      const headers = { 'Cache-Control': 'no-cache' };
      const qs = {
        fields: LIST_FIELD_LIST,
        key: TRELLO_API_KEY,
        token: TRELLO_API_TOKEN,
      };

      RequestHandler.get(uri, headers, qs)
        .then(response => {
          // We're looking for the 'name' property in the response.
          if (response && response['name']) {
            resolve(response['name']);
          } else {
            reject(
              `{ "Error": "ListId '${listId}' did not return a 'name' property!" }`
            );
          }
        })
        .catch(error => reject(error));
    });
  }
}

module.exports = TrelloApi;
