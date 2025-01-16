// 本地开发启动 devServer
const express = require('express')
const path = require('path')
const webpack = require('webpack');
const divMiddleware = require('webpack-dev-middleware')
const hotMiddleware = require('webpack-hot-middleware')

const app = express();

// 从 webpack.dev.js 获取 webpackConfig 和 devServer 配置
const {
    webpackConfig,
    DEV_SERVER_CONFIG
} = require('./config/webpack.dev.js')

const compiler = webpack(webpackConfig)

// 指定静态文件目录
app.use(express.static(path.join(__dirname, '../public/dist')))

// 引用 divMiddleware 中间件 （监控文件改动）
app.use(divMiddleware(compiler, {
    // 落地文件
    writeToDisk: (filePath) => filePath.endsWith('html'),
    // 资源路径
    publicPath: webpackConfig.output.publicPath,
    // headers 配置
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
        'Access-Control-Allow-Headers': 'X-Request-With, content-type, Authorization',
    },
    stats: {
        colors: true
    }
}))
// 引用 hotMiddleware 中间件 （实现热更新通讯）
app.use(hotMiddleware(compiler, {
    path: `/${DEV_SERVER_CONFIG.HMR_PATH}`,
    log: () => { }
}))

console.info(' --- 请等待webpack初次构建 ---')
console.info(' --- devServer ---')
const port = DEV_SERVER_CONFIG.PORT

app.listen(port, () => {
    console.log(`服务已启动,端口号：${port}`)
})