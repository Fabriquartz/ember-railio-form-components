/* eslint-env node */
/* eslint-disable quotes */
'use strict';

module.exports = function () {
  return {
    contentSecurityPolicy: {
      // Allow fonts to be loaded from http://fonts.gstatic.com
      'font-src': ["'self'", 'http://fonts.gstatic.com'],

      // Allow CSS loaded from https://fonts.googleapis.com
      'style-src': ["'self'", 'https://fonts.googleapis.com'],

      'script-src': ["'self'", "'unsafe-eval'"],
    },
  };
};
