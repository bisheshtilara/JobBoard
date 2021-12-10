module.exports = {
  extends: ['stylelint-config-recommended-scss', 'stylelint-config-prettier'],
  rules: {
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'extends',
          'variants',
          'responsive',
          'screen'
        ]
      }
    ],
    'declaration-block-trailing-semicolon': null,
    'no-descending-specificity': null,
    indentation: [2],
    'block-no-empty': null,
    'unit-allowed-list': ['em', 'rem', 's', 'px', 'vh', 'vw', '%', 'deg', 'ms']
  }
}
