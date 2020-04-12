const proxyObj = {};

proxyObj['/ws'] = {
    ws: true,
    target:'ws://localhost:8081'
}

proxyObj['/'] = {
    ws: false,
    target:'http://localhost:8081',
    changeOrigin: true,
    pathRewrite: {
        '^/': ''
    }
}

module.exports = {
    // publicPath: '././',   //index.html中js等文件以 ./js/开头
    publicPath: './',   //index.html中js等文件以 js/ 开头
    // 输出文件目录
    outputDir: 'dist',
    devServer: {
        host:'localhost',
        port: 8080,
        proxy: proxyObj
    }
}