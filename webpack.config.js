const path = require('path')
const webpack = require('webpack')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
  entry: {
    index: './src/js/index.js',
    vendor: ['vue']
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        loader: 'babel-loader',
        options: {
          presets: [
            ['env', {
              browsers: require('./package.json').browserslist
            }]
          ]
        }
      },
      {
        test: /\.vue?$/,
        include: [
          path.resolve(__dirname, 'src')
        ],
        loader: 'vue-loader',
        options: {
          loaders: {
            js: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['env', {
                    browsers: require('./package.json').browserslist
                  }]
                ]
              }
            },
            sass: {
              loader: 'style-loader!css-loader?url=false!sass-loader?indentedSyntax=true'
            }
          },
          postcss: [require('autoprefixer')()]
        }
      }
    ]
  },
  plugins: [
    // new UglifyJsPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    })
  ],
  resolve: {
    alias: {
      vue$: path.resolve(__dirname, 'node_modules/vue/dist/vue.esm.js')
    }
  }
}
