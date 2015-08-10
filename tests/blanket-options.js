/* globals blanket, module */

var options = {
  modulePrefix: 'ember-railio-form-components',
  filter: '//.*ember-railio-form-components/.*/',
  antifilter: '//.*(tests|template).*/',
  loaderExclusions: [],
  enableCoverage: true,
  cliOptions: {
    reporters: ['json'],
    autostart: true
  }
};
if (typeof exports === 'undefined') {
  blanket.options(options);
} else {
  module.exports = options;
}
