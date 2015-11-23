'use strict';

var chalk = require('chalk');
var symbols = require('./symbols');

/**
 * The MochaReporter.
 *
 * @param {!object} baseReporterDecorator The karma base reporter.
 * @param {!Function} formatError The karma function to format an error.
 * @param {!object} config The karma config.
 * @constructor
 */
var MochaReporter = function (baseReporterDecorator, formatError, config) {
    // extend the base reporter
    baseReporterDecorator(this);

    var self = this;
    var firstRun = true;

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

    config.mochaReporter = config.mochaReporter || {};

    var outputMode = config.mochaReporter.output || 'full';
    var ignoreSkipped = config.mochaReporter.ignoreSkipped || false;
    var divider = config.mochaReporter.divider;
    if (divider !== '') {
        divider = repeatString('=', process.stdout.columns || 80);
    }

    // disable chalk when colors is set to false
    chalk.enabled = config.colors !== false;

    // set color functions
    config.mochaReporter.colors = config.mochaReporter.colors || {};

    var colors = {
        success: {
            symbol: symbols.success,
            print: chalk[config.mochaReporter.colors.success] || chalk.green
        },
        info: {
            symbol: symbols.info,
            print: chalk[config.mochaReporter.colors.info] || chalk.grey
        },
        warning: {
            symbol: symbols.warning,
            print: chalk[config.mochaReporter.colors.warning] || chalk.yellow
        },
        error: {
            symbol: symbols.error,
            print: chalk[config.mochaReporter.colors.error] || chalk.red
        }
    };

    function getLogSymbol (color) {
        return chalk.enabled ? color.print(color.symbol) : chalk.stripColor(color.symbol);
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
     * Writes the test results to the output
     *
     * @param {!object} suite The test suite
     * @param {number=} depth The indention.
     */
    function print (suite, depth) {
        var keys = Object.keys(suite);
        var length = keys.length;
        var i, item;

        for (i = 0; i < length; i++) {
            item = suite[keys[i]];

            // start of a new suite
            if (item.isRoot) {
                depth = 1;
            }

            // only print to output once
            if (item.name && !item.printed && (!item.skipped || !ignoreSkipped)) {
                // indent
                var line = repeatString('  ', depth) + item.name;

                // it block
                if (item.type === 'it') {
                    if (item.skipped) {
                        // print skipped tests info
                        line = colors.info.print(chalk.stripColor(line) + ' (skipped)');
                    } else {
                        // set color to success or error
                        line = item.success ? colors.success.print(line) : colors.error.print(line);
                    }
                } else {
                    // print name of a suite block in bold
                    line = chalk.bold(line);
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
            if (item.name && !item.success && !item.skipped) {
                // indent
                var line = repeatString('  ', depth) + item.name;

                // it block
                if (item.type === 'it') {
                    // make item name error
                    line = colors.error.print(line) + '\n';

                    // add all browser in which the test failed with color warning
                    for (var bi = 0; bi < item.failed.length; bi++) {
                        var browserName = item.failed[bi];
                        line += repeatString('  ', depth + 1) + chalk.italic(colors.warning.print(browserName)) + '\n';
                    }

                    // add the error log in error color
                    item.log = item.log || [];

                    item.log.forEach(function (err) {
                        line += colors.error.print(formatError(err, repeatString('  ', depth)));
                    });
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
     * Returns all properties of the given object
     *
     * @param {!Object} obj
     * @returns {Array}
     */
    function listAllObjectProperties (obj) {
        var objectToInspect;
        var result = [];

        for (objectToInspect = obj; objectToInspect !== null; objectToInspect = Object.getPrototypeOf(objectToInspect)) {
            result = result.concat(Object.getOwnPropertyNames(objectToInspect));
        }

        return result;
    }

    /**
     * Returns a singularized or plularized noun for "test" based on test count
     *
     * @param {!Number} testCount
     * @returns {String}
     */

    function getTestNounFor (testCount) {
        if (testCount === 1) {
            return 'test';
        }
        return 'tests';
    }

    /**
     * Returns if the property is an reserverd object property
     *
     * @param {!Object} obj
     * @param {!String} property
     * @returns {boolean}
     */
    function isReservedProperty (obj, property) {
        return listAllObjectProperties(Object.getPrototypeOf(obj)).indexOf(property) > -1;
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
            if (isReservedProperty(suite, description)) {
                self.write(colors.warning.print('Reserved name for ' + (depth === maxDepth ? 'it' : 'describe') + ' block (' + description + ')! Please use an other name, otherwise the result are not printed correctly'));
                self.write('\n');
                return {};
            }

            var item = suite[description] || {};
            suite[description] = item;

            item.name = description;
            item.isRoot = depth === 0;
            item.type = 'describe';
            item.skipped = result.skipped;
            item.success = (item.success === undefined ? true : item.success) && result.success;

            // it block
            if (depth === maxDepth) {
                item.type = 'it';
                item.count = item.count || 0;
                item.count++;
                item.failed = item.failed || [];
                item.name = (result.success ? getLogSymbol(colors.success) : getLogSymbol(colors.error)) + ' ' + item.name;
                item.success = result.success;
                item.skipped = result.skipped;
                self.netTime += result.time;

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
                    item.name += colors.warning.print((' (slow: ' + formatTimeInterval(result.time) + ')'));
                    self.numberOfSlowTests++;
                }

                if (item.count === self.numberOfBrowsers) {
                    // print results to output when test was ran through all browsers
                    if (outputMode !== 'minimal') {
                        print(self.allResults, depth);
                    }
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
        if (!firstRun && divider) {
            self.write('\n' + chalk.bold(divider) + '\n');
        }
        firstRun = false;
        self.write('\n' + chalk.underline.bold('START:') + '\n');
        self._browsers = [];
        self.allResults = {};
        self.totalTime = 0;
        self.netTime = 0;
        self.numberOfSlowTests = 0;
        self.numberOfSkippedTests = 0;
        self.numberOfBrowsers = (browsers || []).length;
    };

    self.onBrowserStart = function (browser) {
        self._browsers.push(browser);
        self.numberOfBrowsers = self._browsers.length;
    };

    self.onRunComplete = function (browsers, results) {
        browsers.forEach(function (browser) {
            self.totalTime += browser.lastResult.totalTime;
        });

        self.write('\n' + colors.success.print('Finished in ' + formatTimeInterval(self.totalTime) + ' / ' + formatTimeInterval(self.netTime)));
        self.write('\n\n');

        if (browsers.length > 0 && !results.disconnected) {
            self.write(chalk.underline.bold('SUMMARY:') + '\n');
            self.write(colors.success.print(getLogSymbol(colors.success) + ' ' + results.success + ' ' + getTestNounFor(results.success) + ' completed'));
            self.write('\n');

            if (self.numberOfSkippedTests > 0) {
                self.write(colors.info.print(getLogSymbol(colors.info) + ' ' + self.numberOfSkippedTests + ' ' + getTestNounFor(self.numberOfSkippedTests) + ' skipped'));
                self.write('\n');
            }

            if (self.numberOfSlowTests > 0) {
                self.write(colors.warning.print(getLogSymbol(colors.warning) + ' ' + self.numberOfSlowTests + ' ' + getTestNounFor(self.numberOfSlowTests) + ' slow'));
                self.write('\n');
            }

            if (results.failed) {
                self.write(colors.error.print(getLogSymbol(colors.error) + ' ' + results.failed + ' ' + getTestNounFor(results.failed) + ' failed'));
                self.write('\n');

                if (outputMode !== 'noFailures') {
                    self.write('\n' + chalk.underline.bold('FAILED TESTS:') + '\n');
                    printFailures(self.allResults);
                }
            }
        }

        if (outputMode === 'autowatch') {
            outputMode = 'minimal';
        }
    };
};

// inject karma runner baseReporter and config
MochaReporter.$inject = ['baseReporterDecorator', 'formatError', 'config'];

// PUBLISH DI MODULE
module.exports = {
    'reporter:mocha': ['type', MochaReporter]
};
