/* eslint-disable import/no-commonjs, global-require, no-console */

let path = require('path');
let express = require('express');
let webpack = require('webpack');
let ip = require('ip');
let port = process.env.PORT || 4000;
let host = process.env.HOST || '0.0.0.0';
let app = express();
let rootPath = path.resolve(__dirname, '..');
let config = require('./dev.config');
let compiler = webpack(config);

const instance = require('webpack-dev-middleware')(compiler, {
    headers: { 'Access-Control-Allow-Origin': '*' },
    publicPath: config.output.publicPath,
    quiet: false,
    noInfo: true,
    hot: false,
    inline: false,
    serverSideRender: true,
    stats: {
        timings: true,
        chunks: false,
        errors: true,
        modules: false,
        assets: false,
        errorDetails: true,
        children: false,
        warnings: true
    }
});

app.use(instance);

app.use(express.static(rootPath));

instance.waitUntilValid(() => {
    console.log('|-------------------------------------|');
    console.log('|   Local: ', 'http://localhost:' + port, '    |');
    console.log('|  Remote: ', 'http://' + ip.address() + ':' + port, ' |');
    console.log('|-------------------------------------|');
});

app.listen(port, host, err => err && console.log(err));

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

console.info('Running static webpack server on port', port); // eslint-disable-line no-console
