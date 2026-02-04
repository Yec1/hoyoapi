import globals from 'globals'
import pluginJs from '@eslint/js'

export default [
  {
    ignores: ['docs/**', 'dist/**', 'node_modules/**', 'coverage/**'],
  },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
]
