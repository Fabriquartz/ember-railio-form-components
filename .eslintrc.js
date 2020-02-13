module.exports = {
  root:          true,
  parser:        'babel-eslint',
  parserOptions: {
    ecmaVersion:  2018,
    sourceType:   'module',
    ecmaFeatures: {
      legacyDecorators: true
    }
  },
  extends: [
    'eslint:recommended',
    'plugin:ember-suave/recommended'
  ],
  env: {
    browser: true,
    es6:     true
  },
  rules: {
    'array-bracket-spacing': 'off',
    'object-curly-spacing':  ['error', 'always'],

    'no-console':  ['error', { allow: ['error'] }],
    'quotes':      ['error', 'single', { allowTemplateLiterals: true }],
    'brace-style': ['error', '1tbs', { allowSingleLine: true }],
    'key-spacing': ['error', { multiLine: { beforeColon: false },
      align:     { beforeColon: false, on: 'value' } }],
    'max-len': ['error', { code: 85 }],

    'max-statements-per-line': 'off',
    'new-cap':                 'off',
    'operator-linebreak':      'off',

    'template-curly-spacing': 'off',
    indent:                   'off'
  },
  overrides: [
    // node files
    {
      files: [
        '.eslintrc.js',
        '.template-lintrc.js',
        'ember-cli-build.js',
        'index.js',
        'testem.js',
        'blueprints/*/index.js',
        'config/**/*.js',
        'tests/dummy/config/**/*.js'
      ],
      excludedFiles: [
        'addon/**',
        'addon-test-support/**',
        'app/**',
        'tests/dummy/app/**'
      ],
      parserOptions: {
        sourceType:  'script',
        ecmaVersion: 2015
      },
      env: {
        browser: false,
        node:    true
      },
      plugins: ['node'],
      rules:   Object.assign(
        {}, require('eslint-plugin-node').configs.recommended.rules, {
        // add your custom rules and overrides for node files here
        })
    }
  ]
};
