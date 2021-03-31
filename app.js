// 路由中间件

//引入模块
const express = require('express');
//开启跨域
const cors = require('cors');

const app = express();
//解决跨域
app.use(cors());

//启动服务器
app.listen(3000, () => {
    console.log('服务器3000启动成功....');

})