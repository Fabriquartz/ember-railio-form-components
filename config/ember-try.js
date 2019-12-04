/* globals module require */
'use strict';

const getChannelURL = require('ember-source-channel-url');

module.exports = function() {
  return Promise.all([
    getChannelURL('release'),
    getChannelURL('beta'),
    getChannelURL('canary')
  ]).then((urls) => {
    return {
      useYarn:   true,
      scenarios: [
        {
          name: 'ember-lts-3.8',
          env:  {
            EMBER_OPTIONAL_FEATURES: JSON.stringify({ 'jquery-integration': true })
          },
          npm: {
            devDependencies: {
              '@ember/jquery': '^0.6.0',
              'ember-source':  '~3.8.0'
            }
          },
          bower: {}
        },
        {
          name: 'ember-lts-3.12',
          env:  {
            EMBER_OPTIONAL_FEATURES: JSON.stringify({ 'jquery-integration': true })
          },
          npm: {
            devDependencies: {
              '@ember/jquery': '^0.6.0',
              'ember-source':  '~3.12.0'
            }
          },
          bower: {}
        },
        {
          name: 'ember-release',
          npm:  {
            devDependencies: {
              'ember-source': urls[0]
            }
          },
          bower: {}
        },
        {
          name: 'ember-beta',
          npm:  {
            devDependencies: {
              'ember-source': urls[1]
            }
          },
          bower: {}
        },
        {
          name: 'ember-canary',
          npm:  {
            devDependencies: {
              'ember-source': urls[2]
            }
          },
          bower: {}
        },
        {
          name: 'ember-default-with-jquery',
          env:  {
            EMBER_OPTIONAL_FEATURES: JSON.stringify({
              'jquery-integration': true
            })
          },
          npm: {
            devDependencies: {
              '@ember/jquery': '^0.5.1'
            }
          },
          bower: {}
        }
      ]
    };
  });
};
