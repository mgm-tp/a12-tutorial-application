import { merge } from "webpack-merge";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";

import common from "./webpack.common.js";

export default merge({}, common, {
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
                exclude: /[\\/](node_modules|src[\\/]tests)[\\/]/
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
