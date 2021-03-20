const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: 'development',
  entry: "./src/index.js",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      }
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
        { from: "./src/index.html", to: "index.html" },
        { from: "./src/favicon.ico", to: "favicon.ico" },
        { from: "./src/css", to: "css" },
        { from: "./src/webfonts", to: "webfonts" },
        { from: "./src/js", to: "js" },
        { from: "./src/img", to: "img" },
    ]),
  ],
  devServer: { contentBase: path.join(__dirname, "dist"), compress: false },
};
