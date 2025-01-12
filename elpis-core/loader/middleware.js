const { glob } = require('glob');
const path = require('path');
const { sep } = path;
/**
 * middleware Loader
 * @param {object} app Koa实例
 * 
 * 加载所有 middleware, 可通过 'app.middleware.${目录}.${文件}访问'
 * 例子：
 * app/middleware
 *  |
 *  | -- custom-module
 *          |
 *          | -- custom-middleware.js
 *   
 *      => app.middleware.customModule.customMiddleware
 */

module.exports = (app) => {
    //读取 app/middleware/ 文件夹下所有.js文件
    const middlewarePath = path.resolve(app.businessPath, `.${sep}middleware`);
    const fileList = glob.sync(path.resolve(middlewarePath, `.${sep}**${sep}**.js`))

    //遍历所有文件目录,把内容加载到 app.middlewares 下
    const middlewares = {}
    fileList.forEach(file=>{
        //提取文件名称
        let name = path.resolve(file);
        //截取路径 把 app/middleware/custom-module/custom-middleware.js 改为custom-module/custom-middleware.js
        name = name.substring(name.lastIndexOf(`middleware${sep}`) + `middleware${sep}`.length,name.lastIndexOf('.'))
        //把'-'改为驼峰式
        name = name.replace(/[_-][a-z]/ig,(s)=>s.substring(1).toUpperCase())
        //挂载 middleware 到内存app对象中
        const tempMiddleware = middlewares;
        const names = name.split(sep);
        for(let i = 0 ,len = names.length; i<len;++i){
             if(i === len -1){
                tempMiddleware[names[i]] = require(path.resolve(file))(app); 
             }else{
                if(!tempMiddleware[names[i]]){
                    tempMiddleware[names[i]] = {}
                }
                tempMiddleware = tempMiddleware[names[i]]
             }
        }
    });
    app.middlewares = middlewares
}