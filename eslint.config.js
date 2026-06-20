import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import tseslint from 'typescript-eslint'
import globals from 'globals'

export default tseslint.config(
  {
    name: 'app/ignores',
    ignores: [
      'dist/**',
      '.quasar/**',
      'node_modules/**',
      // Provided / generated — we build on top, never lint or modify these.
      'src/mocks/**',
      'src/unocss/**',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],

  {
    // Parse <script lang="ts"> blocks inside .vue files with the TS parser.
    name: 'app/vue-ts',
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },

  {
    name: 'app/language',
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // Project conventions (see CLAUDE.md).
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'vue/multi-word-component-names': 'off', // step pages like Review.vue are fine
      'vue/require-default-prop': 'off', // optional props are typed optional in TS, no runtime default needed
      'vue/component-api-style': ['error', ['script-setup']], // enforce <script setup>
      'vue/define-macros-order': ['error', {
        order: ['defineProps', 'defineEmits', 'defineModel'],
      }],
    },
  },
)
