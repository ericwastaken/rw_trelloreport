// Global overrides
// Use Bluebird Promises
global.Promise = require('bluebird');

/**
 * A helper method to get stdin, if any.
 * Note, there does not seem to be a way to tell if there is or is not stdin.
 * So, this method tries to read it, but in order to not hang, we also use a timer
 * to detect if after x seconds, we're still not processing any stdin.
 * This might be problematic in some platforms where it might take longer than
 * our timeout to begin processing stdin. In other platforms, we might waste time
 * waiting on stdin that will never come.
 *
 * Regardless, this does work... albeit wasting some time when no stdin is used.
 *
 * Usage: In the module where you want this, simply do a require like this:
 *   const getStdin = require('./lib/StdInHelper.js');
 * Then later on, use the promise like this:
 *   getStdin.then((stdin) => { // Do Some Work }).catch();
 *
 * @returns {Promise<any>}
 */
module.exports = function() {
  // TODO: Is there a better way to detect that we don't have stdin than to use a timeout?
  return new Promise(resolve => {
    const waitForStdin_seconds = 2;
    // A handle for our timeout
    let hTimeout;
    // We use a flag to "check" to see if we're pulling stdin.
    let stdinFlowing = false;
    // A variable to use to hold stdin as it comes in
    let stdin = '';

    process.stdin.setEncoding('utf8');
    // Try to read stdin. This will throw if there's no stdin, which we anticipate
    try {
      // Listen for readable and pull in stdin if we get this
      process.stdin.on('readable', onReadableListener);
      // Listen for "end" on stdin so we can then resolve the promise
      process.stdin.on('end', doneWithStdin);

      // Now, if there's no stdin, we'll never get 'end' above. So, let's set a timer
      // to monitor for this after some short amount of time.
      hTimeout = setTimeout(() => {
        // After some time...
        if (!stdinFlowing) {
          // stdin is not flowing, so we assume we don't have any! We clear the timeout, fire doneWithStdin.
          clearTimeout(hTimeout);
          doneWithStdin();
        }
      }, waitForStdin_seconds * 2000);
    } catch (ex) {
      console.log('ERROR: While processing stdin! Ignoring.');
      doneWithStdin();
    }

    // Supporting listener / functions

    function onReadableListener() {
      // Mark our flag as "flowing" so we know we're processing
      stdinFlowing = true;
      let chunk;
      // Use a loop to make sure we read all available data.
      while ((chunk = process.stdin.read()) !== null) {
        stdin += chunk.toString();
      }
    }

    function doneWithStdin() {
      process.stdin.removeListener('readable', onReadableListener);
      process.stdin.removeListener('end', doneWithStdin);
      process.stdin.unref();
      resolve(stdin);
    }
  });
};
