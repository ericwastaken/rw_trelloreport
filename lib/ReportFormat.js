// Imports
const TrelloApi = require('./TrelloApi.js');
const dateFormat = require('dateformat');
const dateMath = require('date-arithmetic');

// Constants
const conf = require('../conf/conf.json');

/**
 * A Class to manage the report output.
 */
class ReportFormat {
  /**
   * Outputs a 'Report' for the given listItem.
   * Note that several items must be defined in /conf/conf.json:
   * - the card output format in 'card_otput_format'
   * - the listItem name format in 'list_name_format'
   *
   * @param listItem
   * @return {Promise<any>}
   */
  static printListReport(listItem) {
    return new Promise((resolve, reject) => {
      // Output Buffer, which will be an array of strings
      let outputBuffer = [];
      // Set some values
      let cardOutputFormat = '`' + conf.board.card_otput_format + '`';
      let listNameOutputFormat = '`' + conf.board.list_name_format + '`';
      let messageForEmptyList = conf.board.empty_list_placeholder;
      // And set a flag so we can detect that all cards filtered out and still output the "no tutorials" message.
      let atLeastOneCard = false;

      // Do our work
      TrelloApi.getListName(listItem['id'])
        .then(listName => {
          // listName is expected in listNameOutputFormat defined in ./conf/conf.json
          this.reportOutput(eval(listNameOutputFormat), outputBuffer);
          return TrelloApi.getCardsForList(listItem['id']);
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
   * Output a string to the desired output.
   * This is console.log for now, but can be extended to file, etc.
   *
   * @param outputString
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
