import path from "path";
import { Configuration } from "webpack";

const mode =
  process.env.NODE_ENV === "production" ? "production" : "development";

const config: Configuration = {
  mode,
  devtool: mode === "development" ? "source-map" : false,
  target: "node",
  entry: path.resolve(__dirname, "src", "index.ts"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    clean: true,
  },
  resolve: {
    extensions: [".ts", ".js", ".json"],
  },
  module: {
    rules: [
      {
        test: /\.(t|j)s$/,
        use: [
          {
            loader: "babel-loader",
            options: {
              plugins: [
                [
                  "@babel/plugin-proposal-decorators",
                  { decoratorsBeforeExport: true },
                ],
                "@babel/plugin-proposal-class-properties",
                "babel-plugin-transform-typescript-metadata",
              ],
              presets: ["@babel/preset-env", "@babel/preset-typescript"],
            },
          },
        ],
        exclude: [/node_modules/, path.resolve(__dirname, "src", "tests")],
      },
    ],
  },
};

export default config;
