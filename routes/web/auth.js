var express = require('express');
var router = express.Router();
const AuthModel = require('../../models/AuthModel');
const md5 = require('md5');


// 注册页面
router.get('/reg', function(req, res) {
    res.render('auth/reg');
});
// 用户注册
router.post('/reg', (req, res) => {
    // 使用md5对密码加密
    AuthModel.create({...req.body, password: md5(req.body.password)}).then(data => {
        res.render('success',{msg: '注册成功！', url: '/login'});
    }).catch(err => {
        res.status(500).send('注册失败');
    })
})

// 登录页面
router.get('/login', function(req, res){
    res.render('auth/login');
});

// 用户登录
router.post('/login', (req, res) => {
    let {username, password} = req.body;
    if(username && password){
        AuthModel.findOne({username: username, password: md5(password)}).then(data => {
            if(!data){
                res.send('用户名或密码输入错误');
            }else{
                // 写入id
                req.session.username = data.username;
                req.session._id = data._id;
                res.render('success',{msg: '登录成功！', url: '/account'});
                // res.redirect('/account');
            }
        }).catch(err => {
            res.status(500).send('登录失败');
        })
    }else{
        res.render('auth/login');
    }
})

// 退出登录，为了避免CSRF跨站请求伪造使用POST方法
router.post('/logout', (req, res) => {
    // 销毁session
    req.session.destroy(() => {
        res.render('success', {msg: '退出成功', url: '/login'});
    })
})

module.exports = router;
