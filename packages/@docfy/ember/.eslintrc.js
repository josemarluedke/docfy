module.exports = {
  parserOptions: {
    project: require.resolve('../../../tsconfig.eslint.json')
  },
  plugins: [],
  extends: ['@underline/eslint-config-ember-typescript'],
  rules: {
    'prefer-rest-params': 'off'
  },
  overrides: [
    // node files
    {
      files: [
        '.eslintrc.js',
        '.template-lintrc.js',
        'ember-cli-build.js',
        'testem.js',
        'src/**/*.{js,ts}',
        'config/**/*.js',
        'tests/dummy/config/**/*.js'
      ],
      extends: [
        '@underline/eslint-config-node',
        '@underline/eslint-config-ember-typescript'
      ],
      rules: {
        'no-unused-vars': 'off',
        'node/no-unsupported-features/es-syntax': 'off',
        'node/no-missing-import': 'off'
      }
    }
  ]
};
