// 引用express模块
const express = require('express');
const router = require('./router');
const cs = require('cookie-session');

// 创建express方法
const app = express();

// 创建cookie
app.use(cs({
  name: 'sessionId', // 网页上看到的cookie名称
  keys: ['hhhfdhfd'], //加密
}))

// 使用static方法加载静态资源
app.use(express.static('public'));

// 使用express-art-template渲染页面
app.engine('html',require('express-art-template'))

// 使用外置路由，处理请求
app.use(router);

// 监听8888端口，启动服务器
app.listen(8888,()=>{
  console.log("请访问127.0.0.1:8888");
});