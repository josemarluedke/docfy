module.exports = {
  parserOptions: {
    project: require.resolve('../../tsconfig.eslint.json')
  },
  plugins: [],
  extends: ['@underline/eslint-config-ember-typescript'],
  rules: {
    'prefer-rest-params': 'off',
    'ember/no-shadow-route-definition': 'off',
    'ember/no-empty-glimmer-component-classes': 'off',
    'ember/no-private-routing-service': 'off'
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
        'src/**/*.{js,ts}',
        'config/**/*.js',
        'tests/dummy/config/**/*.js',
        'tests/dummy/app/styles/*.js'
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
