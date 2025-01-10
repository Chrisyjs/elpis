const Koa = require('koa');
const path = require('path');
const { sep } = path //兼容不同操作系统中的斜杠

const env = require('./env');

const middlewareLoader = require('./loader/middleware')
const routerSchemaLoader = require('./loader/router-schema')
const routerLoader = require('./loader/router')
const controllerLoader = require('./loader/controller')
const serviceLoader = require('./loader/service')
const configLoader = require('./loader/config')
const extendLoader = require('./loader/extend')

module.exports = {
    /**
     * 启动项目
     * @params options 项目配置
     * option = {
     *  name,
     *  homePage
     * }
     */
    start(options = {}) {
        //创建koa实例
        const app = new Koa();
        // 应用配置
        app.options = options;
        //基础路径
        app.baseDir = process.cwd();
        // 业务路径
        app.businessPath = path.resolve(app.baseDir, `.${sep}app`);
        //初始化环境配置
        app.env = env;
        console.log(`===  [start] env: ${app.env.get()} ===`)

        // 加载 middleware
        middlewareLoader(app);
        console.log(`===  [start] load middleware done ===`);

        // 加载 router-schema
        routerSchemaLoader(app);
        console.log(`===  [start] load router-schema done ===`);

        // 加载 controller
        controllerLoader(app);
        console.log(`===  [start] load controller done ===`);

        // 加载 service 
        serviceLoader(app);
        console.log(`===  [start] load service done ===`);

        // 加载 config 
        configLoader(app);
        console.log(`===  [start] load config done ===`);

        // 加载 extend 
        extendLoader(app);
        console.log(`===  [start] load extend done ===`);

        // 注册全局中间件
        try {
            require(`${app.businessPath}${sep}middleware.js`)(app)
            console.log(` == [start] load global middleware done == `)
        } catch (e) {
            console.log(`[exception] there is no middleware file`)
        }
        
        // 加载 router,需要写在加载其他中间件之后，在进行路由分发 
        routerLoader(app);
        console.log(`===  [start] load router done ===`);

        const port = process.env.PORT || 8080;
        const host = process.env.IP || '0.0.0.0';

        app.listen(port, host);

        console.log(`服务已启动,端口号：${port}`)
    }
}
