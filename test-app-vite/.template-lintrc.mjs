export default {
  extends: 'recommended',
  ignore: ['app/templates/docs/**'],
  rules: {
    // Relax rules for test app that has demo content
    'no-invalid-interactive': 'warn',
    'no-empty-headings': 'warn',
    'no-inline-styles': 'warn',
  },
};
