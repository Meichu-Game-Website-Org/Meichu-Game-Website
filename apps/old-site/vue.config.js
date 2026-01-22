const path = require('path')
const webpack = require('webpack')

module.exports = {
  transpileDependencies: [
    '@meichu/services'
  ],
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        '$': 'jquery',
        jQuery: 'jquery',
      }),
      // new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],
  },
  devServer: {
    // historyApiFallback: true,
      // sockHost: 'local.vt.guru',
    // public: 'test.meichu.games',
    host: '0.0.0.0',
    hot: true,
    hotOnly: true,
    disableHostCheck: true
    // host: 'local.meichu.games'
  },
  // publicPath: "./"
}
