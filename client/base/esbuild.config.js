const cssModulesPlugin = require('esbuild-css-modules-plugin');

// using SS_ENV as NODE_ENV seems to be overwritten
const env = process.env.SS_ENV === 'dev' ? "'dev'" : "'production'";
const clientEnv = { 'process.env.NODE_ENV': env };

module.exports = (options) => {
  options.define = clientEnv;
  options.plugins.unshift(cssModulesPlugin({ namedExports: true }));
  return options;
};
