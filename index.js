const Koa = require('koa');

//创建koa实例

const app = new Koa();

//启动服务

const port = process.env.PORT || 8080;
const host = process.env.IP || '0.0.0.0'

app.listen(port,host);

console.log(`服务已启动,端口号：${port}`)