/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (C) 2012-2025 mgm technology partners GmbH
 * All rights reserved. Rights of use are granted under the selected license.
 *
 * Dual License
 * ------------
 * This file is part of the mgm A12 Platform and available under
 * a choice of two different licenses:
 *
 * 1. Open-Source License – EUPL v1.2
 *    You may redistribute and/or modify this file under the terms of the
 *    European Union Public License, version 1.2 - see https://eupl.eu/.
 *
 * 2. Commercial License
 *    Alternatively, you may obtain a commercial license from
 *    mgm technology partners GmbH, that permits use of this software
 *    under different terms (including support and maintenance services).
 *
 *    Please contact a12-license@mgm-tp.com for more information.
 *
 * You must select and comply with exactly one of the above license options.
 *
 * Warranty Disclaimer (applies to either option)
 * ----------------------------------------------
 * THIS SOFTWARE IS PROVIDED “AS IS” AND WITHOUT WARRANTY OF ANY KIND,
 * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE
 * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.
 */

const Path = require("path");

const Webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const collectA12ModelVersions = require("./scripts/collect-model-version");

module.exports = {
    context: Path.join(__dirname),
    entry: {
        main: [
            // Includes widgets styles in the build
            "@com.mgmtp.a12.widgets/widgets-core/lib/theme/basic.css",
            // Guarantees that config is evaluated first
            Path.join(__dirname, "src/config/index.ts"),
            Path.join(__dirname, "src/index.tsx")
        ],
        silent_renew: Path.join(__dirname, "resources/html/silent_renew.js")
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: "ts-loader",
                        options: {
                            transpileOnly: true,
                            onlyCompileBundledFiles: true
                        }
                    }
                ],
                exclude: /[\\/](node_modules|test)[\\/]/
            },
            {
                test: /\.js$/,
                enforce: "pre",
                use: ["source-map-loader"]
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, "css-loader"]
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2)$/i,
                // More information here https://webpack.js.org/guides/asset-modules/
                type: "asset",
                generator: {
                    filename: "static/media/[hash][ext][query]"
                }
            },
            {
                test: /\.json$/,
                type: "json"
            }
        ]
    },
    output: {
        path: Path.join(__dirname, "build/webpack"),
        filename: "[name].bundle.[contenthash:8].js",
        chunkFilename: "[name].chunk.[chunkhash:8].js"
    },
    plugins: [
        // Typescript type checking
        new ForkTsCheckerWebpackPlugin({
            typescript: { configOverwrite: { exclude: ["./test/**/*"] } }
        }),
        // minify
        new MiniCssExtractPlugin({
            filename: "[name].bundle.[contenthash:8].css"
        }),
        new HtmlWebpackPlugin({
            hash: true,
            template: "./resources/html/index.html",
            favicon: "./resources/html/images/favicon.svg",
            chunks: ["main"]
        }),
        new HtmlWebpackPlugin({
            minify: true,
            hash: true,
            filename: "silent_renew.html",
            template: "resources/html/silent_renew.html",
            chunks: ["silent_renew"]
        }),
        new Webpack.DefinePlugin({
            // Check if we can enable it in the official release
            // __A12_MODEL_VERSIONS__: JSON.stringify(collectA12ModelVersions()),
            minify: true
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: Path.join(__dirname, "resources/html/images"),
                    to: Path.resolve(__dirname, "build/webpack/images"),
                    noErrorOnMissing: true,
                    globOptions: { ignore: ["**/images/favicon.svg"] }
                }
            ]
        })
    ],
    resolve: {
        extensions: [".tsx", ".ts", ".js", ".json"]
    }
};
