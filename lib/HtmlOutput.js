const showdown = require('showdown');
const converter = new showdown.Converter();
const fs = require('fs');
const shellExec = require('shell-exec');
const resolvePath = require('resolve-path');

/**
 * A class that formats the outputBuffer into HTML. outputBuffer is expected
 * to be valid Markdown in the Github flavor.
 */
class HtmlOutput {
  /**
   * Prepare and output the final report output
   * from outputButter (which must be valid Markdown)
   *
   * htmlWrapper - an html "wrapper" document, expected to have the string '<div id="report"></div>' where the output will be dropped in.
   * htmlCss - a CSS document, which will be read and injected into the HTML (for single-file output). The file is expected to have '<style></style>' where the CSS will be dropped in.
   *
   * @param outputBuffer - an array of strings.
   * @param conf - the configuration the environment is running under
   */
  static finalOutput(outputBuffer, conf) {
    let htmlWrapper = fs
      .readFileSync(conf.board.output.htmlWrapperPath)
      .toString();
    let htmlCss = fs.readFileSync(conf.board.output.htmlCssPath).toString();
    let htmlOutputPath = conf.board.output.htmlOutputPath;
    let autoOpenOutput = conf.board.output.autoOpenOutput;

    // Output
    let reportOutput = HtmlOutput.getHtml(outputBuffer);
    // Find the '<div id="report"></div>' placeholder and replace it with reportOutput
    if (htmlWrapper) {
      reportOutput = htmlWrapper.replace(
        /<div id="report"><\/div>/gi,
        reportOutput
      );
    }
    // Find the '<style></style>' placeholder and replace it with htmlCss
    if (htmlCss) {
      reportOutput = reportOutput.replace(
        /<style><\/style>/gi,
        `<style>\n${htmlCss}</style>`
      );
    }
    if (htmlOutputPath) {
      // We write to file
      fs.writeFileSync(htmlOutputPath, reportOutput);
      console.log(`report was output to '${htmlOutputPath}'.`);
      if (autoOpenOutput) {
        shellExec(`open ${htmlOutputPath}`);
        console.log(`report was opened in your default html editor.`);
      }
    } else {
      // We output to console
      console.log(reportOutput);
    }
  }

  /**
   * Returns HTML from outputButter (which must be valid Markdown)
   *
   * @param outputBuffer
   * @return {*}
   */
  static getHtml(outputBuffer) {
    // Set our converter options
    setConverterOptions(converter);
    // Pull the array into a string (no comma delimiter)
    let outputString = outputBuffer.join('');
    // Format and return
    return converter.makeHtml(outputString);
  }
}

module.exports = HtmlOutput;

/**
 * Private Functions
 */

/**
 * Sets options for the HTML Converter
 *
 * @param converter
 */
function setConverterOptions(converter) {
  // Options are documented in https://github.com/showdownjs/showdown
  converter.setFlavor('github');
  converter.setOption('noHeaderId', false);
  converter.setOption('ghCompatibleHeaderId', true);
}
