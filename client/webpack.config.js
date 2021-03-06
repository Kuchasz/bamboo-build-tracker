var HtmlWebpackPlugin = require("html-webpack-plugin");
var HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");
const autoprefixer = require("autoprefixer");

var webpack = require("webpack");
var path = require("path");

const apiHost = process.env.API_HOST !== undefined
        ? `'http://${process.env.API_HOST}'`
        : `''`;

module.exports = {
    entry: path.resolve("./src/index.tsx"),
    output: {
        path: path.resolve("../server/data"),
        filename: "index.js"
    },
    module: {
        rules: [
            {
                test: /\.ts|\.tsx/,
                use: "ts-loader",
                exclude: /node_modules/
            },
            {
                test: /\.html$/,
                use: "html-loader"
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "postcss-loader",
                    "sass-loader"
                ]
            },
            {
                test: /\.(svg)$/,
                use: ["raw-loader"]
            }
        ]
    },
    plugins: [
        autoprefixer,
        new HtmlWebpackPlugin({
            inlineSource: ".(js|css)$",
            template: "./src/index.html"
        }),
        new HtmlWebpackInlineSourcePlugin(),
        new webpack.DefinePlugin({
            API_HOST: apiHost
        }),
        // new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.AggressiveMergingPlugin()
    ],
    resolve: {
        extensions: [".ts", ".tsx", ".js", ".html"]
    },
    devServer: {
        port: 8080,
        host: "localhost",
        historyApiFallback: true,
        watchOptions: {
            aggregateTimeout: 300,
            poll: 1000
        },
        contentBase: path.resolve("./dist"),
        open: true
    }
};
