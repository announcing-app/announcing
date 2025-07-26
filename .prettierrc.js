/** @type {import('prettier').Config} */
const config = {
  printWidth: 100,
  tabWidth: 2,
  quoteProps: 'consistent',
  singleQuote: true,
  plugins: ['prettier-plugin-organize-imports', 'prettier-plugin-svelte'],
  overrides: [
    {
      files: '*.svelte',
      options: { parser: 'svelte' },
    },
    {
      files: ['**/*.jsonc'],
      options: {
        parser: 'json',
      },
    },
  ],
};

export default config;
