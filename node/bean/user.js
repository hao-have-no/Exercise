'use strict';
// user.js
var Sequelize = require('sequelize');
var sequelize = require('./db');



var User=sequelize.define('people',{
    name: {
        primaryKey: true,
        type:Sequelize.STRING
    },
    password: Sequelize.STRING,
    salt: Sequelize.STRING,
    isAdmin: Sequelize.BOOLEAN,
}, {
    // 如果为 true 则表的名称和 model 相同，即 user
    // 为 false MySQL创建的表名称会是复数 users
    // 如果指定的表名称本就是复数形式则不变
    timestamps: false,
    freezeTableName: false
});

// 创建表
// User.sync() 会创建表并且返回一个Promise对象
// 如果 force = true 则会把存在的表（如果users表已存在）先销毁再创建表
// 默认情况下 forse = false
var user = User.sync({ force: false });


// 添加新用户
exports.addUser = function({userName, password,salt,tip}) {
    // 向 user 表中插入数据
    return User.create({
        name: userName,
        password: password,
        salt:salt,
        isAdmin:tip
    });
};



// 通过用户名查找用户
exports.findByName = function(name) {
    return User.findOne({where: {name: name}});
}

//获取任意时间日期
//     function GetDateStr(AddDayCount) {
//     var dd = new Date();
//     dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
//     var y = dd.getFullYear();
//     var m = dd.getMonth()+1;//获取当前月份的日期
//     var d = dd.getDate();
//     return y+"-"+m+"-"+d;
// }
