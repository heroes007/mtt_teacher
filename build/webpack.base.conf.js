var path = require('path')
var config = require('./config')

function pathResolve(relPath) {
  return path.resolve(__dirname, relPath);
}

module.exports = {
  entry: {
      app: ["babel-polyfill", "./src/main.js"]
  },
  output: {
    path: config.base.path
  },
  resolve: {
    extensions: ['.js', '.vue'],
    alias: {
      'src': pathResolve('../src'),
      'assets': pathResolve('../src/assets'),
      'components': pathResolve('../src/components'),
      'views': pathResolve('../src/views'),
      'routes': pathResolve('../src/routes'),
      'store': pathResolve('../src/store'),
      'mix': pathResolve('../src/views/mixins'),
    }
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|jpeg|gif|svg|svgz)(\?.*)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: config.base.assetsPath + '/img/[name].[hash:7].[ext]',
            presets: ['@babel/preset-env'],
            plugins: ['@babel/transform-runtime']
          }
        }]
      },
      {
        test: /\.(woff2|woff|eot|ttf|otf)(\?.*)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: config.base.assetsPath + '/fonts/[name].[hash:7].[ext]'
          }
        }]
      },
      {
        test: /\.less$/,
        use: [{
          loader: "style-loader"
        }, {
          loader: "css-loader"
        }, {
          loader: "less-loader", options: {
            javascriptEnabled: true
          }
        }]
      },
    ]
  },
  // externals: {
  //   'G6': 'G6',
  // },
}
