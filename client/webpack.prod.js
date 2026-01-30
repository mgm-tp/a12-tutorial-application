const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const { merge } = require("webpack-merge");

const common = require("./webpack.common.js");

module.exports = merge({}, common, {
    mode: "production",
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
            }
        ]
    },
    plugins: [new CleanWebpackPlugin()],
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: /^\**!|@preserve|@license|@cc_on|copyright/i
            })
        ]
    }
});
