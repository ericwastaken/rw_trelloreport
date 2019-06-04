// Global overrides
// Use Bluebird Promises
global.Promise = require('bluebird');

// Dependencies
const PathHelper = require('../lib/PathHelper.js');
const assert = require('chai').assert;

class ConfigHelper {
  static loadReportConfig(configAsLoaded, base, boardkey = 'default') {
    try {
      // Normalize the passed config (ensures it's in v2.x format even if the file is v1.x)
      let normalizedConfig = this.normalizeConfig(configAsLoaded);
      assert(
        Array.isArray(normalizedConfig),
        'Error loading your config. normalizeConfig failed to return an array.'
      );
      // Assert: We have an array in normalizedConfig.
      // Find the passed boardkey in the config
      let reportConfig = normalizedConfig.find(reportConfig => {
        return reportConfig['boardkey'] === boardkey;
      });
      assert(
        reportConfig,
        `Could not find boardkey='${boardkey}' in your config.`
      );
      // Assert: We found a specific report config
      // Adjust all paths to be absolute (modifies reportConfig)
      PathHelper.absolutePathConfig(
        reportConfig,
        base
      );
      // Return the pathed reportConfig
      return reportConfig;
    } catch (ex) {
      throw new Error(`loadReportConfig error: ${ex.message}`);
    }
  }

  static normalizeConfig(configToModify) {
    if (Array.isArray(configToModify)) {
      // We have a v2.x config (which is an array), so we can safely leave it alone
      return configToModify;
    } else {
      // If the config passed is not already an array, it must be a v1.x config, so we have to process it to make it v2.0
      let configv2x = [configToModify];
      configv2x[0].boardkey = 'default';
      return configv2x;
    }
  }
}

module.exports = ConfigHelper;
