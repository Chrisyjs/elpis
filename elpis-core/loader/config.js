const path = require('path')
const { sep } = path

/**
 * config Loader
 * @param {object} app Koa 实例
 * 
 * 配置区分 本地/测试/生产，通过 env 环境读取不同文件的配置 env.config
 * 通过 env.config 覆盖 default.config 加载到 app.config 里
 * 
 * 目录下对应config配置
 * 默认：config/config.default.js
 * 本地：config/config.local.js
 * 测试：config/config.beta.js
 * 生产：config/config.prod.js
 */

module.exports = (app) => {
    // 找到config/目录
    const configPath = path.resolve(app.baseDir, `.${sep}config`);
    // 获取default.config配置
    let defaultConfig = {}
    try {
        defaultConfig = require(path.resolve(configPath, `.${sep}config.default.js`))
    } catch (e) {
        console.log('[exception] there is no default.config file')
    }
    // 获取env.config配置
    let envConfig = {}
    try {
        if (app.env.isLocal()) { //本地环境
            envConfig = require(path.resolve(configPath, `.${sep}config.local.js`))
        } else if (app.env.isBeta()) { //测试环境
            envConfig = require(path.resolve(configPath, `.${sep}config.beta.js`))
        } else if (app.env.isProduction()) { //生产环境
            envConfig = require(path.resolve(configPath, `.${sep}config.prod.js`))
        }
    } catch (e) {
        console.log('[exception] there is no default.config file')
    }
    app.config = Object.assign({}, defaultConfig, envConfig)
}