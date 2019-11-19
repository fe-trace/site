const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = {
    devtool: 'cheap-source-map',
    entry: {
    	index: './src/index.js',
    },
    output: {
        filename: '[name].js',
        chunkFilename: '[name].js',
        path: path.resolve('dist'),
        publicPath: "./",
    },
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        'react-router': 'ReactRouter',
        'react-router-dom': 'ReactRouterDOM'
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
    },
    // 提取公共代码
    optimization: {
        runtimeChunk: {
            name: 'manifest'
        },
        splitChunks: {
            cacheGroups: {
                // 抽离第三方插件
                lib: {
                    // 指定是node_modules下的第三方包
                    test: /node_modules/,
                    chunks: 'all',
                    minSize: 0,
                    // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
                    priority: 10
                },
                // 抽离自己写的公共代码
                commons: {
                    chunks: 'all',
                    minChunks: 2,
                    // 只要超出0字节就生成一个新包
                    minSize: 0
                },
                // 抽离入口模块，可以不配置这个
                // runtime: {
                //     chunks: 'initial',
                //     // 只要超出0字节就生成一个新包
                //     minSize: 0
                // }
            }
        }
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './html/index.ejs',
            filename: 'index.html',
            hash: true
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        })
    ],
    mode: 'production'
};

module.exports = config;