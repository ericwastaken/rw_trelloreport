const pkg = require('./../package.json');

class CommandLineHelper {
  static programSetupForBoardKey(program, description) {
    // Setup our command line options, etc.
    program
      .version(pkg.version)
      .description(description)
      .option(
        `-r, --boardkey ["some-board-key"]`,
        `A key that matches a board defined in your config. If none is passed, the boardkey is set to the string 'default'.`
      )
      .parse(process.argv);

    // If we were not passed a boardkey, then we force it to 'default'
    if (!program.boardkey) {
      program.boardkey = 'default';
    }
  }
  static programSetupForSearch(program, description) {
    // Setup our command line options, etc.
    program
      .version(pkg.version)
      .description(description)
      .option(
        `-r, --boardkey ["some-board-key"]`,
        `A key that matches a board defined in your config. If none is passed, the boardkey is set to the string 'default'.`
      )
      .option(
        `-d, --excludedone`,
        `When this parameter is passed, cards marked as 'done' are not included in the results.`
      )
      .option(
        `-l, --sortbytaskcount-lessfirst`,
        `When producing results, shows search results with fewer cards first.`
      )
      .option(
        `-m, --sortbytaskcount-morefirst`,
        `When producing results, shows search results with more cards first.`
      )
      .parse(process.argv);

    // If we were not passed a boardkey, then we force it to 'default'
    if (!program.boardkey) {
      program.boardkey = 'default';
    }

  }
}

module.exports = CommandLineHelper;
