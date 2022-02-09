module.exports = {
  extends: ['next', 'next/core-web-vitals', 'plugin:@typescript-eslint/recommended', 'prettier'],
  rules: {
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/ban-types': 'warn',
    'prefer-const': 'warn',
    'no-var': 'warn',
    '@typescript-eslint/no-empty-function': 'warn',
    '@typescript-eslint/no-inferrable-types': 'warn',
    '@typescript-eslint/no-var-requires': 'warn',
    '@next/next/no-img-element': 'warn'
  },
};
