const express = require('express');
const AuthModel = require('../../models/AuthModel');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const {secret} = require('../../config/config');

var router = express.Router();

// 用户登录
router.post('/login', (req, res) => {
    let {username, password} = req.body;
    AuthModel.findOne({username: username, password: md5(password)}).then(data => {
        if(!data){
            return res.json({
                code: '2002',
                msg: '用户名或密码错误~',
                data: null
            });
        }else{
            let token = jwt.sign({
                username: data.username,
                _id: data._id
            }, secret, {
                expiresIn: 60*60*24*7   // 7天
            });
            res.json({
                code: '0000',
                msg: '登录成功',
                data: token
            })
        }
    }).catch(err => {
        res.json({
            code: '2001',
            msg: '数据库读取失败~',
            data: null
        })

    })
})

// 退出登录
router.post('/logout', (req, res) => {
    // 销毁session
    req.session.destroy(() => {
        res.render('success', {msg: '退出成功', url: '/login'});
    })
})

module.exports = router;
