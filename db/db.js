// 封装为一个函数，传递两个回调函数的参数

module.exports = function(success, error){
    // 在使用时可以省略error函数，如果未传入在这里创建该函数作为默认值
    if(typeof error !== 'function'){
        error = () => {
            console.log('连接失败……');
        }
    }

    const mongoose = require('mongoose');
    const {DBHOST, DBPORT, DBNAME} = require('../config/config');

    mongoose.connect(`mongodb://${DBHOST}:${DBPORT}/${DBNAME}`);
    
    mongoose.connection.once('open', () => {
        success();
    });
    mongoose.connection.once('error', () => {
        error();
    });
    mongoose.connection.once('close', () => {
        console.log('连接关闭');
    });
}
