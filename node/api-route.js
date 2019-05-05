/**
 * API 接口路由全部在这里定义
 */

const express = require('express')
const mockjs = require('mockjs')
var db=require('./bean/sql-basic')

var router = express.Router()


//登录接口,更改session状态
router.get('/login', function (req, res,next) {
        update();

        res.send(true);
})

function getSesson(){
    var sql="select ts from user where person-id='123'";

    db.query(sql,function (err,rows,field) {
        if (err){
            console.log(err);
            return ;
        }
    })
}

function update(){
    var myDate = new Date();
    var ts=myDate.getTime();

    var sql="update user set ts ='"+ts+"' where personId='123'";

    db.query(sql,function (err,rows,field) {
        if (err){
            console.log(err);
            return ;
        }
        return rows;
    })
}

//注销接口,更改session状态
router.get('/logout', function (req, res,next) {
    req.session.login = false,
        res.send(false)
})
//私密接口
router.get('/',function (req,res,next) {

    if (req.session.login){
        res.send("hello world");
    } else{
        res.send(403);
    }
});

router.get('/me',function (req,res,next) {
    if( req.session.login){
        res.send(true)
    }else{
        res.send(false)
    }
});

router.get('/select', function(req, res, next) {
    var sql="select * from user";

    db.query(sql,function (err,rows,field) {
        if (err){
            return ;
        }
        const data=mockjs.mock({
            "data":{
                message:rows
            },
            "status":200
        })
        res.json(data)
    })
});

router.get('/basic/info/:patientId', function(req, res, next) {
patientId = req.query.patientId

  var data = mockjs.mock({
      "data":{
          "name":"quinn",
          "sex":"男",
          "age":18,
          "patientId":"10001",
          "phone":"18888888888",
          "address":"北京海淀",
          "idType":"身份证",
          "idNumber":"110402199309272232"
      },
      "status":"ok",
      "description":"数据请求成功"
  });

  res.json(data)
});

router.get('/prescription/search', function(req, res, next) {
    keyword = req.query.filter_LIKE_searchValue

    var data = mockjs.mock({
        "data":[
            {
                "id": 1,
                "name":"quinn",
                "sex":"男",
                "age":18,
                "patientId":"10001",
                "phone":"18888888888",
                "address":"北京海淀",
            },
            {
                "id": 2,
                "name":"sunny",
                "sex":"女",
                "age": 20,
                "patientId":"10001",
                "phone":"18888888888",
                "address":"河北石家庄",
            }
        ],
        "status":"ok",
        "description":"数据请求成功"
    });

    res.json(data)
});

module.exports =  router