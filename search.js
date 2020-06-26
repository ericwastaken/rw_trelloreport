#!/usr/local/bin/node

/**
 * Main Search Script
 *
 * This script will search then generate a report for a search.
 *
 * See README.md for details about the config.
 *
 */

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

// Bring in Stdin
const getStdin = require('./lib/StdInHelper.js');
const stringArgv = require('string-argv');

// Setup our CLI options, specifically get --boardkey
CommandLineHelper.programSetupForSearch(
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

if (program.excludeDone && program.onlyDone) {
    console.log(
    `{ "Error": "The options --excludeDone and --onlyDone must not be used together!"}`
  );
  process.exit(-1);
}

// ASSERT: We do not have --excludeDone && --onlyDone together!

// How many CLI queries were we passed
let queries = [];
let modifiers = {
  excludeDone: false,
  onlyDone: false,
};

// Set modifiers from commander command line arguments
if (program.excludeDone) {
  modifiers.excludeDone = true;
}
if (program.onlyDone) {
  modifiers.onlyDone = true;
}
if (program.sortbytaskcountLessfirst) {
  modifiers.sortByTaskCountLessFirst = true;
}
if (program.sortbytaskcountMorefirst) {
  modifiers.sortByTaskCountMoreFirst = true;
}

// Set the queries from the command line. Note that Commander automatically extracts
// command line arguments that start with '-' or '--'
for (let j = 0; j < program.args.length; j++) {
  queries.push(program.args[j]);
}

// Process any stdin queries (we only support queries via stdin)
// Then proceed with the searches
getStdin()
  .then(stdin => {
    let stdinArray = stringArgv.parseArgsStringToArgv(stdin);
    // Set the queries from stdin.
    for (let j = 0; j < stdinArray.length; j++) {
      queries.push(stdinArray[j]);
    }
  })
  .then(() => {
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
          HtmlOutput.finalOutput(promiseResults, conf, __dirname, program);
        } else {
          console.log(promiseResults.join(''));
        }
      })
      .catch(error => {
        // We have some error, outputFormat information about it.
        console.log(`{ "Error": "`, error, `"}`);
      });
  });
