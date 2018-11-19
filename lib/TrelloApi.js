// Imports
const RequestHandler = require('./RequestHandler.js');

// Constants
const TRELLO_API_KEY = require('./../conf/secrets.json').trello_api.key;
const TRELLO_API_TOKEN = require('./../conf/secrets.json').trello_api.token;
const LIST_FIELD_LIST = require('./../conf/conf.json').board.card_fields;
const LIST_FIELD_LIST_SEARCH = require('./../conf/conf.json').board
  .card_fields_search;

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
   * Gets the cards that match a specific query (a string) and limited to
   * the boardIdsToSearchWithin (defaults to 'mine = all boards seen by the
   * authenticated user).
   *
   * Note, passing @username limits the search to cards that have the
   * particular user as a member!
   *
   * Returns an object with the property 'cards' holding an array of card similar to:
   * {
            "id": "5b279a0cec1b118b49dd447c",
            "name": "Functional Programming with Kotlin and Arrow [Massimo Carli, TE: Nick Winegar, FPE: Namrata Bandekar]",
            "shortUrl": "https://trello.com/c/bE9N4g6V",
            "due": "2018-11-25T23:00:00.000Z",
            "list": {
                "id": "5562debb52fed1ff1792fdef",
                "name": "Author: Writing",
                "closed": false,
                "idBoard": "5562debb52fed1ff1792fdec",
                "pos": 638975,
                "subscribed": false
            }
        }
   * Note, the exact list of properties in 'card' will depend on LIST_FIELD_LIST
   * which comes from the config. The 'id' and 'list' properties will always be as above!
   *
   * @param query
   * @param boardIdsToSearchWithin - a comma separated list of Board Ids to use in the search scope
   * @return {Promise<any>}
   */
  static getCardsForQuery(query, boardIdsToSearchWithin = null) {
    return new Promise((resolve, reject) => {
      const uri = `https://api.trello.com/1/search`;
      const headers = { 'Cache-Control': 'no-cache' };
      const qs = {
        idBoards: boardIdsToSearchWithin || 'mine',
        query: query,
        card_fields: LIST_FIELD_LIST_SEARCH,
        card_list: true,
        key: TRELLO_API_KEY,
        token: TRELLO_API_TOKEN,
      };

      RequestHandler.get(uri, headers, qs)
        .then(response => resolve(response.cards))
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
