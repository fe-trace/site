const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = {
    target: 'node',
    mode: 'development',
    devtool: 'cheap-source-map',
    entry: {
    	ssr: './demo/ssr.js',
    },
    output: {
        filename: '[name].js',
        chunkFilename: '[name].js',
        path: path.resolve('source'),
        publicPath: "./",
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },{
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader', 
                    'less-loader'
                ]
            },
            { 
                test: /\.js$/, 
                exclude: /node_modules/, 
                loader: [
                    "babel-loader"
                ]
            },
            { 
                test: /\.md$/, 
                loader: [
                    path.resolve(__dirname, './lib/loader/markdown.js')
                ]
            },
            {
                test: /\.(jpe?g|png|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name : 'img/[name].[ext]'
                        }
                    }
                ]
            }
        ]
    }
};

module.exports = config;