/**
 * API 接口路由全部在这里定义
 */

const express = require('express')
const mockjs = require('mockjs')
var db=require('./bean/sql-basic')
const md5=require("crypto-js/md5");
var jwt=require('jsonwebtoken');
var router = express.Router();

//登录接口,更改session状态
router.post('/login',function (req,res,next) {
    const {name = "",pass = ""} = req.body.params|| {};
    var salt="isMyLove"
    var sql="select * from user where name='"+name+"'";
    console.log(pass);
    const md5Password = md5(String(pass)).toString();
    let result={};

    //jwt-令牌操作，避免前端普通的token信息被修改
    const token=jwt.sign(
        {
            data:{name:'ESS'},//用户数据
            exp:Math.floor(Date.now()/1000)+60*60//过期时间（一小时）
        },
        salt //秘钥
    );
    console.log('token',token);

    db.query(sql,function (err,rows,field) {
        if (err){
            //也可以在判断中直接采用res.status(401).json()　
            // 给定错误状态码进行回传，减少前端不必要的判断
            console.log('err',err);
            result={status:'error',error:err}
            send();
        }else{
            if (rows.length === 0){
                result = {code:401,message:"无该用户，请注册！！！"};
                 send();
            }else if (rows[0].password === md5Password) {
                insertToken(name).then((data)=>{
                    result = {code:200,token:data};
                    send();
                });
            }else{
                result = {code:401,message:"密码错误，请重试！！！"};
                send();
            }
        }

        function send(){
            const data=mockjs.mock({
                "data":result,
                "status":'200'
            });
            res.json(data)
        }

    })

        function insertToken(name){
        return new Promise(function (resolve, reject) {
            let token = md5(`${new Date().getDate()}${name}${(Math.random() * 10000).toFixed(0)}`).toString();
            const sql = "update user set ts ='" + token + "' where name='" + name + "'";
            db.query(sql, function (err, rows, field) {
                if (err) {
                    result = {status: 'error', error: err}
                } else {
                    console.log('callback', token);
                    resolve(token);
                }
            })
        });
    }
})

//中间件-保护接口，判断权限
function auth(req,res,next){
    if (req.headers.token){
        //已认证
        next();
    } else{
        res.json({code:401,message:'登录状态异常'})
    }
}

//获取登录用户信息
 router.get('/userInfo',auth,function(req,res,next){
    res.json({code:200,data:{name:'jack'},message:'获取成功'})
 });






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

    if (req.body.name){
        res.send("hello world");
    } else{

    }
});

router.post('/me',function (req,res,next) {
    console.log(req.query);

    var password=md5(req.query.password).toString();
        console.log(password);

        const data=mockjs.mock({
            "data":{
                password:password
            },
            "status":200
        })
    res.json(data);

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
