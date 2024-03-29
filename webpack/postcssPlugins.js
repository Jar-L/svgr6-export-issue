/* eslint-disable import/no-commonjs, global-require, object-shorthand */

const path = require('path');

const mediaBreakpoints = require('../src/constants/media.js');

module.exports = () => {
    const plugins = [];

    plugins.push(
        require('postcss-modules-values-replace-node6'),
        require('postcss-global-import')({
            sync: true
        }),
        require('postcss-use')({ modules: '*' }),
        require('postcss-nested'),
        require('postcss-at-rules-variables'),
        require('postcss-calc')({ mediaQueries: true }),
        require('postcss-custom-media')({
            extensions: mediaBreakpoints
        }),
        require('postcss-color-function-with-at-rule')({ mediaQueries: true })
    );

    plugins.push(
        require('autoprefixer')()
    );

    return plugins;
};
