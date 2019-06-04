const path = require('path');

class PathHelper {
  /**
   * This method takes in the config, inspects various properties expected to have
   * paths, then makes them ABSOLUTE paths based on the base directory passed in.
   *
   * This method expects to receive an object in configToModify and therefore
   * changes the object in place as a REFERENCE!
   *
   * Why? So that we can execute our scripts from anywhere, and they still will
   * find all the proper pieces.
   *
   * Note, the items in conf.json should be RELATIVE TO the root of the project!
   *
   * When adding new paths to the config, the path key should be added here
   * so that it too is processed.
   *
   * @param configToModify
   * @param base
   */
  static absolutePathConfig(configToModify, base) {
    // Access these safely and bail on any issues
    try {
      if (configToModify.board.output.htmlWrapperPath) {
        configToModify.board.output.htmlWrapperPath = path.resolve(
          base,
          configToModify.board.output.htmlWrapperPath
        );
      }
      if (configToModify.board.output.htmlCssPath) {
        configToModify.board.output.htmlCssPath = path.resolve(
          base,
          configToModify.board.output.htmlCssPath
        );
      }
      if (configToModify.board.output.htmlOutputPath) {
        configToModify.board.output.htmlOutputPath = path.resolve(
          base,
          configToModify.board.output.htmlOutputPath
        );
      }
    } catch (ex) {
      console.log(
        `absolutePathConfig Error calculating absolute path to the config values. If you're not running the scripts from the root of the project, you might have errors in accessing files. The error was: ${
          ex.message
        }`
      );
    }
  }
}

module.exports = PathHelper;
