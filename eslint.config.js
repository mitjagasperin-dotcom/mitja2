import js from '@eslint/js';
import react from 'eslint-plugin-react';
import prettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  react.configs.flat.recommended,
  prettier,
  {
    ignores: ['dist', 'coverage'],
    languageOptions: {
      globals: {
        JSX: true,
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
    },
  },
];
