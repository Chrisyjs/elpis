const merge = require('webpack-merge')
// 获取基类配置
const baseConfig = require('./webpack.base')

const webpackConfig = merge.smart(baseConfig, {
    // 指定环境配置
    mode: 'development',
    // 生产环境的 output 
    output: {
    },
})

module.exports = webpackConfig