const { glob } = require('glob');
const path = require('path');
const { sep } = path;

/**
 * service Loader
 * @param {object} app Koa实例
 * 
 * 加载所有 service, 可通过 'app.service.${目录}.${文件}访问'
 * 例子：
 * app/service
 *  |
 *  | -- custom-module
 *          |
 *          | -- custom-service.js
 *   
 *      => app.service.customModule.customService
 */

module.exports = (app) => {
    //读取 app/service/ 文件夹下所有.js文件
    const servicePath = path.resolve(app.businessPath, `${sep}service`);
    const fileList = glob.sync(path.resolve(servicePath, `${sep}**${sep}**.js`))
    
        //遍历所有文件目录,把内容加载到 app.service 下
        const service = {}
        fileList.forEach(file=>{
            //提取文件名称
            let name = path.resolve(file);
            //截取路径 把 app/service/custom-module/custom-service.js 改为custom-module/custom-service.js
            name = name.substring(name.lastIndexOf(`service${sep}`) + `service${sep}`.length,name.lastIndexOf('.'))
            //把'-'改为驼峰式
            name = name.replace(/[_-][a-z]/ig,(s)=>s.substring(1).toUpperCase())
            //挂载 service 到内存app对象中
            const tempService = service;
            const names = name.split(sep);
            for(let i = 0 ,len = names.length; i<len;++i){
                 if(i === len -1){
                    tempService[name[i]] = require(path.resolve(file))(app); 
                 }else{
                    if(!tempService[name[i]]){
                        tempService[name[i]] = {}
                    }
                    tempService = tempService[name[i]]
                 }
            }
        });
        app.service = service
}