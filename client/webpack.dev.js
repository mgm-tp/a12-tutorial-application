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

const Dns = require("dns");

const { merge } = require("webpack-merge");
const Webpack = require("webpack");

const common = require("./webpack.common.js");

const package = require("./package.json");

// Fix localhost resolving in Node 17+
Dns.setDefaultResultOrder("ipv4first");

module.exports = merge({}, common, {
    mode: "development",
    devtool: "eval-source-map",
    devServer: {
        hot: true,
        port: package.webpackPort,
        devMiddleware: {
            publicPath: ""
        },
        historyApiFallback: true,
        proxy: [
            {
                context: ["/api"],
                target: "http://localhost:8082",
                secure: false,
                changeOrigin: true,
                logLevel: "debug"
            }
        ]
    },
    plugins: [
        // Variables injected into the application
        new Webpack.DefinePlugin({
            // Styled components build flag
            SC_DISABLE_SPEEDY: false
        })
    ]
});
