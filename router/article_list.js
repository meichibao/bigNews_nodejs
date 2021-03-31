//文章列表区域
const express = require('express');
//创建中间件容器
const router = express.Router();
//sql文件   jwt token
const conn = require('../util/sql.js')
const jwt = require('jsonwebtoken')
router.use(express.urlencoded())

//获取文章分类列表
router.get('/cates', (req, res) => {
    // console.log(req.query);
    // 没有参数,获取所有分类
    // sql语句
    let Sqlstr = `select * from categories`;
    conn.query(Sqlstr, (err, result) => {
        if (err) throw res.json({ "status": 1, "message": "服务器错误" })
        res.json({ "status": 0, "message": "获取文章分类列表成功！", data: result })
    })
    // res.json('okk')
})

//新增文章分类
router.post('/addcates', (req, res) => {
    // console.log(req.body);
    const { name, slug } = req.body;
    //新增的内容不能与已有的重复
    //先查询后添加
    let Sqlstr = `select * from categories where name="${name}" and slug="${slug}"`
    conn.query(Sqlstr, (err, result) => {
        if (err) throw res.json({ "status": 1, "message": "服务器错误" })
        // console.log(result);
        //说明已经存在
        if (result.length > 0) {
            res.json({ "status": 1, "message": "您添加的分类已存在,请重新输入" })
            return;
        }
        //如果不存在
        Sqlstr = `insert into categories(name,slug) values("${name}","${slug}")`
        conn.query(Sqlstr, (err, result) => {
            if (err) throw res.json({ "status": 1, "message": "服务器错误" });
            res.json({ "status": 1, "message": "新增文章分类成功!" })
        })

    })
})

//根据id删除文章分类
router.get('/deletecate', (req, res) => {
    // 获取数据
    // console.log(req.query);
    const { id } = req.query
    let Sqlstr = `delete from categories where id=${id}`
    conn.query(Sqlstr, (err, result) => {
        if (err) throw res.json({ "status": 1, "message": "服务器错误" });
        //result.affectedRows 受影响的行   数据库没有这条数据  
        // console.log(result);
        if (result.affectedRows < 1) {
            res.json({ "status": 1, "message": "删除失败,没有该数据" });
            return;
        }
        res.json({ "status": 0, "message": "删除文章分类成功！" });
    })
    // res.json('okkk')
});

//根据id获取文章分类 
router.get('/getCatesById', (req, res) => {
    // 获取数据
    // console.log(req.query);
    const { id } = req.query;
    let Sqlstr = `select * from categories where id=${id}`
    conn.query(Sqlstr, (err, result) => {
        if (err) throw res.json({ "status": 1, "message": "服务器错误" });
        if (result.length < 1) {
            res.json({ "status": 1, "message": "获取文章分类失败,没有该数据" });
            return;
        }
        res.json({ "status": 0, "message": "获取文章分类成功!", "data": result });
    })
})

//根据id更新文章分类数据
router.post('/updatecate', (req, res) => {
    // 获取数据
    // console.log(req.query);
    const { id, name, slug } = req.body;
    let Sqlstr = `update categories set name="${name}",slug="${slug}" where id=${id}`
    console.log(Sqlstr);
    conn.query(Sqlstr, (err, result) => {
        console.log(err);

        if (err) throw res.json({ "status": 1, "message": "服务器错误" });
        if (result.affectedRows < 1) {
            res.json({ "status": 1, "message": "更新文章分类失败" });
            return;
        }
        res.json({ "status": 0, "message": "更新文章分类成功!", "data": result });
    })
})

//导出
module.exports = router;