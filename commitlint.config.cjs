// Commitlint rules.
// Extends the conventional-commits preset, with one override: we disable
// body-max-line-length because semantic-release auto-generates commit bodies
// that include full markdown links to commits ("* feat: … ([abcdef](https://…))"),
// which routinely exceed 100 chars. Enforcing this rule would break the
// release workflow the first time it tries to commit a CHANGELOG update.
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-max-line-length': [0, 'always'],
    'footer-max-line-length': [0, 'always'],
  },
};
