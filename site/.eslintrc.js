module.exports = {
  parserOptions: {
    project: require.resolve('../tsconfig.eslint.json'),
  },
  plugins: [],
  extends: ['@underline/eslint-config-ember-typescript'],
  rules: {
    'prefer-rest-params': 'off',
  },
  overrides: [
    // node files
    {
      files: [
        'ember-cli-addon.js',
        '.docfy-config.js',
        '.eslintrc.js',
        '.template-lintrc.js',
        'ember-cli-build.js',
        'testem.js',
        'config/**/*.js',
        'app/styles/*.js',
      ],
      extends: ['@underline/eslint-config-node', '@underline/eslint-config-ember-typescript'],
      rules: {
        'no-unused-vars': 'off',
        'node/no-unsupported-features/es-syntax': 'off',
        'node/no-missing-import': 'off',
      },
    },
  ],
};
