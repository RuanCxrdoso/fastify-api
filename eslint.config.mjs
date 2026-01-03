import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.node },
  },
  tseslint.configs.recommended,
  {
    rules: {
      semi: ['error', 'never'],

      quotes: ['error', 'single'],

      indent: ['error', 2],

      'comma-dangle': ['error', 'always-multiline'],

      'arrow-parens': ['error', 'always'],

      'max-len': ['warn', { code: 80 }],

      'object-curly-spacing': ['error', 'always'],
      'eol-last': ['error', 'always'],
    },
  },
])
