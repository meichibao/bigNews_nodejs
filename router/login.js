//登录注册模块
const express = require('express');
//创建中间件容器
const router = express.Router();
//sql文件   jwt token
const conn = require('../util/sql.js')
const jwt = require('jsonwebtoken')
router.use(express.urlencoded())

//导出
module.exports = router;