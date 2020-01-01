const express = require('express');
// 引用第三方模块
const router = express.Router();
const methods = require('./methodsModule');

router
.get('/',methods.getAll)
.get('/detailed',methods.getone)
.get('/update',methods.update_get)
.post('/update',methods.update_post)
.get('/delete',methods.delete_get)
.get('/adduser',methods.add_get)
.post('/adduser',methods.add_post)
.get('/login',methods.login_get)
.post('/login',methods.login_post)

module.exports = router