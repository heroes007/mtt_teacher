let server = (port) => {
    const path = require('path');
    const express = require('express');
    const app = express();

    app.use(express.static('dist'));
    //开启单页路由跳转
    app.get('*',function (req, res) {
        res.sendFile(path.dirname(require.main.filename) + '/dist/index.html');
    });
    app.listen(port, function () {
        console.log('Node app is running, port:' + port + ' \n\n\n\n\n\n');
    });
}
module.exports = server;