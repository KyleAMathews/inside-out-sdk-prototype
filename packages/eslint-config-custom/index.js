module.exports = {
  parser: `@typescript-eslint/parser`,
  extends: [
    `eslint:recommended`,
    `plugin:react/recommended`,
    `plugin:prettier/recommended`,
  ],
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  plugins: [`@typescript-eslint`, `prettier`],
  rules: {
    quotes: [`error`, `backtick`],
  },
  parserOptions: {
    requireConfigFile: false,
    sourceType: `module`,
    ecmaFeatures: {
      jsx: true,
    },
  },
}
