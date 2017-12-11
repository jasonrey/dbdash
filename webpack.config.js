const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: {
    index: './src/js/index.js',
    vendor: ['vue', 'vue-grid-layout']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.vue?$/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        loader: 'vue-loader'
      },
      {
        test: /\.css?$/,
        loader: 'style-loader!css-loader'
      }
    ]
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ],
  resolve: {
    alias: {
      vue$: path.resolve(__dirname, 'node_modules/vue/dist/vue.esm.js'),
      vuegridlayout$: path.resolve(__dirname, 'node_modules/vue-grid-layout/dist/vue-grid-layout.min.js')
    }
  }
}
