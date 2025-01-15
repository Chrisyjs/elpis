const webpack = require('webpack');
const webProdConfig = require('./config/webpack.prod.js')

console.log(' --- building ---')

webpack(webProdConfig, (err, stats) => {
    if (err) {
        console.log(err)
        return;
    }
    process.stdout.write(`${stats.toString({
        colors: true, // 控制台输出颜色信息
        modules: false, // 不显示打包信息
        children: false, // 不显示子编译任务的信息
        chunks: false, // 不显示每个代码块的信息
        chunkModules: true, // 显示代码块中模块的信息
    })}\n`)
})