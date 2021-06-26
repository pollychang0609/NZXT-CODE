module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
      "prettier",
      '@typescript-eslint',
    ],
    rules: {
      "prettier/prettier": "error",
      '@typescript-eslint/no-var-requires': 'off',
    },
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
    ],
    overrides: [
        // all test files
        {
          files: [
            'packages/*/tests/**/*.test.ts',
            'packages/*/tests/**/*.spec.ts',
            'packages/parser/tests/**/*.ts',
          ],
          env: {
      
          }
        }
    ]
  };