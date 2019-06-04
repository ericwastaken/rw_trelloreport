const pkg = require('./../package.json');

class CommandLineHelper {
  static programSetupForReportKey(program, description) {
    // Setup our command line options, etc.
    program
      .version(pkg.version)
      .description(description)
      .option(
        `-r, --reportkey ["some-report-key"]`,
        `A key that matches a report defined in your config. If none is passed, the reportKey is set to the string 'default'.`
      )
      .parse(process.argv);

    // If we were not passed a reportkey, then we force it to 'default'
    if (!program.reportkey) {
      program.reportkey = 'default';
    }
  }
}

module.exports = CommandLineHelper;
