#!/usr/local/bin/node

// Imports
const path = require('path');
const ReportFormat = require(path.resolve(__dirname, './lib/ReportFormat.js'));
const HtmlOutput = require(path.resolve(__dirname, './lib/HtmlOutput.js'));
const PathHelper = require(path.resolve(__dirname, './lib/PathHelper.js'));
const Promise = require('bluebird');

// Config, with Absolute Paths for components
const conf = PathHelper.absolutePathConfig(
  require(path.resolve(__dirname, './conf/conf.json')),
  __dirname
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
