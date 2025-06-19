import config from '@padcom/eslint-config-vue'
import globals from 'globals'

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...config['flat/browser'],
  {
    files: [
      'tailwind.config.*',
      'tailwind.theme.*',
      'vite.config.*',
      'vitest.config.*',
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
