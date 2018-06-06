#!/usr/local/bin/node

// Imports
const Promise = require('bluebird');
const TrelloApi = require('./lib/TrelloApi.js');

/**
 * This is autility script to provide the IDs of all the lists in a board, passed as a command line argument.
 *
 */

if (!process.argv[2]) {
  console.log(
    `Error: BoardId not passed! Please pass the BoardId to see the lists on the board.`
  );
  process.exit(-1);
}

// ASSERT: We have an argument. We assume it's board id, and use it.

const boardId = process.argv[2];

TrelloApi.getListsForBoard(boardId)
  .then(boardLists => {
    for (let listItem of boardLists) {
      console.log(`list name: ${listItem.name}`);
      console.log(`       id: ${listItem.id}`);
      console.log(``);
    }
  })
  .catch(error => {
    console.log(error);
  });
