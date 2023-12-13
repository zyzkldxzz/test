const express = require('express');
const moment = require('moment');
const AccountModel = require('../../models/AccountModel');
const checkLoginMiddleWare = require('../../middleWares/checkLogin');
// 创建路由对象
const router = express.Router();

// 添加首页路由规则
router.get('/', (req, res) => {
  res.redirect('/account');
})

// 记账本的列表
router.get('/account', checkLoginMiddleWare, function(req, res, next) {
  AccountModel.find().sort({time: -1}).then(data =>{
    res.render('list', {accounts: data, moment: moment});
  }).catch(err => {
    console.log(err);
    res.status(500).send('读取失败~');
    return;
  })
});

router.get('/account/create', checkLoginMiddleWare, function(req, res, next){
  res.render('create');
});

router.post('/account', checkLoginMiddleWare, (req, res) => {
  // 也可以在外部修改time的类型
  // req.body.time = moment(req.body.time).toDate()
  AccountModel.create({
    ...req.body,
    // 借助moment工具包将时间的字符串转换为Date类型，覆盖上面body里的time
    time: moment(req.body.time).toDate()
  }).then(data => {
    console.log(data);
  }).catch(err => {
    res.status(500).send('插入失败~');
    return;
  })
  res.render('success', {msg: '添加成功！！！', url: '/account'});
})

router.get('/account/:id', checkLoginMiddleWare, (req, res) => {
  let id = req.params.id;
  AccountModel.deleteOne({_id: id}).then(data =>{
    res.render('success',{msg: '删除成功~~', url: '/account'});
  }).catch(err => {
    console.log(err);
    res.status(500).send('读取失败~');
    return;
  }) 
})

module.exports = router;
