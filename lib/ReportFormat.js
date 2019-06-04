// Imports
const TrelloApi = require('./TrelloApi.js');
const dateFormat = require('dateformat');
const dateMath = require('date-arithmetic');
const Promise = require('bluebird');

/**
 * A Class to manage the report output.
 */
class ReportFormat {
  /**
   * Outputs a 'Report' for the given listItem.
   * Note that several items must be defined in /conf/conf.json:
   * - the card output format in 'card_output_format'
   * - the listItem name format in 'list_name_format'
   *
   * @param listItem
   * @param conf - the user config
   * @return {Promise<any>}
   */
  static printListReport(listItem, conf) {
    return new Promise((resolve, reject) => {
      // Output Buffer, which will be an array of strings
      let outputBuffer = [];
      // Set some values
      // In the conf.json, we had a typo, so that's why we're checking two values
      // below for cardOutputFormat
      let cardOutputFormat =
        conf.board['card_otput_format'] || conf.board['card_output_format'];
      cardOutputFormat = '`' + cardOutputFormat + '`';
      let listNameOutputFormat = '`' + conf.board['list_name_format'] + '`';
      let messageForEmptyList = conf.board['empty_list_placeholder'];
      // And set a flag so we can detect that all cards filtered out and still output the "no tutorials" message.
      let atLeastOneCard = false;
      // Set aside a method level variable to hold the list name (so we can use it at the 'card' level
      let listName;

      // Do our work
      TrelloApi.getListName(listItem['id'])
        .then(listNameResponse => {
          listName = listNameResponse;
          // listName is expected in listNameOutputFormat defined in ./conf/conf.json
          this.reportOutput(eval(listNameOutputFormat), outputBuffer);
          return TrelloApi.getCardsForList(
            listItem['id'],
            conf.board['card_fields']
          );
        })
        .then(listCards => {
          // Iterate over the cards
          for (let card of listCards) {
            // We figure out if we should include/exclude this card
            // By excluded name in the config:
            if (
              listItem['excludeNames'] &&
              Array.isArray(listItem['excludeNames']) &&
              listItem['excludeNames'].includes(card['name'])
            ) {
              // this card is excluded, so we return an empty Promise so that the next step does nothing
              continue;
            }
            // By excluded tryout in the config:
            if (
              listItem['excludeTryouts'] &&
              card['name'].toLowerCase().includes('tryout')
            ) {
              // card is for a tryout, and we're excluding tryouts for this list
              continue;
            }
            // ASSERT: Card is not excluded by name or tryout

            // Flag that we have at least 1
            atLeastOneCard = true;

            // Are we pulling due date? If so, let's format that.
            let dateString = '';
            if (card['due']) {
              // If the tutorial was due before today, we output 'overdue' for the date label.
              if (
                dateMath.endOf(Date.parse(card['due']), 'day') <
                dateMath.startOf(Date.now(), 'day')
              ) {
                dateString = `**Overdue: ${dateFormat(
                  card['due'],
                  'shortDate'
                )}**`;
              } else {
                // Otherwise, due date is in the future (or today) so we just output 'due' for the date label.
                dateString = `Due: ${dateFormat(card['due'], 'shortDate')}`;
              }
            }
            // TODO: Implement a conditional to handle the actual construction of the card line. For HTML, should use Pug/Jade. For Text can use "as is".
            // card is expected in cardOutputFormat defined in ./conf/conf.json
            this.reportOutput(eval(cardOutputFormat), outputBuffer);
          }
          // Did we not output at least 1 tutorial card? If we did not, we print a placeholder message.
          if (!atLeastOneCard) {
            this.reportOutput(messageForEmptyList, outputBuffer);
          }
          // Al done, we can end this promise - but resolve with the outputBuffer, as a String.
          resolve(outputBuffer.join(''));
        })
        .catch(error => reject(error));
    });
  }

