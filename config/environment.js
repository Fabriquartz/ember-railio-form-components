/* eslint-env node */
'use strict';

module.exports = function(environment) {
  let ENV = {
    contentSecurityPolicy: {

        // Allow fonts to be loaded from http://fonts.gstatic.com
        'font-src': ["'self'", "http://fonts.gstatic.com"],

        // Allow CSS loaded from https://fonts.googleapis.com
        'style-src': ["'self'", "https://fonts.googleapis.com"],

        'script-src':  ["'self'", "'unsafe-eval'"],
    }
  }
  return ENV;
};
