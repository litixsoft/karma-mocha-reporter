'use strict';

module.exports = function (grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            options: {
                jshintrc: true
            },
            test: ['Gruntfile.js', 'index.js', 'demo/**/*.js']
        },
        copy: {
            demo: {
                expand: true,
                src: ['index.js', 'symbols.js'],
                dest: 'node_modules/karma-mocha-reporter'
            }
        },
        shell: {
            karma: {
                command: './node_modules/karma/bin/karma start demo/karma.conf.js'
            }
        },
        conventionalChangelog: {
            options: {
                changelogOpts: {
                    preset: 'angular'
                }
            },
            release: {
                src: 'CHANGELOG.md'
            }
        },
        bump: {
            options: {
                files: ['package.json'],
                updateConfigs: ['pkg'],
                commitFiles: ['-a'],
                commitMessage: 'chore: Release v%VERSION%',
                push: false
            }
        },
        karma: {
            demo: {
                configFile: 'demo/karma.conf.js'
            },
            mocha: {
                configFile: 'demo/karma.mocha.conf.js'
            },
            concurrency: {
                configFile: 'demo/karma.conf.js',
                browsers: ['Chrome', 'PhantomJS'],
                concurrency: 1,
                options: {
                    files: ['demo/aDemo.spec.js', 'demo/demo.spec.js']
                },
                detectBrowsers: {
                    enabled: false
                }
            },
            fast: {
                configFile: 'demo/karma.conf.js',
                browsers: ['PhantomJS'],
                options: {
                    files: ['demo/demo.spec.js']
                },
                detectBrowsers: {
                    enabled: false
                }
            },
            failInOneBrowser: {
                configFile: 'demo/karma.conf.js',
                browsers: ['PhantomJS', 'Chrome'],
                options: {
                    files: ['demo/failInOneBrowser.spec.js']
                },
                detectBrowsers: {
                    enabled: false
                }
            },
            allBrowsers: {
                configFile: 'demo/karma.conf.js',
                options: {
                    files: ['demo/demo.spec.js']
                }
            },
            singleBrowser: {
                configFile: 'demo/karma.conf.js',
                detectBrowsers: {
                    enabled: false
                }
            },
            success: {
                configFile: 'demo/karma.conf.js',
                browsers: ['PhantomJS', 'Firefox'],
                options: {
                    files: ['demo/demo.spec.js']
                },
                detectBrowsers: {
                    enabled: false
                }
            },
            duplicate: {
                configFile: 'demo/karma.conf.js',
                browsers: ['PhantomJS'],
                options: {
                    files: ['demo/duplicate.spec.js']
                },
                detectBrowsers: {
                    enabled: false
                }
            },
            reload: {
                configFile: 'demo/karma.conf.js',
                browsers: ['PhantomJS'],
                options: {
                    files: ['demo/fullPageReload.spec.js']
                },
                detectBrowsers: {
                    enabled: false
                }
            },
            noColors: {
                configFile: 'demo/karma.conf.js',
                colors: false,
                detectBrowsers: {
                    enabled: false
                }
            },
            short: {
                configFile: 'demo/karma.conf.js',
                options: {
                    files: ['demo/aDemo.spec.js']
                },
                detectBrowsers: {
                    enabled: false
                }
            },
            singleRun: {
                configFile: 'demo/karma.conf.js',
                singleRun: false,
                autoWatch: true,
                detectBrowsers: {
                    enabled: false
                }
            },
            fail: {
                configFile: 'demo/karma.conf.js',
                options: {
                    files: ['demo/fail.spec.js']
                },
                mochaReporter: {
                    maxLogLines: 2
                },
                detectBrowsers: {
                    enabled: false
                }
            },
            failWithAllBrowsers: {
                configFile: 'demo/karma.conf.js',
                options: {
                    files: ['demo/fail.spec.js']
                }
            },
            printNoFailures: {
                configFile: 'demo/karma.conf.js',
                mochaReporter: {
                    output: 'noFailures'
                },
                options: {
                    files: ['demo/fail.spec.js']
                },
                detectBrowsers: {
                    enabled: false
                }
            },
            autowatch: {
                configFile: 'demo/karma.autowatch.conf.js',
                options: {
                    files: ['demo/aDemo.spec.js']
                },
                detectBrowsers: {
                    enabled: false
                }
            },
            minimal: {
                configFile: 'demo/karma.autowatch.conf.js',
                options: {
                    files: ['demo/aDemo.spec.js'],
                    mochaReporter: {
                        output: 'minimal'
                    }
                },
                detectBrowsers: {
                    enabled: false
                }
            },
            ignoreSkipped: {
                configFile: 'demo/karma.conf.js',
                options: {
                    files: ['demo/skipping.spec.js'],
                    mochaReporter: {
                        ignoreSkipped: true
                    }
                }
            },
            colors: {
                configFile: 'demo/karma.conf.js',
                browsers: ['PhantomJS'],
                options: {
                    files: ['demo/demo2.spec.js'],
                    mochaReporter: {
                        colors: {
                            success: 'bgGreen',
                            info: 'bgCyan',
                            warning: 'wayne',
                            error: 'bgRed'
                        }
                    }
                },
                detectBrowsers: {
                    enabled: false
                }
            },
            symbols: {
                configFile: 'demo/karma.conf.js',
                browsers: ['PhantomJS'],
                options: {
                    files: ['demo/demo2.spec.js'],
                    mochaReporter: {
                        symbols: {
                            success: '+',
                            info: '#',
                            warning: '!',
                            error: 'x'
                        }
                    }
                },
                detectBrowsers: {
                    enabled: false
                }
            }
        }
    });

    // Load tasks.
    require('load-grunt-tasks')(grunt);

    grunt.registerTask('release', 'Bump version, update changelog and tag version', function (version) {
        grunt.task.run([
            'bump:' + (version || 'patch') + ':bump-only',
            'conventionalChangelog:release',
            'bump-commit'
        ]);
    });

    // Register tasks.
    grunt.registerTask('test', ['copy:demo', 'jshint', 'karma:success']);
    grunt.registerTask('concurrency', ['copy:demo', 'jshint', 'karma:concurrency']);
    grunt.registerTask('fast', ['copy:demo', 'karma:fast']);
    grunt.registerTask('short', ['copy:demo', 'karma:short']);
    grunt.registerTask('autowatch', ['copy:demo', 'karma:autowatch']);
    grunt.registerTask('minimal', ['copy:demo', 'karma:minimal']);
    grunt.registerTask('single', ['copy:demo', 'karma:singleRun']);
    grunt.registerTask('fail', ['copy:demo', 'karma:fail']);
    grunt.registerTask('fail2', ['copy:demo', 'karma:failWithAllBrowsers']);
    grunt.registerTask('fail3', ['copy:demo', 'karma:failInOneBrowser']);
    grunt.registerTask('printNoFailures', ['copy:demo', 'karma:printNoFailures']);
    grunt.registerTask('noColors', ['copy:demo', 'karma:noColors']);
    grunt.registerTask('ignoreSkipped', ['copy:demo', 'karma:ignoreSkipped']);
    grunt.registerTask('piped', ['copy:demo', 'shell:karma']);
    grunt.registerTask('colors', ['copy:demo', 'karma:colors']);
    grunt.registerTask('symbols', ['copy:demo', 'karma:symbols']);
    grunt.registerTask('duplicate', ['copy:demo', 'karma:duplicate']);
    grunt.registerTask('reload', ['copy:demo', 'karma:reload']);
    grunt.registerTask('mocha', ['copy:demo', 'karma:mocha']);
    grunt.registerTask('all', ['copy:demo', 'karma:allBrowsers']);
    grunt.registerTask('demo', [
        'copy:demo',
        'karma:singleBrowser',
        'karma:demo',
        'karma:success',
        'karma:fail',
        'karma:failInOneBrowser',
        'karma:printNoFailures',
        'shell:karma',
        'karma:noColors',
        'karma:colors',
        'karma:symbols',
        'karma:duplicate',
        'karma:mocha',
        'karma:concurrency',
        'karma:reload'
    ]);

    // Default task.
    grunt.registerTask('default', ['test']);
};