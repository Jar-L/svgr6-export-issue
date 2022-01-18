/* eslint-disable import/no-commonjs, global-require */
const webpack = require('webpack');
const path = require('path');
const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const postcssConfig = require('./postcssPlugins.js');

// const cssLocalIdentName = '[name]__[local]_[hash:base64:5]'; // '[hash:base64:5]'
const cssLocalIdentName = '[name]__[local]'; // '[hash:base64:5]'
const isSourceMapEnabled = !!process.env.SOURCE_MAP;

const common = {
    node: {
        fs: "empty"
    },
    entry: {
        client: './src/AppProvider.jsx'
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            src: path.resolve(__dirname, 'src'),
            buffer: 'buffer'
        }
    },
    mode: 'development',
    optimization: {
        minimize: false,
        splitChunks: {
            chunks: 'all',
            automaticNameDelimiter: '-'
        },
        runtimeChunk: false
    },
    module: {
        rules: [
            {
                test: /\.(ttf|otf)$/,
                loader: 'url-loader',
                options: {
                    limit: 1000,
                    mimetype: 'application/octet-stream'
                }
            },
            {
                test: /\.eot$/,
                loader: 'file-loader'
            },
            {
                test: /\.svg$/,
                oneOf: [
                    {
                        issuer: /\.jsx?$/,
                        loader: ['@svgr/webpack', 'file-loader']
                    },
                    {
                        loader: 'file-loader'
                    }
                ],
            },
            {
                test: /\.png$/,
                loader: 'url-loader',
                options: {
                    limit: 1000,
                    mimetype: 'image/png'
                }
            },
            {
                test: /\.gif$/,
                loader: 'url-loader',
                options: {
                    limit: 1000,
                    mimetype: 'image/gif'
                }
            },
            {
                test: /\.jpg$/,
                loader: 'url-loader',
                options: {
                    limit: 1000,
                    mimetype: 'image/jpg'
                }
            },
            {
                test: /\.webp$/,
                loader: 'url-loader',
                options: {
                    limit: 1000,
                    mimetype: 'image/webp'
                }
            },
            {
                test: /\.css?$/,
                use: [
                    'style-loader',
                    'css-loader'
                ],
                include: [/node_modules/]
            },
            {
                test: /\.s?css?$/,
                use: [
                    ExtractCssChunks.loader,
                    {
                        loader: 'cache-loader',
                        options: {
                            cacheDirectory: path.resolve('.tmp/cache-loader')
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            localIdentName: cssLocalIdentName,
                            sourceMap: isSourceMapEnabled,
                            importLoaders: 1
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: postcssConfig,
                            sourceMap: isSourceMapEnabled
                        }
                    },
                    'sass-loader',
                    {
                        loader: 'sass-resources-loader',
                        options: {
                            resources: path.join(__dirname, '..', 'src', 'scss', 'main.scss')
                        }
                    }
                ],
                exclude: [/node_modules/]
            },
            {
                test: /\.worker\.js$/,
                use: { loader: 'worker-loader' }
            }
        ]
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser.js',
            Buffer: ['buffer', 'Buffer'],
        }),
        new CleanWebpackPlugin(['public'], {
            root: path.join(__dirname, '..')
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),

            'process.env.API_ENV_HOST': JSON.stringify(process.env.API_ENV_HOST),
            'process.env.API_MARKET_HOST': JSON.stringify(process.env.API_MARKET_HOST),

            'process.env.BROWSER': process.env.BROWSER || false,
            'process.env.SERVER': process.env.SERVER || false,

            'process.env.ENABLE_DEVTOOLS': process.env.NODE_ENV === 'development'
        })
    ]
};

module.exports = common;
