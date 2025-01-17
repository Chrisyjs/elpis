const path = require('path')
const merge = require('webpack-merge')
const webpack = require('webpack')

// 获取基类配置
const baseConfig = require('./webpack.base')

// devServer 配置
const DEV_SERVER_CONFIG = {
    HOST: '127.0.0.1',
    PORT: 9002,
    HMR_PATH: '__webpack_hrm', //官方规定
    TIMEOUT: 20000,
}

// 开发阶段的 entry 配置需要引入 hmr
Object.keys(baseConfig.entry).forEach(v => {
    // 第三方包不作为 entry 入口
    if (v !== 'vendor') {
        baseConfig.entry[v] = [
            // 主入口文件
            baseConfig.entry[v],
            // hmr 更新入口，官方指定的 hmr 路径
            `webpack-hot-middleware/client?path=http://${DEV_SERVER_CONFIG.HOST}:${DEV_SERVER_CONFIG.PORT}/${DEV_SERVER_CONFIG.HMR_PATH}?timeout=${DEV_SERVER_CONFIG.TIMEOUT}`
        ]
    }
})

const webpackConfig = merge.smart(baseConfig, {
    // 指定开发环境模式
    mode: 'development',
    // source-map 开发工具，呈现代码的映射关系，便于在开发过程中进行代码调试
    devtool: 'eval-cheap-module-source-map',
    output: {
        filename: 'js/[name]_[chunkhash:8].bundle.js',// 输出文件名称
        path: path.resolve(process.cwd(), './app/public/dist/dev/'), // 输出文件路径
        publicPath: `http://${DEV_SERVER_CONFIG.HOST}:${DEV_SERVER_CONFIG.PORT}/public/dist/dev`, // 外部资源公共路径
        globalObject: 'this'
    },
    plugins: [
        // HMR 热更新
        new webpack.HotModuleReplacementPlugin({
            multiStep: false
        })
    ]
})

module.exports = {
    // webpack 配置
    webpackConfig,
    // devServer 配置
    DEV_SERVER_CONFIG
}