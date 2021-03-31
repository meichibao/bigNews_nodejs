//登录注册模块
const express = require('express');
//创建中间件容器
const router = express.Router();
//sql文件   jwt token
const conn = require('../util/sql.js')
const jwt = require('jsonwebtoken')
router.use(express.urlencoded());

// 用户注册
router.post('/reguser', (req, res) => {
    //获取用户数据  username  password
    // console.log(req.body);
    const { username, password } = req.body;
    // console.log(username, password);
    //拼接sql语句  用户注册是向数据库添加数据,条件是数据库内不能有重复的,所以要先查询username是否存在
    let Sqlstr = `select username from users where username="${username}"`
    conn.query(Sqlstr, (err, result) => {
        if (err) throw res.json({ "status": 1, "message": "服务器错误!" });
        // console.log(result);
        // 成功  判断result的长度 如果大于0说明存在这个用户名
        if (result.length > 0) {
            res.json({ "status": 1, "message": "用户名已存在,注册失败!" });
            return;
        }
        //如果不存在,则往数据库添加数据
        //拼接数据库
        Sqlstr = `insert into users(username,password) values("${username}","${password}")`
        conn.query(Sqlstr, (err, result) => {
            if (err) throw res.json({ "status": 1, "message": "注册失败!" });
            res.json({ "status": 0, "message": "注册成功!" });
        })
    })


})

//用户登录
router.post('/login', (req, res) => {
    //获取数据
    // console.log(req.body);
    const { username, password } = req.body;
    //拼接sql语句   登录其实就是查询数据库内是否有该用户名和密码
    let Sqlstr = `select * from users where username="${username}" and password="${password}"`;
    conn.query(Sqlstr, (err, result) => {
        if (err) throw res.json({ "status": 1, "message": "服务器错误!" });
        //成功
        // console.log(result);
        //判断能否查找到用户名密码一致的数据 
        if (result.length < 1) {
            res.json({ "status": 1, "message": "用户名或密码错误!" });
            return;
        }
        //查询到用户名密码一致的数据
        // 生成token                  userpwd  密码钥匙  在后期验证时候需要用到   expiresIn  有效期  秒为单位
        const token = 'Bearer ' + jwt.sign({ name: username }, 'bigNews', { expiresIn: 5000 })
        res.json({ "status": 0, "message": "登录成功!", token });

    })

})
//导出
module.exports = router;