var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const autoprefixer = require('autoprefixer');

var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: "./client/index.ts",
    output: {
        path: path.resolve("dist"),
        filename: "index.js"
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.scss/,
                loader: 'style-loader!css-loader!postcss-loader!sass-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            inlineSource: '.(js|css)$',
            template: './client/index.html'
        }),
        new HtmlWebpackInlineSourcePlugin()
    ],
    resolve: {
        extensions: ['.ts', '.js', '.html'],
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        }
    },
    devServer: {
        port: 8080,
        host: 'localhost',
        historyApiFallback: true,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        },
        contentBase: './dist',
        open: true
    }
};