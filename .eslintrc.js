const { join } = require('path');

module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: join(__dirname, './tsconfig.eslint.json')
  },
  extends: [
    '@underline/eslint-config-typescript',
    '@underline/eslint-config-node',
    'plugin:jest/recommended'
  ],
  plugins: ['jest'],

  settings: {
    node: {
      tryExtensions: ['.js', '.json', '.node', '.ts']
    }
  },
  rules: {
    'no-unused-vars': 'off',
    'node/no-unsupported-features/es-syntax': 'off',
    'node/no-missing-import': [
      'error',
      {
        allowModules: ['unist'] // this package is only TS types @types/unist
      }
    ],
    '@typescript-eslint/no-empty-interface': 'off'
  },
  overrides: [
    {
      files: ['packages/**/tests/**/*.ts'],
      rules: {
        'node/no-unpublished-import': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off'
      }
    }
  ]
};