  /**
   * Outputs a 'Report' for the given search term.
   * Note that several items must be defined in /conf/conf.json:
   * - the card output format in 'card_output_format' (shared with the list report)
   *
   * @param searchQueries - a string to search for. If it starts with '@', it will be treated as a username
   * @param boardId - the id of the board to search within
   * @param modifiers - cli modifiers that affect the results
   * @param conf - the user config
   * @return {Promise<any>}
   */
  static printSearchReport(searchQueries, boardId, modifiers, conf) {
    return new Promise((resolve, reject) => {
      // Output Buffer, which will be an array of strings
      let outputBuffer = [];
      // Set some values
      // In the conf.json, we had a typo, so that's why we're checking two values
      // below for cardOutputFormat
      let cardOutputFormat =
        conf.board['card_otput_format_search'] ||
        conf.board['card_output_format_search'];
      cardOutputFormat = '`' + cardOutputFormat + '`';
      let messageForEmptyList = '\n*No items matched!*';

      // Set an array to hold our promises
      let promiseArray = [];
      let promiseResults = [];

      for (let searchQuery of searchQueries) {
        // Setup the individual search promises
        promiseArray.push(() =>
          this.getOutputForOneQuery(
            searchQuery,
            boardId,
            modifiers,
            cardOutputFormat,
            messageForEmptyList,
            conf
          )
        );
      }

      // With all the promises in an array, now we want to fire each in sequence and capture results
      Promise.each(promiseArray, (aPromise, index, length) => {
        // Process the one promise (one at a time)
        return aPromise().then(outputString => {
          // Save our string from the promise step into the promiseResults array so we can process it later
          promiseResults[index] = `${outputString}\n\n`;
        });
      })
        .then(() => {
          // With all the promises executed, concatenate all the individual results

          // Were we asked to sort by "task count"?
          if (
            modifiers.sortByTaskCountLessFirst ||
            modifiers.sortByTaskCountMoreFirst
          ) {
            // Yes, we need to first sort by Task Count
            // But which order? Less First? More First?
            // Set aside a variable to hold our compare function (a lambda)
            let orderCompare;
            // Set the compare function based on which order we're going for
            if (modifiers.sortByTaskCountLessFirst) {
              // Set the compare lambda to "less lines first"
              orderCompare = (lhs, rhs) => {
                if (lhs < rhs) {
                  return -1;
                } else if (lhs > rhs) {
                  return 1;
                } else {
                  return 0;
                }
              };
            } else {
              // Set the compare to "more lines first"
              orderCompare = (lhs, rhs) => {
                if (lhs > rhs) {
                  return -1;
                } else if (lhs < rhs) {
                  return 1;
                } else {
                  return 0;
                }
              };
            }

            // Assert: We have a lambda in orderCompare that will sort as needed!

            // Now, sort by using said Lambda inside the comparator
            promiseResults.sort((lhs, rhs) => {
              const lhsLines = (lhs.match(/\n/g) || '').length + 1;
              const rhsLines = (rhs.match(/\n/g) || '').length + 1;
              return orderCompare(lhsLines, rhsLines);
            });
          }

          // Concatenate the array results into a single string (newlines included for pretty output)
          resolve(promiseResults.join(''));
        })
        .catch(error => {
          // We have some error, so we reject with it
          reject(error);
        });
    });
  }

  static getOutputForOneQuery(
    searchQuery,
    boardId,
    modifiers,
    cardOutputFormat,
    messageForEmptyList,
    conf
  ) {
    return new Promise((resolve, reject) => {
      // Output Buffer, which will be an array of strings
      let outputBuffer = [];
      // And set a flag so we can detect that all cards filtered out and still output the "no tutorials" message.
      let atLeastOneCard = false;
      // Do our work
      // If the query is for a username, we pull the full name
      let startPromise;
      if (searchQuery.startsWith('@')) {
        // The query is for a username, so let's try to get the full name
        startPromise = TrelloApi.getFullNameForUsername(searchQuery);
      } else {
        // The query is not a username, so we just resolve with nothing
        startPromise = Promise.resolve();
      }
      startPromise
        .then(userFullName => {
          // Output the Query header (including the full user name if we have one)
          this.reportOutput(
            `**Results for '${searchQuery}'${
              userFullName ? ` (${userFullName})` : ``
            }**`,
            outputBuffer
          );
          return TrelloApi.getCardsForQuery(
            searchQuery,
            conf.board['card_fields_search'],
            boardId
          );
        })
        .then(listCards => {
          // Iterate over the cards
          for (let card of listCards) {
            if (
              modifiers.excludeDone &&
              card['list']['name'].toLowerCase() === 'done'
            ) {
              // Skipping a 'Done' card
              continue;
            }
            // Flag that we have at least 1
            atLeastOneCard = true;
            // Are we pulling due date? If so, let's format that.
            let dateString = '';
            if (card['due']) {
              dateString = `Due: ${dateFormat(card['due'], 'shortDate')}`;
            }
            // TODO: Implement a conditional to handle the actual construction of the card line. For HTML, should use Pug/Jade. For Text can use "as is".
            // card is expected in cardOutputFormat defined in ./conf/conf.json
            this.reportOutput(eval(cardOutputFormat), outputBuffer);
          }
          // Did we not output at least 1 tutorial card? If we did not, we print a placeholder message.
          if (!atLeastOneCard) {
            this.reportOutput(messageForEmptyList, outputBuffer);
          }
          // Al done, we can end this promise - but resolve with the outputBuffer, as a String.
          resolve(outputBuffer.join(''));
        })
        .catch(error => reject(error));
    });
  }

  /**
   * Output a string to the desired output.
   * This is console.log for now, but can be extended to file, etc.
   *
   * @param outputString
   * @param outputBuffer
   */
  static reportOutput(outputString, outputBuffer) {
    outputBuffer.push(outputString);
  }
}

module.exports = ReportFormat;

/**
 * Global Helpers
 */

/**
 * This is a simple formatter that inspects 'input' looking for markdown
 * syntax in the first character and if it finds it, escapes it so that
 * the markdown processor does not process it.
 *
 * TODO: Remove the markdown escape once we have a different render for HTML (above).
 *
 * @param input
 */
function escapeMarkdown(input) {
  let output;

  // Match on -start with one or two digits and a period-,
  // capture the number so we can drop it back into a replacement
  const testForOLLI = new RegExp('^(\\d\\d?)\\.');
  // Replace the starting number(s) and period with '99\.'
  // (the same one or two numbers and '\.' an escaped period)
  output = input.replace(testForOLLI, '$1\\.');

  // Return the processed output
  return output;
}
