// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const prettierConfig = require('eslint-config-prettier');

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
      prettierConfig,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@typescript-eslint/no-empty-function': 'off',
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        {
          blankLine: 'always',
          prev: '*',
          next: ['return', 'block-like', 'multiline-expression'],
        },
        { blankLine: 'always', prev: '*', next: ['const', 'let', 'var'] },
        {
          blankLine: 'any',
          prev: ['const', 'let', 'var'],
          next: ['const', 'let', 'var'],
        },
      ],
      // '@typescript-eslint/no-explicit-any': 'error',
      // '@typescript-eslint/explicit-member-accessibility': [
      //   'error',
      //   {
      //     accessibility: 'explicit',
      //   },
      // ],
      // '@typescript-eslint/explicit-function-return-type': [
      //   'error',
      //   {
      //     allowExpressions: false,
      //     allowTypedFunctionExpressions: true,
      //     allowHigherOrderFunctions: false,
      //   },
      // ],
      'no-var': 'error',
      'semi-style': ['error', 'last'],
      'space-before-function-paren': ['error', 'never'],
      'prefer-const': 'error',
      'comma-dangle': ['error', 'always-multiline'],
      'curly': ['error', 'all'],
      'no-shadow': ['error', { builtinGlobals: true, hoist: 'all', allow: [] }],
      'no-redeclare': ['error', { builtinGlobals: true }],
      'no-param-reassign': 'error',
      'operator-linebreak': ['error', 'before'],
      'brace-style': ['error', '1tbs'],
      'object-curly-newline': [
        2,
        {
          ObjectExpression: {
            consistent: true,
            minProperties: 2,
          },
        },
      ],
    },
    plugins: {
      prettier: require('eslint-plugin-prettier'),
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  },
);
