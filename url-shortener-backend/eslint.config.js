// @ts-check
const {defineConfig} = require('eslint');
const tseslint = require('typescript-eslint');
const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = defineConfig(
  {ignores: ['**/dist/**', '**/node_modules/**']},
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
);
