import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // 未使用的变量和导入 - 警告而不是错误
      '@typescript-eslint/no-unused-vars': ['warn', {
        argsIgnorePattern: '^_',           // 忽略以_开头的参数
        varsIgnorePattern: '^_',           // 忽略以_开头的变量
        caughtErrorsIgnorePattern: '^_',   // 忽略以_开头的catch错误
        destructuredArrayIgnorePattern: '^_', // 忽略解构数组中以_开头的变量
      }],
      'no-unused-vars': 'off', // 关闭JS规则，使用TS规则

      // React相关规则
      'react-refresh/only-export-components': ['warn', {
        allowConstantExport: true
      }],

      // 其他常用规则
      'no-console': ['warn', { allow: ['warn', 'error'] }], // 允许console.warn和console.error
      'prefer-const': 'warn',                                // 优先使用const
      'no-var': 'error',                                     // 禁止使用var
    },
  },
])
