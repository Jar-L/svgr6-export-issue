/* eslint-disable import/no-commonjs, no-console */
const fs = require('fs');
const babelrc = fs.readFileSync('./.babelrc');
const envTargets = require('../envTargets.json');

let config = {
};

try {
    config = Object.assign({
        presets: [],
        plugins: [],
        env: {}
    }, JSON.parse(babelrc));
} catch (err) {
    console.error('==>     ERROR: Error parsing .babelrc.');
    console.error(err);
}

module.exports = (env = 'development', esVersion = 5, modules = false) => ({
    cacheDirectory: `.tmp/babel-${process.env.SERVER ? 'server' : 'client'}`,

    presets: [
        ['@babel/preset-env', {
            loose: true,
            modules,
            targets: envTargets[esVersion]
        }]
    ].concat(config.presets, (config.env[env] && config.env[env].presets) || []),

    plugins: [
        ['@babel/plugin-transform-runtime']
    ].concat(config.plugins, (config.env[env] && config.env[env].plugins) || [])
});
