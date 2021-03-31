// 路由中间件
//引入模块
const express = require('express');
//开启跨域
const cors = require('cors');

const app = express();
//解决跨域
app.use(cors());

//静态资源管理
app.use('/uploads', express.static('uploads'));

// 生成token和验证
// 4.0 设置jwt
/*  
 请使用  npm i express-jwt --save 安装express-jwt包
*/
const jwt = require('express-jwt');
// app.use(jwt().unless());
// jwt() 用于解析token，并将 token 中保存的数据 赋值给 req.user
// unless() 约定某个接口不需要身份认证
app.use(jwt({
    secret: 'bigNews', // 生成token时的 钥匙，必须统一
    algorithms: ['HS256'] // 必填，加密算法，无需了解
}).unless({
    path: ['/api/login', '/api/reguser', /^\/uploads\/.*/] // 除了这两个接口，其他都需要认证
}));


//路由中间件
const Login = require('./router/login.js')
const article_List = require('./router/article_list.js')
const Persona = require('./router/persona.js')
app.use('/api', Login);
app.use('/my', article_List);
app.use('/my/article', Persona);


// 6.0 错误处理中间件用来检查token合法性
app.use((err, req, res, next) => {
    console.log('有错误', err)
    if (err.name === 'UnauthorizedError') {
        // res.status(401).send('invalid token...');
        res.status(401).send({ code: 1, message: '身份认证失败！' });
    }
});



//启动服务器
app.listen(3000, () => {
    console.log('服务器3000启动成功....');

})