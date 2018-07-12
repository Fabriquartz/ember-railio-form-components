/* eslint-env node */
'use strict';

module.exports = function(environment) {
  let ENV = {
    contentSecurityPolicy: {
        // Deny everything by default
        'default-src': "'none'",

        // Allow scripts at https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js
        'script-src': ["'self'"],

        // Allow fonts to be loaded from http://fonts.gstatic.com
        'font-src': ["'self'", "http://fonts.gstatic.com"],

        // Allow data (xhr/websocket) from api.mixpanel.com and custom-api.local
        'connect-src': ["'self'"],

        // Allow images from the origin itself (i.e. current domain)
        'img-src': "'self'",

        // Allow CSS loaded from https://fonts.googleapis.com
        'style-src': ["'self'", "https://fonts.googleapis.com"],

        // Omit `media-src` from policy
        // Browser will fallback to default-src for media resources (which is 'none', see above)
        'media-src': null
    }
  }
  return ENV;
};
