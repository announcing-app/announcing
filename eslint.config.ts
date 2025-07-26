// [memo] https://github.com/sveltejs/eslint-plugin-svelte/issues/732#issuecomment-2176982343

import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import svelte from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';
import ts, { type InfiniteDepthConfigWithExtends } from 'typescript-eslint';

const jsConfig: InfiniteDepthConfigWithExtends = {
  files: ['**/*.js'],
  extends: [js.configs.recommended],
  rules: {
    eqeqeq: 'error',
  },
};

const tsConfig: InfiniteDepthConfigWithExtends = {
  files: ['**/*.ts', '**/*.svelte', '**/*.svelte.ts'],
  extends: [js.configs.recommended, ...ts.configs.strict, ...ts.configs.stylistic],
  languageOptions: {
    parserOptions: {
      projectService: true,
      extraFileExtensions: ['.svelte', '.svelte.ts'],
    },
  },
  rules: {
    ...jsConfig.rules,
    'require-await': 'off',
    '@typescript-eslint/require-await': 'error',
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/no-unnecessary-condition': 'error',
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/restrict-template-expressions': [
      'error',
      {
        allowNumber: true,
      },
    ],
    '@typescript-eslint/no-deprecated': 'error',
  },
};

const svelteConfig: InfiniteDepthConfigWithExtends = {
  files: ['**/*.svelte', '**/*.svelte.ts'],
  extends: [...svelte.configs['flat/recommended'], ...svelte.configs['flat/prettier']],
  languageOptions: {
    parser: svelteParser,
    parserOptions: {
      parser: ts.parser,
    },
  },
  settings: {
    svelte: {
      // https://github.com/sveltejs/eslint-plugin-svelte/issues/442
      // https://sveltejs.github.io/eslint-plugin-svelte/user-guide/#settings-svelte-ignore-warnings
      ignoreWarnings: [
        '@typescript-eslint/no-unsafe-assignment',
        '@typescript-eslint/no-unsafe-member-access',
      ],
    },
  },
  rules: {
    'svelte/no-at-html-tags': 'off',
    // https://github.com/sveltejs/eslint-plugin-svelte/issues/298
    '@typescript-eslint/no-unsafe-call': 'off',
    // TODO: It does not seem to be working well.
    '@typescript-eslint/no-unsafe-assignment': 'off',
    '@typescript-eslint/no-unsafe-argument': 'off',
    '@typescript-eslint/no-unsafe-member-access': 'off',
    'prefer-const': 'off',
  },
};

export default ts.config(
  {
    ignores: [
      'pnpm-lock.yaml',
      '**/node_modules',
      '**/dist',
      '**/.svelte-kit',
      'packages/db-dev',
      'packages/db/drizzle/**/*',
      'packages/i18n/src/i18n/*.ts',
      '**/test-results',
      '**/playwright-report',
    ],
  },
  jsConfig,
  tsConfig,
  svelteConfig,
  prettier,
);
