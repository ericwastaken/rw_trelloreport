const pkg = require('./../package.json');

class CommandLineHelper {
  static programSetupReport(program, description) {
    // Setup our command line options, etc.
    program
      .version(pkg.version)
      .description(description)
      .option(
        `-r, --boardkey ["some-board-key"]`,
        `A key that matches a board defined in your config. If none is passed, the boardkey is set to the string 'default'.`
      )
      .option(
        `-o, --outputfilepath ["/path/to/some/output/file"]`,
        `An optional argument to control the output file path. If not provided, the value in the 'htmlOutputPath' config property for the report is used.`
      )
      .parse(process.argv);

    // Convenience link for program options
    const options = program.opts();

    // If we were not passed a boardkey, then we force it to 'default'
    if (!options.boardkey) {
      options.boardkey = 'default';
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
        `-d, --excludeDone`,
        `When this parameter is passed, cards marked as 'done' are not included in the results. Must not be used with --onlyDone.`
      )
      .option(
        `-e, --onlyDone`,
        `When this parameter is passed, only cards marked as 'done' are included in the results. Must not be used with --excludeDone.`
      )
      .option(
        `-l, --sortbytaskcount-lessfirst`,
        `When producing results, shows search results with fewer cards first.`
      )
      .option(
        `-m, --sortbytaskcount-morefirst`,
        `When producing results, shows search results with more cards first.`
      )
      .option(
        `-o, --outputfilepath ["/path/to/some/output/file"]`,
        `An optional argument to control the output file path. If not provided, the value in the 'htmlOutputPath' config property for the report is used.`
      )
      .parse(process.argv);

    // Convenience link for program options
    const options = program.opts();

    // If we were not passed a boardkey, then we force it to 'default'
    if (!options.boardkey) {
      options.boardkey = 'default';
    }
  }
}

module.exports = CommandLineHelper;
