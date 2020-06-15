// env.NODE_ENV = JSON.stringify('development')

var config = require('./config')
var path = require('path')

var webpack = require('webpack')

var webpackDevServer = require('webpack-dev-server');
var ora = require('ora')
var opn = require('opn')

var webpackConfig = require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port

var compiler = webpack(webpackConfig)
var server = new webpackDevServer(compiler, {
    hot: true,
    noInfo: false,
    publicPath: webpackConfig.output.publicPath,
    historyApiFallback: true,
    // compress:true,
    stats: { 
      colors: true,
      chunks: false 
    }
});

var spinner = ora('正在开发环境打包...')
spinner.start()

server.listen(port, "0.0.0.0");
var url = `http://localhost:${port}`;

server.middleware.waitUntilValid(function() {
    spinner.stop()
    console.log(`> 打包成功，URL地址： ${url}`);
    opn(url);
});