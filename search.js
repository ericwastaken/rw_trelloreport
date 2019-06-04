#!/usr/local/bin/node

// Global overrides
// Use Bluebird Promises
global.Promise = require('bluebird');

// Imports
const path = require('path');
const ReportFormat = require(path.resolve(__dirname, './lib/ReportFormat.js'));
const HtmlOutput = require(path.resolve(__dirname, './lib/HtmlOutput.js'));
const ConfigHelper = require(path.resolve(__dirname, './lib/ConfigHelper.js'));

// Config, with Absolute Paths for components
const conf = ConfigHelper.loadReportConfig(
  require(path.resolve(__dirname, './conf/conf.json')),
  __dirname
);

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

const arguments = process.argv[2];
if (!arguments) {
  console.log(
    `{ "Error": "Please pass one or more strings to search as an argument to this script!"}`
  );
  process.exit(-1);
}

// How many CLI queries were we passed
let queries = [];
let modifiers = {
  excludeDone: false,
};

for (let j = 2; j < process.argv.length; j++) {
  let param = process.argv[j];
  if (param.startsWith('--')) {
    // it's a cli modifier, so set it
    if (param.toLowerCase() === '--excludedone') {
      modifiers.excludeDone = true;
    }
    if (param.toLowerCase() === '--sortbytaskcount-lessfirst') {
      modifiers.sortByTaskCountLessFirst = true;
    }
    if (param.toLowerCase() === '--sortbytaskcount-morefirst') {
      modifiers.sortByTaskCountMoreFirst = true;
    }
  } else {
    // it's a query so add it to that array
    queries.push(process.argv[j]);
  }
}
// Set an array to hold our promises
let promiseArray = [];
let promiseResults = [];

// Execute the search
promiseArray.push(() =>
  ReportFormat.printSearchReport(queries, boardToSearch, modifiers, conf)
);

// With all the promises in an array, now we want to fire each in sequence and capture results
Promise.each(promiseArray, (aPromise, index, length) => {
  // Process the one promise (one at a time)
  return aPromise().then(outputString => {
    // Save our string from the promise step into the promiseResults array so we can process it later
    promiseResults[index] = outputString;
  });
})
  .then(() => {
    if (outputFormat === 'html') {
      HtmlOutput.finalOutput(promiseResults, conf, __dirname);
    } else {
      console.log(promiseResults.join(''));
    }
  })
  .catch(error => {
    // We have some error, outputFormat information about it.
    console.log(`{ "Error": "`, error, `"}`);
  });
