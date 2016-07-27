// Karma configuration
// http://karma-runner.github.io/0.12/config/configuration-file.html
// Generated on 2015-10-19 using
// generator-karma 1.0.0

module.exports = function(config) {
  'use strict';

  config.set({
    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // base path, that will be used to resolve files and exclude
    basePath: '../',

    // testing framework to use (jasmine/mocha/qunit/...)
    // as well as any additional frameworks (requirejs/chai/sinon/...)
    frameworks: [
      "jasmine"
    ],

    // list of files / patterns to load in the browser
    files: [
      // bower:js
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-route/angular-route.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/angular-touch/angular-touch.js',
      'bower_components/angular-local-storage/dist/angular-local-storage.js',
      'bower_components/AngularJS-Toaster/toaster.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/lodash/lodash.js',
      'bower_components/graphlib/dist/graphlib.core.js',
      'bower_components/cytoscape/dist/cytoscape.js',
      'bower_components/dagre/dist/dagre.core.js',
      'bower_components/dagre/dist/dagre.core.min.js',
      'bower_components/cytoscape-dagre/cytoscape-dagre.js',
      'bower_components/angular-highlightjs/build/angular-highlightjs.js',
      'bower_components/marked/lib/marked.js',
      'bower_components/angular-marked/angular-marked.js',
      'bower_components/angular-messages/angular-messages.js',
      'bower_components/angular-addthis/dist/angular-addthis.js',
      'bower_components/angular-mocks/angular-mocks.js',
      // endbower
      "app/scripts/**/*.js",
      // "test/mock/**/*.js",
      "test/spec/**/*.js"
    ],

    // list of files / patterns to exclude
    exclude: [
    ],

    // web server port
    port: 8080,

    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: [
      "PhantomJS"
    ],

    // Which plugins to enable
    plugins: [
      "karma-phantomjs-launcher",
      "karma-coverage",
      "karma-jasmine"
    ],

    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true,

    colors: true,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,

    // Uncomment the following lines if you are using grunt's server to run the tests
    // proxies: {
    //   '/': 'http://localhost:9000/'
    // },
    // URL root prevent conflicts with the site root
    // urlRoot: '_karma_'

    preprocessors: {  
      'app/scripts/**/*.js': ['coverage']
    },

    reporters: ['dots', 'coverage'],

    coverageReporter: {  
      type: 'lcov',
      dir: 'build/coverage/'
    }
  });
};
