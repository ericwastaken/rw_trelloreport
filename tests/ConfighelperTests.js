// Test library dependencies
const should = require('chai').should();
const expect = require('chai').expect;

// Test dependencies
const ConfigHelper = require('../lib/ConfigHelper.js');

// Test Suite
describe('ConfigHelper Tests', () => {
  it('should normalize a v1.x config into v2.x format', function() {
    // Set a test case with the v1.x config structure (which was a direct object and not an array)
    let configv1x = {
      board: {},
    };
    // Call our normalize helper method
    let normalizedConfig = ConfigHelper.normalizeConfig(configv1x);
    // Test that the config comes back normalized as a v2.x config
    expect(
      normalizedConfig,
      'v2.x config did not come back as an array.'
    ).to.be.an('array');
    expect(
      normalizedConfig.length,
      'v2.x array should have exactly one item.'
    ).to.be.eq(1);
    expect(
      normalizedConfig[0]['reportKey'],
      'v2.x array property reportKey should have come back with a value.'
    ).to.not.be.empty;
  });

  it('should accept a v1.x config then return a v2.x for the specific report (which is made default) with paths', function() {
    // Set a test case with the v1.x config structure (which was a direct object and not an array)
    let configc1x = {
      board: {
        output: {
          outputFormat: 'html',
          htmlWrapperPath: './conf/report-layout.html',
          htmlCssPath: './conf/report-styles.css',
          htmlOutputPath: './output/report.html',
          autoOpenOutput: true,
        },
      },
    };
    // Call our load method
    let reportConfig = ConfigHelper.loadReportConfig(
      configc1x,
      __dirname,
      'default'
    );
    // Test that we receive a v2.x config, an object (not an array)
    expect(
      reportConfig,
      `Report config did not come back as an object.`
    ).to.be.an('object');
    // Check for the specific reportKey, in this case, 'default' since the starting config was a v1.x
    expect(
      reportConfig['reportKey'],
      `The reportKey did not come back with 'default'.`
    ).to.be.equal('default');
    // Check one of the properties we expect to have gotten a path.
    expect(
      reportConfig['board']['output']['htmlWrapperPath'],
      `Paths were not properly added into the config.`
    ).to.contain(__dirname);
  });

  it('should accept a v2.x config then return a v2.x for the specific report (which is made default) with paths', function() {
    // Set some constants for the test
    const reportKeyToTestFor = 'someReportKey';
    // Set a test case with the v1.x config structure (which was a direct object and not an array)
    let configv2x = [
      {
        reportKey: reportKeyToTestFor,
        board: {
          output: {
            outputFormat: 'html',
            htmlWrapperPath: './conf/report-layout.html',
            htmlCssPath: './conf/report-styles.css',
            htmlOutputPath: './output/report.html',
            autoOpenOutput: true,
          },
        },
      },
    ];
    // Call our load method
    let reportConfig = ConfigHelper.loadReportConfig(
      configv2x,
      __dirname,
      reportKeyToTestFor
    );
    // Test that we receive a v2.x config, an object (not an array)
    expect(
      reportConfig,
      `Report config did not come back as an object.`
    ).to.be.an('object');
    // Check for the specific reportKeyToTestFor, in this case, matching the passed config
    expect(
      reportConfig['reportKey'],
      `The reportKey did not come back with '${reportKeyToTestFor}'.`
    ).to.be.equal(reportKeyToTestFor);
    // Check one of the properties we expect to have gotten a path.
    expect(
      reportConfig['board']['output']['htmlWrapperPath'],
      `Paths were not properly added into the config.`
    ).to.contain(__dirname);
  });
});
