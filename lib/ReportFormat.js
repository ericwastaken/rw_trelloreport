// Imports
const TrelloApi = require('./TrelloApi.js');
const dateFormat = require('dateformat');

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
      // Set some values
      let cardOutputFormat = '`' + conf.board.card_otput_format + '`';
      let listNameOutputFormat = '`' + conf.board.list_name_format + '`';
      let messageForEmptyList = conf.board.empty_list_placeholder;

      // Do our work
      TrelloApi.getListName(listItem['id'])
        .then(listName => {
          // listName is expected in listNameOutputFormat defined in ./conf/conf.json
          this.reportOutput(eval(listNameOutputFormat));
          return TrelloApi.getCardsForList(listItem['id']);
        })
        .then(listCards => {
          // Do we have any cards? If not, we output a placeholder:
          if (listCards.length === 0 && messageForEmptyList) {
            this.reportOutput(messageForEmptyList);
          }
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
            // card is expected in cardOutputFormat defined in ./conf/conf.json
            this.reportOutput(eval(cardOutputFormat));
          }
          resolve();
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
  static reportOutput(outputString) {
    console.log(outputString);
  }
}

module.exports = ReportFormat;
