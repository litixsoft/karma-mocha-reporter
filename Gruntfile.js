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
                src: ['index.js'],
                dest: 'node_modules/karma-mocha-reporter'
            }
        },
        shell: {
            karma: {
                command: './node_modules/karma/bin/karma start demo/karma.conf.js'
            }
        },
        karma: {
            demo: {
                configFile: 'demo/karma.conf.js'
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
            singleBrowser: {
                configFile: 'demo/karma.conf.js',
                detectBrowsers: {
                    enabled: false
                }
            },
            success: {
                configFile: 'demo/karma.conf.js',
                browsers: ['PhantomJS'],
                options: {
                    files: ['demo/demo.spec.js']
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
            }
        }
    });

    // Load tasks.
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-shell');

    // Register tasks.
    grunt.registerTask('test', ['copy:demo', 'jshint', 'karma:success']);
    grunt.registerTask('demo', ['copy:demo', 'karma:singleBrowser', 'karma:demo', 'karma:success', 'karma:fail', 'karma:printNoFailures', 'shell:karma', 'karma:noColors']);
    grunt.registerTask('fast', ['copy:demo', 'karma:fast']);
    grunt.registerTask('short', ['copy:demo', 'karma:short']);
    grunt.registerTask('autowatch', ['copy:demo', 'karma:autowatch']);
    grunt.registerTask('minimal', ['copy:demo', 'karma:minimal']);
    grunt.registerTask('single', ['copy:demo', 'karma:singleRun']);
    grunt.registerTask('fail', ['copy:demo', 'karma:fail']);
    grunt.registerTask('fail2', ['copy:demo', 'karma:failWithAllBrowsers']);
    grunt.registerTask('printNoFailures', ['copy:demo', 'karma:printNoFailures']);
    grunt.registerTask('noColors', ['copy:demo', 'karma:noColors']);
    grunt.registerTask('ignoreSkipped', ['copy:demo', 'karma:ignoreSkipped']);
    grunt.registerTask('piped', ['copy:demo', 'shell:karma']);

    // Default task.
    grunt.registerTask('default', ['test']);
};