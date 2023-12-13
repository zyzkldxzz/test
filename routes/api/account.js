const express = require('express');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const AccountModel = require('../../models/AccountModel');
const checkTokenMiddleWare = require('../../middleWares/checkToken');

const router = express.Router();

router.get('/account', checkTokenMiddleWare, function(req, res, next) {
  console.log(req.user);
  // 后面应该根据用户id或username查找其对应的账单信息
  AccountModel.find().sort({time: -1}).then(data =>{
    res.json({
        // 响应编码
        code: '0000',
        // 响应信息
        msg: '读取成功',
        // 响应数据
        data: data
    });
  }).catch(err => {
    res.json({
        code: '1001',
        msg: '读取失败',
        data: null
    });
    return;
  })
});


router.post('/account', checkTokenMiddleWare, (req, res) => {
    // 在这里还可以添加表单验证
  AccountModel.create({
    ...req.body,
    time: moment(req.body.time).toDate()
  }).then(data => {
    res.json({
        code: '0000',
        msg: '新增成功',
        data: data
      });
  }).catch(err => {
    res.json({
        code: '1002',
        msg: '新增失败',
        data: null
    });
    return;
  })
  
})

router.delete('/account/:id', checkTokenMiddleWare, (req, res) => {
  let id = req.params.id;
  AccountModel.deleteOne({_id: id}).then(data =>{
    res.json({
        code: '0000',
        msg: '删除成功',
        data: data
    });
  }).catch(err => {
    res.json({
        code: '1003',
        msg: '删除失败',
        data: null
    });
    return;
  }) 
})

// 获取单条
router.get('/account/:id', checkTokenMiddleWare, (req, res) => {
    let id = req.params.id;
    AccountModel.findById(id).then(data => {
        res.json({
            code: '0000',
            msg: '获取成功',
            data: data
        });
    }).catch(err => {
        res.json({
            code: '1004',
            msg: '获取失败',
            data: null
        });
        return;
    })
})

// 修改
router.patch('/account/:id', checkTokenMiddleWare, (req, res) => {
    let {id} = req.params;
    AccountModel.updateOne({_id:id}, req.body).then(data => {
        // 再次查询数据库获取单挑数据
        AccountModel.findById(id).then(data2 => {
            res.json({
                code: '0000',
                msg: '修改成功',
                data: data2
            })
        }).catch(err => {
            res.json({
                code: '1004',
                msg: '修改失败',
                data: null
            })
        })
    }).catch(err => {
        res.json({
            code: '1005',
            msg: '修改失败',
            data: null
        })
    })
})

module.exports = router;
