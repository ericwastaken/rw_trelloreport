#!/usr/local/bin/node

// Global overrides
// Use Bluebird Promises
global.Promise = require('bluebird');

// Imports
const path = require('path');
const ReportFormat = require(path.resolve(__dirname, './lib/ReportFormat.js'));
const HtmlOutput = require(path.resolve(__dirname, './lib/HtmlOutput.js'));
const ConfigHelper = require(path.resolve(__dirname, './lib/ConfigHelper.js'));
const program = require('commander');
const CommandLineHelper = require(path.resolve(
  __dirname,
  './lib/CommandLineHelper.js'
));
const assert = require('chai').assert;

// Setup our CLI options, specifically get --boardkey
CommandLineHelper.programSetupForBoardKey(
  program,
  `Creates a report from a Trello bard.`
);
assert(program.boardkey,`Unable to continue without boardkey.`);

// Config, with Absolute Paths for components
const conf = ConfigHelper.loadReportConfig(
  require(path.resolve(__dirname, './conf/conf.json')),
  __dirname,
  program.boardkey
);

/**
 * Main Report Script
 *
 * This script will generate a report for a board and lists configured in ./conf/conf.json.
 *
 * When outputFormat is set to html or rtf, we expect the conf 'card_output_format' and 'list_name_format'
 * to contain markdown which will then converted into html/rtf.
 *
 */

// Output format (html, rtf, text, or anything else for text)
let outputFormat = 'text';
if (conf.board && conf.board.output) {
  outputFormat = conf.board.output.outputFormat || 'text';
}

// Decide the lists to print based on the config. Note, the listItem ids must be defined in ./conf/conf.json
const listsToPrint = conf.board.lists;

// Set an array to hold our promises
let promiseArray = [];
let promiseResults = [];

// Loop over the lists to print and setup a promise for each. Note the syntax '() => PromiseFunc()' to prevent the promise from firing now!
for (let listItem of listsToPrint) {
  promiseArray.push(() => ReportFormat.printListReport(listItem, conf));
}

// With all the promises in an array, now we want to fire each in sequence and capture results
Promise.each(promiseArray, (aPromise, index, length) => {
  // Process the one promise (one at a time)
  return aPromise().then(outputString => {
    // Save our string from the promise step into the promiseResults array so we can process it later
    promiseResults[index] = outputString;
  });
})
  .then(() => {
    switch (outputFormat) {
      case 'html':
        HtmlOutput.finalOutput(promiseResults, conf);
        break;
      default:
        // Otherwise, just outputFormat raw, but as a string with no delimiters
        console.log(promiseResults.join(''));
    }
  })
  .catch(error => {
    // We have some error, outputFormat information about it.
    console.log(`{ "Error": "`, error, `"}`);
  });
