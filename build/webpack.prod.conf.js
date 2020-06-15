var webpack = require('webpack')
var config = require('./config')
var path = require('path')
var merge = require('webpack-merge')
var baseWebpackConfig = require('./webpack.base.conf')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin');

// 需要gzip压缩的文件后缀
const productionGzipExtensions = ['js', 'css']
var webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [["@babel/preset-env",{"targets": { "esmodules": true,"node": true }}]],
            },
          }
        ],
        // include: [pathResolve('node_modules/vue-ueditor')],
        exclude: /(node_modules|bower_components)/
      },
      {
        test: /\.vue$/,
        use: [{
          loader: 'vue-loader',
          options: {
            loaders: {
              less: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"]
            },
          }
        },
          {
            loader: 'iview-loader',
            options: {
              prefix: false
            }
          }]
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      }
    ],
    noParse: /videojs-contrib-hls/
  },
  resolve: {
    //切换min，去掉警告
    alias: {
      'vue$': 'vue/dist/vue.min.js'
    }
  },
  output: {
    filename: config.base.assetsPath + '/js/[name].[hash].js',
    chunkFilename: config.base.assetsPath + '/js/[name].[chunkhash].js'
  },
  performance: {
    hints: false
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        test: /\.js(\?.*)?$/i,
        include: /\/includes/,
        exclude: /\/excludes/,
        cache: true,
        parallel: true,
        sourceMap: true,
        uglifyOptions: {
          warnings: false,
          mangle: true, // Note `mangle.properties` is `false` by default.
          toplevel: false,
          ie8: false,
          keep_fnames: false
        }
      }),
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.optimize\.(le|c)ss$/g,
        cssProcessor: require('cssnano'),
        cssProcessorOptions: { safe: true, discardComments: { removeAll: true }, autoprefixer: false},
        canPrint: true
      })
    ],
    splitChunks:{
      chunks: 'async',
      minChunks: 1,
      name: false,
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.(less|css)$/,
          chunks: 'all',
          enforce: true
        }
      }
    }
  },
  plugins: [
    new CleanWebpackPlugin([config.base.path]),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: config.base.assetsPath + '/css/[name].[hash].css',
      chunkFilename: config.base.assetsPath + '/css/[name].[chunkhash].css'
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
})

module.exports = webpackConfig
