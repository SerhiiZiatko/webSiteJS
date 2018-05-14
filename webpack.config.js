const path = require('path');
const htmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
console.log(process.env.NODE_ENV)
const config = {
    entry: "./src/index.js",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'main.js'
    },
    module: {
        rules: [{
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                }
            },
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            }
        ]
    },
    plugins: [
        new ExtractTextPlugin("style.css"),
        new htmlWebpackPlugin({
            title: "webpack-app",
            template: path.join(__dirname, "/src/template.ejs")
        }),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new UglifyJsPlugin({
            sourceMap: true
        })
    ],
    devtool: "source-map",
    devServer: {
        contentBase: "./dist",
        hot: true
    }
}
module.exports = config;
