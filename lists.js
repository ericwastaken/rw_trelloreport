#!/usr/local/bin/node

// Imports
const Promise = require('bluebird');
const TrelloApi = require('./lib/TrelloApi.js');

// Config
const conf = require('./conf/conf.json');

/**
 * This is autility script to provide the IDs of all the lists in a board as configured in board.id in the conf.js.
 * Syntax:
 *   `./lists.js`
 */

const boardId = conf.board.urlId;

if (!boardId) {
  console.log(`{ "Error": "conf.json does not have 'board.urlId'!"}`);
  process.exit(-1);
}

// ASSERT: We have a board.id, so we proceed

TrelloApi.getListsForBoard(boardId)
  .then(boardLists => {
    for (let listItem of boardLists) {
      console.log(` board id: ${listItem.idBoard}`);
      console.log(`list name: ${listItem.name}`);
      console.log(`       id: ${listItem.id}`);
      console.log(``);
    }
  })
  .catch(error => {
    console.log(error);
  });
