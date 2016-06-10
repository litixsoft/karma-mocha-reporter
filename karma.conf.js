/*
 * Karma configuration file for local development.
 * You need to connect your browser manually to running Karma instance!
 *
 * Team Perry
 * Barco 2015
 */

//var fs = require('fs');

module.exports = function (config) {
    'use strict';
//    var keydir = undefined;

//    if(process.env.HOME !== undefined) {
//        keydir = process.env.HOME + "/keys/";
//    } else if(process.env.USERPROFILE !== undefined) {
//        keydir = process.env.USERPROFILE + "\\keys\\";
//    } else {
//        keydir = "/";
//    }
    
    config.set({
        //basePath: './',
//        protocol: 'https:',
//        browserNoActivityTimeout: 11000,
//        httpsServerOptions: {
//            key: fs.readFileSync(keydir + "karma.key", "utf8"),
//            cert: fs.readFileSync(keydir + "karma.cert", "utf8"),
//            ca: fs.readFileSync(keydir + "karma.ca", "utf8")
//        },
        files: [
            '*.js'
        ],
        autoWatch: true,
        frameworks: [
            'mocha',
            'chai'
        ],
        plugins: [
            'karma-mocha',
            'karma-chai',
            'karma-coverage',
            'karma-mocha-reporter'
        ],
        reporters: ['mocha','coverage']
    });
};
