const { glob } = require('glob');
const path = require('path');
const { sep } = path;

/**
 * controller Loader
 * @param {object} app Koa实例
 * 
 * 加载所有 controller, 可通过 'app.controller.${目录}.${文件}访问'
 * 例子：
 * app/controller
 *  |
 *  | -- custom-module
 *          |
 *          | -- custom-controller.js
 *   
 *      => app.controller.customModule.customController
 */

module.exports = (app) => {
    //读取 app/controller/ 文件夹下所有.js文件
    const controllerPath = path.resolve(app.businessPath, `.${sep}controller`);
    const fileList = glob.sync(path.resolve(controllerPath, `.${sep}**${sep}**.js`))
    
        //遍历所有文件目录,把内容加载到 app.controller 下
        const controller = {}
        fileList.forEach(file=>{
            //提取文件名称
            let name = path.resolve(file);
            //截取路径 把 app/controller/custom-module/custom-controller.js 改为custom-module/custom-controller.js
            name = name.substring(name.lastIndexOf(`controller${sep}`) + `controller${sep}`.length,name.lastIndexOf('.'))
            //把'-'改为驼峰式
            name = name.replace(/[_-][a-z]/ig,(s)=>s.substring(1).toUpperCase())
            //挂载 controller 到内存app对象中
            const tempController = controller;
            const names = name.split(sep);
            for(let i = 0 ,len = names.length; i<len;++i){
                 if(i === len -1){
                    const ControllerModule = require(path.resolve(file))(app); 
                    tempController[names[i]] = new ControllerModule(); 
                 }else{
                    if(!tempController[names[i]]){
                        tempController[names[i]] = {}
                    }
                    tempController = tempController[names[i]]
                 }
            }
        });
        app.controller = controller
}