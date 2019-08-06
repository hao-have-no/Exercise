/**
 * API 接口路由全部在这里定义
 */

const express = require('express')
const mockjs = require('mockjs')
var db=require('./bean/sql-basic')

var router = express.Router()



//登录接口,更改session状态
router.get('/login', function (req, res,next) {
    var myDate = new Date();
    var ts=Math.ceil(myDate.getTime()/1000);
    var sql="update user set ts ='"+ts+"' where personId='123'";

    db.query(sql,function (err,rows,field) {
        if (err){
            console.log(err);
        }
        var result='login';

        const data=mockjs.mock({
            "data":{
                message:result
            },
            "status":200
        })

        res.json(data)
    })
})


//纪录每个人在系统里的浏览记录
router.get('/pageInfo',function(req,res,next){
    var sql=
    "insert into "+"`page-info`"+`(user_id,page,page_name,stay_time) values ("${req.query.userId}","${req.query.page}","${req.query.pageName}","${req.query.stayTime}")`;
    db.query(sql,function (err,rows,field) {
       if (err) {
           console.log(err);
       }
        const data=mockjs.mock({
            "data":{
                "data":"ok"
            },
            "status":200
        });
        res.json(data);
    });
});

router.get('/pageView',function (req,res,next) {
    var sql = "select page,page_name,round(sum(stay_time),2) sum,count(*) count from `page-info` group by page,page_name order by count(*)";
    db.query(sql,function (err,rows,field) {
        if (err){
            console.log(err);
        }
        const data=mockjs.mock({
            "data":rows,
            status:200
        });
        res.json(data);
    })
})


//注销接口,更改session状态
router.get('/logout', function (req, res,next) {
    var sql="update user set ts ='0' where personId='123'";
    db.query(sql,function (err,rows,field) {
        if (err){
            console.log(err);
        }
        var result="logout";

        const data=mockjs.mock({
            "data":{
                message:result
            },
            "status":200
        });

        res.json(data)
    })
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
    var sql="select ts from user where personId='123'";

    db.query(sql,function (err,rows,field) {
        if (err){
            console.log(err);
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

/**
 * 获取慢病数据
 * @type {Router|router}
 */
router.get('/disease/list', function(req, res, next) {
    var data = mockjs.mock({
        "data":{
            "id":59,
            "name":null,
            "label":"时间轴_历次就诊信息",
            "type":null,
            "limits":null,
            "result":[
                {
                    "pati_id":"0020404703",
                    "xl_patient_id":"501_0020404703",
                    "xl_medical_id":"501_2_1",
                    "medical_date":"2017-06-29 15:34:00",
                    "medical_type_id":"3",
                    "title":"住院_呼吸科",
                    "note":"睡眠呼吸暂停低通气综合征"
                },
                {
                    "pati_id":"0020404703",
                    "xl_patient_id":"501_0020404703",
                    "xl_medical_id":"501_1_1",
                    "medical_date":"2017-06-29 00:00:00",
                    "medical_type_id":"2",
                    "title":"门诊_呼吸科",
                    "note":"睡眠呼吸暂停综合征"
                },
                {
                    "pati_id":"0020404703",
                    "xl_patient_id":"501_0020402312",
                    "xl_medical_id":"501_2_3",
                    "medical_date":"2019-06-19 00:00:00",
                    "medical_type_id":"4",
                    "title":"慢病_呼吸科",
                    "note":"睡眠测试综合征"
                }
            ],
            "status":"ok"
        },
        "status":"ok",
        "description":"数据请求成功"
    });

    res.json(data)
});

router.get('/disease/list',function () {
    
})

module.exports =  router
