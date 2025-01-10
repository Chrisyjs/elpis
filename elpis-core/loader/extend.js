const { glob } = require('glob');
const path = require('path');
const { sep } = path;

/**
 * extend Loader
 * @param {object} app Koa实例
 * 
 * 加载所有 extend, 可通过 'app.extend.${文件}访问'
 * 例子：
 * app/extend
 *  |
 *  | -- custom-extend
 *   
 *      => app.extend.customExtend
 */

module.exports = (app) => {
    //读取 app/extend/ 文件夹下所有.js文件
    const extendPath = path.resolve(app.businessPath, `${sep}extend`);
    const fileList = glob.sync(path.resolve(extendPath, `${sep}**${sep}**.js`))
    
        //遍历所有文件目录,把内容加载到 app.extend 下
        const extend = {}
        fileList.forEach(file=>{
            //提取文件名称
            let name = path.resolve(file);
            //截取路径 把 app/extend/custom-extend.js 改为custom-extend.js
            name = name.substring(name.lastIndexOf(`extend${sep}`) + `extend${sep}`.length,name.lastIndexOf('.'))
            //把'-'改为驼峰式
            name = name.replace(/[_-][a-z]/ig,(s)=>s.substring(1).toUpperCase())

            //过滤 app 已存在的Key，做重名处理
            for(const key in app){
                if(key === name){
                    console.log(`[extend load error] name:${name} is already in app`)
                    return 
                }
            }
            app[name] = require(path.resolve(file))(app);
        });
} 