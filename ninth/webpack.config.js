const nodeExternals = require("webpack-node-externals");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackChangeAssetsExtensionPlugin = require('html-webpack-change-assets-extension-plugin');
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-tags-plugin');
const webpack = require('webpack');

const path = require("path");

const js = {
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
        loader: "babel-loader",
        options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
        },
    },
};


const css = {
    test: /\.css$/,
    exclude: /node_modules/,
    use: [
        //{ loader: 'style-loader' }, 
        MiniCssExtractPlugin.loader, 'css-loader',
        // {
        //     loader: 'css-loader',
        //     options: {
        //         sourceMap: true
        //     }
        // }
    ]
};

const file = {
    // test: /\.png|jpg|gif|mp3/,
    // use: [
    //     {
    //         loader: 'url-loader',
    //         options: {
    //             name: "[name].[ext]"
    //           },
    //     },
    // ],
    test: /\.(png|jpg|gif|mp3)$/i,
    use: [
        {
            loader: 'url-loader',
            options: {
                name: "[name].[ext]"
            },
        },
    ],
    //use: 'file-loader',
};


const serverConfig = {
    mode: "development",
    target: "electron-renderer",
    node: {
        __dirname: false,
    },
    externals: [nodeExternals()],
    entry: {
        "index": path.resolve(__dirname, "server/server.js"),
    },
    module: {
        rules: [js, css, file],
    },
    watchOptions: {
        poll: 1000, // Check for changes every second
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
    ]
};

const clientConfig = {
    mode: "development",
    target: "web",
    entry: {
        //"client.js": path.resolve(__dirname, "client/client.js"),
        "client": path.resolve(
            __dirname,
            "client/client.js"
        ),
    },
    module: {
        rules: [js, css, file],
    },
    watchOptions: {
        poll: 1000, // Check for changes every second
    },
    optimization: {
        // 1
        // splitChunks: {
        //     chunks: "all",
        // },

        // 2
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendor: {
                    reuseExistingChunk: true,
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendor',
                    chunks: 'initial',
                }
            }
        }

        //3
        // runtimeChunk: 'single',
        // splitChunks: {
        //     chunks: 'all',
        //     minSize: 0,
        //     cacheGroups: {
        //         vendor: {
        //             test: /[\\/]node_modules[\\/]/,
        //             name(module) {
        //                 // get the name. E.g. node_modules/packageName/not/this/part.js
        //                 // or node_modules/packageName
        //                 const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

        //                 // npm package names are URL-safe, but some servers don't like @ symbols
        //                 return `/static/npm.${packageName.replace('@', '')}`;
        //             },
        //         },
        //     },
        // }
    },
    output: {
        path: path.resolve(__dirname, "dist/public"),
        publicPath: '/static/',
        filename: "[name].js",
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
        new HtmlWebpackPlugin({
            template: './server/controller/reactjs/index.html',
            filename: './index.html'
        }),
        new HtmlWebpackIncludeAssetsPlugin({ append: true })
        // new HtmlWebpackPlugin({
        //     template: __dirname + '/client/template.html',
        //     inject: 'body',
        //     filename: "index.html",

        // })
    ]
};

module.exports = [serverConfig, clientConfig];