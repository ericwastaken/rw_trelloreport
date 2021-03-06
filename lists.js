#!/usr/local/bin/node

/**
 * This is a utility script to provide the IDs of all the lists in a board as configured in board.id in the conf.js.
 *
 * See README.md for details about the config.
 *
 */

// Global overrides
// Use Bluebird Promises
global.Promise = require('bluebird');

// Imports
const path = require('path');
const TrelloApi = require(path.resolve(__dirname, './lib/TrelloApi.js'));
const ConfigHelper = require(path.resolve(__dirname, './lib/ConfigHelper.js'));
const CommandLineHelper = require(path.resolve(
  __dirname,
  './lib/CommandLineHelper.js'
));
const program = require('commander');
const assert = require('chai').assert;

// Setup our CLI options, specifically get --boardkey
CommandLineHelper.programSetupReport(
  program,
  `Returns information about all the lists in a Trello bard.`
);
assert(program.boardkey, `Unable to continue without boardkey.`);

// Config, with Absolute Paths for components
const conf = ConfigHelper.loadReportConfig(
  require(path.resolve(__dirname, './conf/conf.json')),
  __dirname,
  program.boardkey
);

const boardId = conf['board']['urlId'];

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
