const path = require("path")
module.exports = (app) => {
    // 配置静态资源根目录
    const koaStatic = require('koa-static')
    app.use(koaStatic(path.resolve(process.cwd(), './app/public')))

    // 模板渲染引擎
    const koaNunjucks = require('koa-nunjucks-2')
    app.use(koaNunjucks({
        ext: "html",
        path: path.join(process.cwd(), "./app/public"),
        nunjucksConfig: {
            noCache: true,
            trimBlocks: true
        }
    }))

    // 引入 ctx.body 解析中间件
    const bodyParser = require('koa-bodyparser');
    app.use(bodyParser({
        formList: '1000mb',
        enableTypes: ['form', 'json', 'text']
    }))

    // 引入异常捕获中间件
    app.use(app.middlewares.errorHandle)

    // 引入 API 合法性校验中间件
    app.use(app.middlewares.apiSignVerify)

    // 引入 API 参数校验中间件
    app.use(app.middlewares.apiParamsVerify)
}