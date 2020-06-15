let build = (type) => {
  require('shelljs/global')
  env.NODE_ENV = 'production'

  var path = require('path')
  var config = require('./config')
  var ora = require('ora')
  var webpack = require('webpack')
  var webpackConfig = require('./webpack.prod.conf')
  const TEXT = type == 'production' ? '生产' : '测试'
  var spinner = ora('正在'+TEXT+'环境打包...')

  spinner.start()

  var assetsPath = path.join(config.base.path, config.base.assetsPath)
  rm('-rf', assetsPath)
  mkdir('-p', assetsPath)
  cp('-R', 'static/*', assetsPath)
  var merge = require('webpack-merge')
  let webpackConfig2 = merge(webpackConfig, {
    output: {
      publicPath: type == 'production' ? config.prod.publicPath : config.test.publicPath
    },
    optimization: {
      nodeEnv: type == 'production' ? 'production' : 'testing'
    }
  })
  webpack(webpackConfig2, function (err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n')
  })
}
module.exports = build;
