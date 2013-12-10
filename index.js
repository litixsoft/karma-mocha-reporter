'use strict';
require('colors');

/**
 * The MochaReporter.
 *
 * @param {!object} baseReporterDecorator The karma base reporter.
 * @param {!object} config The karma config.
 * @constructor
 */
var MochaReporter = function (baseReporterDecorator, config) {
    // extend the base reporter
    baseReporterDecorator(this);

    var self = this;
    var firstRun = true;

    /**
     * Format the text with color when the colored output is enabled in the karma config.
     *
     * @param {!string} text The text to format.
     * @param {!string} color The color or format.
     * @returns {string}
     */
    function colorfy (text, color) {
        return config.colors === true ? text[color] : text;
    }

    /**
     * Returns a formatted time interval
     *
     * @param {!number} time The time.
     * @returns {string}
     */
    function formatTimeInterval (time) {
        var mins = Math.floor(time / 60000);
        var secs = (time - mins * 60000) / 1000;
        var str = secs + (secs === 1 ? ' sec' : ' secs');

        if (mins) {
            str = mins + (mins === 1 ? ' min ' : ' mins ') + str;
        }

        return str;
    }

    /**
     * Returns the text repeated n times.
     *
     * @param {!string} text The text.
     * @param {!number} n The number of times the string should be repeated.
     * @returns {string}
     */
    function repeatString (text, n) {
        var res = [];
        var i;

        for (i = 0; i < n; i++) {
            res.push(text);
        }

        return res.join('');
    }

    /**
     * Writes the test results to the output
     *
     * @param {!object} suite The test suite
     * @param {number=} depth The indention.
     */
    function print (suite, depth) {
        var keys = Object.keys(suite);
        var length = keys.length;
        var i, item;

        if (firstRun) {
            self.write('\nStart:'.underline.bold + '\n');
            firstRun = false;
        }

        for (i = 0; i < length; i++) {
            item = suite[keys[i]];

            // start of a new suite
            if (item.isRoot) {
                depth = 1;
            }

            // only print to output once
            if (item.name && !item.printed) {
                // indent
                var line = repeatString('  ', depth) + item.name;

                // it block
                if (item.type === 'it') {
                    if (item.skipped) {
                        // print skipped tests grey
                        line = colorfy(line + ' (skipped)', 'grey');
                    } else {
                        // set color to green or red
                        line = item.success ? colorfy(line, 'green') : colorfy(line, 'red');
                    }
                } else {
                    // print name of a suite block in bold
                    line = line.bold;
                }

                // use write method of baseReporter
                self.write(line + '\n');

                // set item as printed
                item.printed = true;
            }

            if (item.items) {
                // print all child items
                print(item.items, depth + 1);
            }
        }
    }

    /**
     * Writes the failed test to the output
     *
     * @param {!object} suite The test suite
     * @param {number=} depth The indention.
     */
    function printFailures (suite, depth) {
        var keys = Object.keys(suite);
        var length = keys.length;
        var i, item;

        for (i = 0; i < length; i++) {
            item = suite[keys[i]];

            // start of a new suite
            if (item.isRoot) {
                depth = 1;
            }

            // only print to output when test failed
            if (item.name && !item.success) {
                // indent
                var line = repeatString('  ', depth) + item.name;

                // it block
                if (item.type === 'it') {
                    // make item name red
                    line = colorfy(line, 'red') + '\n';

                    // add all browser in which the test failed with color yellow
                    line += repeatString('  ', depth + 1) + colorfy(item.failed.join('\n' + repeatString('  ', depth + 1)).italic, 'yellow') + '\n';

                    // add the error log in red
                    line += repeatString('  ', depth) + colorfy((item.log || [])[0], 'red') + '\n';
                }

                // use write method of baseReporter
                self.write(line + '\n');
            }

            if (item.items) {
                // print all child items
                printFailures(item.items, depth + 1);
            }
        }
    }

    /**
     * Called each time a test is completed in a given browser.
     *
     * @param {!object} browser The current browser.
     * @param {!object} result The result of the test.
     */
    function specComplete (browser, result) {
        // complete path of the test
        var path = [].concat(result.suite, result.description);
        var maxDepth = path.length - 1;

        path.reduce(function (suite, description, depth) {
            var item = suite[description] || {};
            suite[description] = item;

            item.name = description;
            item.isRoot = depth === 0;
            item.type = 'describe';
            item.skipped = result.skipped;
            item.success = item.success === undefined ? true : item.success && result.success;

            // it block
            if (depth === maxDepth) {
                item.type = 'it';
                item.count = item.count || 0;
                item.count++;
                item.failed = item.failed || [];
                item.name = result.success ? '✓ ' + item.name : '✗ ' + item.name;
                item.success = result.success;
                item.skipped = result.skipped;
                self.totalTime += result.time;

                if (result.skipped) {
                    self.numberOfSkippedTests++;
                }

                if (result.success === false) {
                    // add browser to failed browsers array
                    item.failed.push(browser.name);

                    // add error log
                    item.log = result.log;
                }

                if (config.reportSlowerThan && result.time > config.reportSlowerThan) {
                    // add slow report warning
                    item.name += colorfy((' (slow: ' + formatTimeInterval(result.time) + ')'), 'yellow');
                    self.numberOfSlowTests++;
                }

                if (item.count === self.numberOfBrowsers) {
                    // print results to output when test is run through all browsers
                    print(self.allResults, depth);
                }
            } else {
                item.items = item.items || {};
            }

            return item.items;
        }, self.allResults);
    }

    self.specSuccess = specComplete;
    self.specSkipped = specComplete;
    self.specFailure = specComplete;

    self.onSpecComplete = function (browser, result) {
        specComplete(browser, result);
    };

    self.onRunStart = function (browsers) {
        self.allResults = {};
        self.totalTime = 0;
        self.numberOfSlowTests = 0;
        self.numberOfSkippedTests = 0;
        self.numberOfBrowsers = (browsers || []).length;
    };

    self.onRunComplete = function (browsers, results) {
        self.write(colorfy('\nFinished in ' + formatTimeInterval(self.totalTime) + '\n\n', 'green'));

        if (browsers.length > 0 && !results.error && !results.disconnected) {
            self.write('SUMMARY:'.underline.bold + '\n');
            self.write(colorfy('✓ ' + results.success + ' tests completed\n', 'green'));

            if (self.numberOfSkippedTests > 0) {
                self.write(colorfy('- ' + self.numberOfSkippedTests + ' tests skipped\n', 'grey'));
            }

            if (self.numberOfSlowTests > 0) {
                self.write(colorfy('- ' + self.numberOfSlowTests + ' tests slow\n', 'yellow'));
            }

            if (results.failed) {
                self.write(colorfy('✗ ' + results.failed + ' tests failed\n', 'red'));
                self.write('\nFAILED TESTS:'.underline.bold + '\n');

                printFailures(self.allResults);
            }
        }
    };
};

// inject karma runner baseReporter and config
MochaReporter.$inject = ['baseReporterDecorator', 'config'];

// PUBLISH DI MODULE
module.exports = {
    'reporter:mocha': ['type', MochaReporter]
};