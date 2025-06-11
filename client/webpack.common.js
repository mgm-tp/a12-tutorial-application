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
            __A12_MODEL_VERSIONS__: JSON.stringify(collectA12ModelVersions()),
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
        extensions: [".tsx", ".ts", ".js"]
    }
};
