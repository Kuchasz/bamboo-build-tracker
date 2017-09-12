var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const autoprefixer = require('autoprefixer');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

var webpack = require('webpack');
var path = require('path');

module.exports = {
    entry: "./client/index.tsx",
    output: {
        path: path.resolve("dist"),
        filename: "index.js"
    },
    module: {
        rules: [
            {
                test: /\.ts|\.tsx/,
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
        autoprefixer,
        new HtmlWebpackPlugin({
            inlineSource: '.(js|css)$',
            template: './client/index.html'
        }),
        new HtmlWebpackInlineSourcePlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        })
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.html']
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