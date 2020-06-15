var path = require('path')

module.exports = {
    base:{
        path: path.resolve(__dirname,'../server/dist'),
        assetsPath:'static'
    },
    dev:{
        publicPath:'/',
        port: 9999
    },
    prod:{
        // publicPath:'/',
        publicPath:'http://sfile.9mededu.com/mtt_teacher_web/dist/'
    },
    test: {
        // publicPath:'/',
        publicPath:'http://sfile.9mededu.com/mtt_teacher_web_test/dist/',
    }
}
