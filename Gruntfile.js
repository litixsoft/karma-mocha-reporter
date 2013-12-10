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
        karma: {
            demo: {
                configFile: 'demo/karma.conf.js'
            },
            singleBrowser: {
                configFile: 'demo/karma.conf.js',
                detectBrowsers: {
                    enabled: false
                }
            },
            success: {
                configFile: 'demo/karma.conf.js',
                options: {
                    files: ['demo/demo.spec.js']
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
            }
        }
    });

    // Load tasks.
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-karma');

    // Register tasks.
    grunt.registerTask('test', ['copy:demo', 'jshint', 'karma:success']);
    grunt.registerTask('demo', ['copy:demo', 'karma:singleBrowser', 'karma:demo', 'karma:success', 'karma:noColors']);
    grunt.registerTask('short', ['copy:demo', 'karma:short']);

    // Default task.
    grunt.registerTask('default', ['test']);
};