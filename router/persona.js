//个人中心模块
const express = require('express');
//创建中间件容器
const router = express.Router();
//文件上传模块
const multer = require('multer');
// console.log(multer);
//配置 上传的文件会保存在uploads文件下  
// const upload = multer({ dest: 'uploads' })
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        // console.log('file', file)
        // const filenameArr = file.originalname.split('.');
        cb(null, file.originalname) //+ "." + filenameArr[filenameArr.length - 1]);
    }
});
const upload = multer({ storage })

//sql文件   jwt token
const conn = require('../util/sql.js')
const jwt = require('jsonwebtoken')
router.use(express.urlencoded());

//获取用户基本信息
router.get('/userinfo', (req, res) => {
    // console.log(req.query);
    //获取数据
    const { username } = req.query;
    //拼接sql语句
    let Sqlstr = `select * from users where username="${username}"`
    conn.query(Sqlstr, (err, result) => {
        if (err) throw res.json({
            "status": 1,
            "message": "服务器错误！"
        })
        //成功  判断数据库内是否有该数据
        if (result.length < 1) {
            res.json({
                "status": 1,
                "message": "获取用户基本信息失败！"
            })
            return;
        }
        res.json({
            "status": 0,
            "message": "获取用户基本信息成功！",
            "data": result
        })
    })
    // res.json('ok')
})

//更新用户基本信息
router.post('/userinfo', (req, res) => {
    // 获取数据
    // console.log(req.body);
    const { id, nickname, email, userPic } = req.body;
    //拼接sql语句  这些属性都是必传属性  所以无需判断客户端是否有传
    let Sqlstr = `update users set id=${id},nickname="${nickname}",email="${email}",userPic="${userPic}" where id=${id}`;
    conn.query(Sqlstr, (err, result) => {
        if (err) throw res.json({ "status": 1, "message": "服务器错误" })
        // result.affectedRows 受影响的行数  小于1表示没有找到
        // console.log(result.affectedRows);
        if (result.affectedRows < 1) {
            res.json({ "status": 1, "message": "用户信息修改失败" });
            return;
        }
        res.json({ "status": 0, "message": "用户信息修改成功" })
    })
})

//上传用户头像
router.post('/uploadPic', upload.single('file_data'), (req, res) => {
    // console.log(req.file);
    res.json({ "status": 0, "message": "http://127.0.0.1:3000/uploads/" + req.file.filename })
});

//重置密码
router.post('/updatepwd', (req, res) => {
    //获取数据
    const { oldPwd, newPwd, id } = req.body;
    // console.log(oldPwd, newPwd, id);
    //拼接数据库语句   需要两个判断,判断id与密码是否一致
    let Sqlstr = `update users set password="${newPwd}" where id=${id} and password="${oldPwd}"`;
    conn.query(Sqlstr, (err, result) => {
        if (err) throw res.json({ "status": 1, "message": "服务器错误" })
        console.log(result);
        // result.affectedRows 受影响的行数  小于1表示没有找到
        // console.log(result.affectedRows);
        if (result.affectedRows < 1) {
            res.json({ "status": 1, "message": "密吗修改失败" });
            return;
        }
        res.json({ "status": 0, "message": "密码修改成功" })
    })
    // res.json('ok')
});



//导出
module.exports = router;