import config from '@padcom/eslint-config-vue'
import globals from 'globals'

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...config['flat/browser'],
  {
    files: [
      'vite.config.*',
    ],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  {
    rules: {
      'jsdoc/require-jsdoc': 'off',
    },
  },
]
