#!/usr/local/bin/node

// Imports
const ReportFormat = require('./lib/ReportFormat.js');
const HtmlOutput = require('./lib/HtmlOutput.js');
const Promise = require('bluebird');

// Config
const conf = require('./conf/conf.json');

/**
 * Main Report Script
 *
 * This script will generate a report for a search using the user's current scope
 * (all the organizations/boards that the user has access to).
 *
 * If the search term starts with '@', then the search will be for a "member" on
 * cards.
 *
 * When outputFormat is set to html or rtf, we expect the conf 'card_output_format'
 * to contain markdown which will then converted into html/rtf.
 *
 */

// Output format (html, rtf, text, or anything else for text)
let outputFormat = 'text';
if (conf.board && conf.board.output) {
  outputFormat = conf.board.output.outputFormat || 'text';
}

// Decide the lists to print based on the config. Note, the listItem ids must be defined in ./conf/conf.json
const boardToSearch = conf.board.id;

if (!boardToSearch) {
  console.log(`{ "Error": "conf.json does not have 'board.id'!"}`);
  process.exit(-1);
}

const searchQuery = process.argv[2];
if (!searchQuery) {
  console.log(
    `{ "Error": "Please pass the string to search as an argument to this script!"}`
  );
  process.exit(-1);
}

// Set an array to hold our promises
let promiseArray = [];
let promiseResults = [];

// Execute the search
promiseArray.push(() => ReportFormat.printSearchReport(searchQuery, boardToSearch));

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
