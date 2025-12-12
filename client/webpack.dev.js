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
