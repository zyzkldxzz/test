const jwt = require('jsonwebtoken');
const {secret} = require('../config/config');

module.exports = (req, res, next) => {
    let token = req.get('token');
    if(!token){
      return res.json({
        code: '2003',
        msg:'token缺失',
        data:null
      })
    }
    jwt.verify(token, secret, (err, data) => {
      if(err){
        return res.json({
          code: '2004',
          msg: 'token校验失败',
          data: null
        })
      }
      // 保存用户信息以便区分用户，data里是token，token是根据username生成的
      req.user = data;
      next();
    })
}