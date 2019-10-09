'use strict';

//链接数据库
// db.js

const Sequelize = require('sequelize');
const config=require("../config");

module.exports=new Sequelize(config.database,config.username,config.password,{
    host:config.host,
    dialect:'mysql',
    pool:{
        max:5,
        min:0,
        idle:30000
    }
});
