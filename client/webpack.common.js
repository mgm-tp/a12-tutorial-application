/*
 * SPDX-License-Identifier: EUPL-1.2 OR LicenseRef-commercial
 *
 * Copyright (c) 2012-2026 mgm technology partners GmbH
 *
 * Dual License
 * ------------
 * This source file is part of the mgm A12 Platform and available under
 * a choice of two different licenses:
 *
 * 1. Open-Source License - EUPL v1.2
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
 * THIS SOFTWARE IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF ANY KIND,
 * WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NON-INFRINGEMENT, EXCEPT WHERE SUCH DISCLAIMERS ARE HELD TO BE
 * LEGALLY INVALID. SEE THE RESPECTIVE LICENSE TEXT FOR DETAILS.
 */

import Path from "node:path";
import Url from "node:url";

import Webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";

import collectA12ModelVersions from "./scripts/collect-model-version.js";

const __filename = Url.fileURLToPath(import.meta.url);
const __dirname = Path.dirname(__filename);

export default {
    context: Path.join(__dirname),
    entry: {
        main: [
            // Includes widgets styles in the build
            "@com.mgmtp.a12.widgets/widgets-core/styles/basic.css",
            // Guarantees that config is evaluated first
            Path.join(__dirname, "src/config/index.ts"),
            Path.join(__dirname, "src/index.tsx")
        ],
        silent_renew: Path.join(__dirname, "resources/html/silent_renew.js")
    },
    module: {
        rules: [
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
            // Used by @com.mgmtp.a12.client/client-core for model versions validation
            __A12_MODEL_VERSIONS__: JSON.stringify(collectA12ModelVersions())
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
