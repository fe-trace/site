const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = {
    devtool: 'cheap-eval-source-map',
    entry: {
    	index: './src/index.js',
    	home: './src/home.js',
    },
    output: {
        filename: '[name].[chunkhash:8].js',
        chunkFilename: '[name].[chunkhash:8].js',
        path: path.resolve('dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            { 
                test: /\.js$/, 
                exclude: /node_modules/, 
                loader: "babel-loader"
            },
            {
                test: /\.(jpe?g|png|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                            name : 'img/[name].[hash].[ext]'
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
                lib: {   // 抽离第三方插件
                    test: /node_modules/,   // 指定是node_modules下的第三方包
                    chunks: 'all',
                    // minSize: 0,
                    // 设置优先级，防止和自定义的公共代码提取时被覆盖，不进行打包
                    priority: 10
                },
                commons: { // 抽离自己写的公共代码，utils这个名字可以随意起
                    chunks: 'all',
                    minChunks: 2,
                    minSize: 0    // 只要超出0字节就生成一个新包
                },
                runtime: { // 抽离自己写的公共代码，utils这个名字可以随意起
                    chunks: 'initial',
                    minSize: 0    // 只要超出0字节就生成一个新包
                }
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
            filename: '[name].[contenthash:8].css',
        })
    ],
    mode: 'development'
};

module.exports = config;