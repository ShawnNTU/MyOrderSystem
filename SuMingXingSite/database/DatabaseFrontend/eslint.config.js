import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['dist'],
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars':'off',
      "arrow-body-style":["error", "always"],
      ...react.configs.recommended.rules,
      'react/prop-types':'off', // see https://stackoverflow.com/questions/38684925/react-eslint-error-missing-in-props-validation
      ...react.configs['jsx-runtime'].rules, // override two rules
      ...reactHooks.configs.recommended.rules,
      "react-hooks/exhaustive-deps":"off", // about dependencies array
      'react/jsx-no-target-blank': 'warn',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
]
