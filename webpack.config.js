const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = {
    watch: true,
    watchOptions: {
        ignored: /node_modules/
    },
    devServer: {
        port: 9000,
        compress: true,
        contentBase: path.join(__dirname, "dist"),
    },
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
                runtime: {
                    chunks: 'initial',
                    // 只要超出0字节就生成一个新包
                    minSize: 0
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