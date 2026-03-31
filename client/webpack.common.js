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
