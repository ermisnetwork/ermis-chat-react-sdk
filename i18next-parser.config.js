// https://github.com/i18next/i18next-parser#options
module.exports = {
  createOldCatalogs: false,
  input: ['./src/**/*.{tsx,ts}'],
  keepRemoved: true,
  keySeparator: false,
  locales: ['en'],
  namespaceSeparator: false,
  output: 'src/i18n/$LOCALE.json',
  sort(a, b) {
    return a < b ? -1 : 1; // alfabetical order
  },
  useKeysAsDefaultValue: true,
  verbose: true,
};
