#!/usr/local/bin/node

// Imports
const ReportFormat = require('./lib/ReportFormat.js');
const Promise = require('bluebird');

// Constants
const conf = require('./conf/conf.json');

/**
 * Main Report Script
 *
 * This script will generate a report for a board and lists configured in ./conf/conf.json.
 *
 */

// Decide the lists to print based on the config. Note, the listItem ids must be defined in ./conf/conf.json
const listsToPrint = conf.board.lists;
// Set an array to hold our promises
let promiseArray = [];

// Loop over the lists to print and setup a promise for each. Note the syntax '() => PromiseFunc()' to prevent the promise from firing now!
for (let listItem of listsToPrint) {
  promiseArray.push(() => ReportFormat.printListReport(listItem));
}

// With all the promises in an array, now we want to fire each in sequence.
Promise.each(promiseArray, (aPromise, index, length) => {
  // Process the one promise (one at a time)
  return aPromise();
})
  .then(() => {
    // All done
  })
  .catch(error => {
    // We have some error, output information about it.
    console.log(`{ "Error": "`, error, `"}`);
  });
