import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import node from 'eslint-plugin-n';
import jest from 'eslint-plugin-jest';

// Flat config format for ESLint 9+
export default [
  js.configs.recommended,
  prettierConfig,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        require: 'readonly',
        exports: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        console: 'readonly',
        module: 'readonly',
        setTimeout: 'readonly',
        test: 'readonly', // ✅ Allow Jest global functions
        expect: 'readonly', // ✅ Allow Jest global functions
        order_id: 'readonly',
      },
    },
    plugins: {
      prettier,
      n: node,
      jest,
    },
    settings: {
      jest: {
        version: 29, // Ensure Jest version compatibility
      },
    },
    rules: {
      'prettier/prettier': 'error',
      'n/no-unsupported-features/es-syntax': 'off',
      'n/no-missing-import': 'off',
      'no-console': 'off',
      'no-debugger': 'error',
      eqeqeq: ['error', 'always'],
      curly: 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'no-unused-vars': ['error', { args: 'after-used', argsIgnorePattern: '^_' }],
      'no-multiple-empty-lines': ['error', { max: 1 }],
      semi: ['error', 'always'],
      quotes: ['error', 'single', { avoidEscape: true }],
      indent: ['error', 2, { SwitchCase: 1 }],
      'max-len': ['error', { code: 500, ignoreUrls: true }],
      'arrow-spacing': ['error', { before: true, after: true }],
      'keyword-spacing': ['error', { before: true, after: true }],
      'space-before-blocks': 'error',
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'comma-dangle': ['error', 'always-multiline'],
      'no-trailing-spaces': 'error',
      'spaced-comment': ['error', 'always', { exceptions: ['-', '+'] }],
      'no-duplicate-imports': 'error',
      'no-undef': 'off', // ✅ Prevent ESLint from flagging Jest globals
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error',
    },
  },
];
