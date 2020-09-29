/**
 * API 接口路由全部在这里定义
 */

const express = require('express')
const mockjs = require('mockjs')
var db = require('./bean/sql-basic')
const md5 = require("crypto-js/md5");
var jwt = require('jsonwebtoken');
var router = express.Router();

//增加文件上传
const path = require('path');
const Controller = require('./upload/upload-controller');
const schedule = require('./upload/schedule');


const UPLOAD_DIR = path.resolve(__dirname,'static/uploads'); // 大文件存储目录

// schedule.start(UPLOAD_DIR) //定时任务

const ctrl = new Controller(UPLOAD_DIR);


//文件上传
router.post('/upload', async (req, res, next) => {
    await ctrl.handleUpload(req, res);
});

router.post('/merge', async (req, res, next) => {
    console.log('merge',req.body);
    await ctrl.handleMerge(req,res)
});

router.post('/verify', async (req, res, next) => {
    console.log('verrify',req.body,ctrl);
    await ctrl.handleVerify(req,res);
    // res.json(result);
});

router.get('/img/model',async (req,res,next)=>{
    var result={
        status:'OK',
        data:{
            phone:'10086',
            content: {
                title:'戒烟辩题',
                    desc:'戒烟热线介绍戒烟热线介绍戒烟热线介绍戒烟热线介绍戒烟热线介绍'
                }
        }
    }

    res.json(result);
})


//登录接口,更改session状态
router.post('/login', function (req, res, next) {
    const {name = "", pass = ""} = req.body.params || {};
    var salt = "isMyLove"
    var sql = "select * from user where name='" + name + "'";
    console.log(pass);
    const md5Password = md5(String(pass)).toString();
    let result = {};

    //jwt-令牌操作，避免前端普通的token信息被修改
    const token = jwt.sign(
        {
            data: {name: 'ESS'},//用户数据
            exp: Math.floor(Date.now() / 1000) + 60 * 60//过期时间（一小时）
        },
        salt //秘钥
    );
    console.log('token', token);

    db.query(sql, function (err, rows, field) {
        if (err) {
            //也可以在判断中直接采用res.status(401).json()　
            // 给定错误状态码进行回传，减少前端不必要的判断
            console.log('err', err);
            result = {status: 'error', error: err}
            send();
        } else {
            if (rows.length === 0) {
                result = {code: 401, message: "无该用户，请注册！！！"};
                send();
            } else if (rows[0].password === md5Password) {
                insertToken(name).then((data) => {
                    result = {code: 200, token: data, username:name};
                    send();
                });
            } else {
                result = {code: 401, message: "密码错误，请重试！！！"};
                send();
            }
        }

        function send() {
            const data = mockjs.mock({
                "data": result,
                "status": '200'
            });
            res.json(data)
        }

    })

    function insertToken(name) {
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
function auth(req, res, next) {
    if (req.headers.token) {
        //已认证
        next();
    } else {
        res.json({code: 401, message: '登录状态异常'})
    }
}

//获取登录用户信息
router.get('/userInfo', auth, function (req, res, next) {
    res.json({code: 200, data: {name: 'jack'}, message: '获取成功'})
});

//获取轮播图和列表项
router.get('/slider', function (req, res, next) {
    const result = {
        code: 200,
        slider: [
            {id: 21, img: '../../../static/images/1.jpg'},
            {id: 22, img: '../../../static/images/2.jpg'},
            {id: 23, img: '../../../static/images/3.jpg'},
            {id: 24, img: '../../../static/images/4.jpg'},
            {id: 25, img: '../../../static/images/5.jpg'},
            {id: 26, img: '../../../static/images/6.jpg'}
        ],
        data: {
            fe: [
                {
                    id: 1,
                    title: 'Vue2.x实战',
                    price: '100',
                    img: '',
                    count: 100
                },
                {
                    id: 2,
                    title: 'React实战',
                    price: '200',
                    img: '',
                    count: 100
                },
                {
                    id: 3,
                    title: 'Angular实战',
                    price: '200',
                    img: '',
                    count: 100
                }
            ],
            python: [{
                id: 4,
                title: 'python实战1',
                price: '100',
                img: '',
                count: 100
            },
                {
                    id: 5,
                    title: 'python实战2',
                    price: '200',
                    img: '',
                    count: 100
                },
                {
                    id: 6,
                    title: 'python实战3',
                    price: '200',
                    img: '',
                    count: 100
                }],
            java: [{
                id: 7,
                title: 'java实战1',
                price: '100',
                img: '',
                count: 100
            },
                {
                    id: 8,
                    title: 'java实战2',
                    price: '200',
                    img: '',
                    count: 300
                },
                {
                    id: 9,
                    title: 'java实战3',
                    price: '200',
                    img: '',
                    count: 100
                }],
            ai: [{
                id: 10,
                title: 'ai实战1',
                price: '100',
                img: '',
                count: 100
            },
                {
                    id: 11,
                    title: 'ai实战2',
                    price: '200',
                    img: '',
                    count: 300
                }]
        },
        keys: ["fe", "python", "java", "ai"]
    };

    res.json(result);
});

//获取crf表单信息
router.get('/interview',function (req, res, next) {
    var result = {
        "data": [
            {
                "stableVersion": null,
                "version": [
                    {
                        "id": null,
                        "name": "调查问卷",
                        "bizName": null,
                        "label": "A 调查问卷",
                        "type": "菜单",
                        "parent": null,
                        "group": null,
                        "order": 20,
                        "description": null,
                        "filterTag": null,
                        "exportTag": null,
                        "formulaName": null,
                        "patiProperty": null,
                        "score": null,
                        "hasNecessary": false,
                        "hasNotNull": false,
                        "syncLabelId": null,
                        "syncLabelType": null,
                        "resultModel": null,
                        "syncIsShow": null,
                        "syncChildrenHadData": 0,
                        "mark": null,
                        "selectUnit": null,
                        "defaultValue": null,
                        "selectUnitArr": null,
                        "eventId": null,
                        "healthDataTag": null,
                        "statusFlag": null,
                        "isFetch": null,
                        "enclosure": 0,
                        "fileMaterials": null,
                        "crfTemplateCode": null,
                        "resultId": null,
                        "categoryLevel": "模块",
                        "children": [
                            {
                                "id": null,
                                "name": "调查问卷_a_调查问卷",
                                "bizName": null,
                                "label": "调查问卷",
                                "type": "菜单",
                                "parent": "调查问卷",
                                "group": null,
                                "order": 20,
                                "description": null,
                                "filterTag": null,
                                "exportTag": null,
                                "formulaName": null,
                                "patiProperty": null,
                                "score": null,
                                "hasNecessary": false,
                                "hasNotNull": false,
                                "syncLabelId": null,
                                "syncLabelType": null,
                                "resultModel": null,
                                "syncIsShow": null,
                                "syncChildrenHadData": 0,
                                "mark": null,
                                "selectUnit": null,
                                "defaultValue": null,
                                "selectUnitArr": null,
                                "eventId": null,
                                "healthDataTag": null,
                                "statusFlag": null,
                                "isFetch": null,
                                "enclosure": 0,
                                "fileMaterials": null,
                                "crfTemplateCode": null,
                                "resultId": null,
                                "categoryLevel": "主题",
                                "children": [
                                    {
                                        "id": 194171,
                                        "name": "调查问卷_a_调查问卷_a_18",
                                        "bizName": "调查问卷_a_调查问卷_a_18",
                                        "label": "是否曾经使用过，或者目前正在使用抗病毒治疗？",
                                        "type": "单选",
                                        "parent": "调查问卷_a_调查问卷",
                                        "group": null,
                                        "order": 0,
                                        "description": null,
                                        "filterTag": null,
                                        "exportTag": "1",
                                        "formulaName": null,
                                        "patiProperty": null,
                                        "score": null,
                                        "hasNecessary": false,
                                        "hasNotNull": false,
                                        "syncLabelId": null,
                                        "syncLabelType": null,
                                        "resultModel": null,
                                        "syncIsShow": 0,
                                        "syncChildrenHadData": 0,
                                        "mark": null,
                                        "selectUnit": null,
                                        "defaultValue": null,
                                        "selectUnitArr": null,
                                        "eventId": "null",
                                        "healthDataTag": "null",
                                        "statusFlag": null,
                                        "isFetch": null,
                                        "enclosure": -1,
                                        "fileMaterials": null,
                                        "crfTemplateCode": "是否曾经使用过，或者目前正在使用抗病毒治疗？",
                                        "resultId": null,
                                        "unit": null,
                                        "width": null,
                                        "notNull": true,
                                        "value": "从未抗病毒治疗",
                                        "changed": false,
                                        "dimension": {
                                            "id": null,
                                            "label": "18",
                                            "name": "18",
                                            "options": [
                                                {
                                                    "id": null,
                                                    "label": "从未抗病毒治疗",
                                                    "value": "从未抗病毒治疗",
                                                    "name": null,
                                                    "description": null,
                                                    "order": 10,
                                                    "children": [

                                                    ]
                                                },
                                                {
                                                    "id": null,
                                                    "label": "过去进行过目前没有",
                                                    "value": "过去进行过目前没有",
                                                    "name": null,
                                                    "description": null,
                                                    "order": 20,
                                                    "children": [

                                                    ]
                                                },
                                                {
                                                    "id": null,
                                                    "label": "目前正在使用",
                                                    "value": "目前正在使用",
                                                    "name": null,
                                                    "description": null,
                                                    "order": 30,
                                                    "children": [

                                                    ]
                                                }
                                            ]
                                        },
                                        "extendable": false,
                                        "children": [
                                            {
                                                "id": null,
                                                "name": "调查问卷_a_调查问卷_a_18_a_目前正在使用",
                                                "bizName": null,
                                                "label": "目前正在使用",
                                                "type": "虚拟菜单",
                                                "parent": "调查问卷_a_调查问卷_a_18",
                                                "group": null,
                                                "order": 0,
                                                "description": null,
                                                "filterTag": null,
                                                "exportTag": null,
                                                "formulaName": null,
                                                "patiProperty": null,
                                                "score": null,
                                                "hasNecessary": false,
                                                "hasNotNull": false,
                                                "syncLabelId": null,
                                                "syncLabelType": null,
                                                "resultModel": null,
                                                "syncIsShow": null,
                                                "syncChildrenHadData": 0,
                                                "mark": null,
                                                "selectUnit": null,
                                                "defaultValue": null,
                                                "selectUnitArr": null,
                                                "eventId": null,
                                                "healthDataTag": null,
                                                "statusFlag": null,
                                                "isFetch": null,
                                                "enclosure": 0,
                                                "fileMaterials": null,
                                                "crfTemplateCode": null,
                                                "resultId": null,
                                                "value": "目前正在使用",
                                                "index": null,
                                                "children": [
                                                    {
                                                        "id": null,
                                                        "name": "调查问卷_a_调查问卷_a_18_a_目前正在使用_a_20",
                                                        "bizName": "调查问卷_a_调查问卷_a_20",
                                                        "label": "使用的抗病毒药物名称",
                                                        "type": "多选",
                                                        "parent": "调查问卷_a_调查问卷_a_18_a_目前正在使用",
                                                        "group": null,
                                                        "order": 1,
                                                        "description": null,
                                                        "filterTag": null,
                                                        "exportTag": "1",
                                                        "formulaName": null,
                                                        "patiProperty": null,
                                                        "score": null,
                                                        "hasNecessary": false,
                                                        "hasNotNull": false,
                                                        "syncLabelId": null,
                                                        "syncLabelType": null,
                                                        "resultModel": null,
                                                        "syncIsShow": 0,
                                                        "syncChildrenHadData": 0,
                                                        "mark": null,
                                                        "selectUnit": null,
                                                        "defaultValue": null,
                                                        "selectUnitArr": null,
                                                        "eventId": "null",
                                                        "healthDataTag": "null",
                                                        "statusFlag": null,
                                                        "isFetch": null,
                                                        "enclosure": -1,
                                                        "fileMaterials": null,
                                                        "crfTemplateCode": "使用的抗病毒药物名称2",
                                                        "resultId": null,
                                                        "unit": null,
                                                        "width": null,
                                                        "notNull": true,
                                                        "value": null,
                                                        "changed": false,
                                                        "dimension": {
                                                            "id": null,
                                                            "label": "20",
                                                            "name": "20",
                                                            "options": [
                                                                {
                                                                    "id": null,
                                                                    "label": "恩替卡韦",
                                                                    "value": "恩替卡韦",
                                                                    "name": null,
                                                                    "description": null,
                                                                    "order": 10,
                                                                    "children": [

                                                                    ]
                                                                },
                                                                {
                                                                    "id": null,
                                                                    "label": "替诺福韦",
                                                                    "value": "替诺福韦",
                                                                    "name": null,
                                                                    "description": null,
                                                                    "order": 20,
                                                                    "children": [

                                                                    ]
                                                                },
                                                                {
                                                                    "id": null,
                                                                    "label": "丙酚替诺福韦",
                                                                    "value": "丙酚替诺福韦",
                                                                    "name": null,
                                                                    "description": null,
                                                                    "order": 30,
                                                                    "children": [

                                                                    ]
                                                                },
                                                                {
                                                                    "id": null,
                                                                    "label": "拉米夫定",
                                                                    "value": "拉米夫定",
                                                                    "name": null,
                                                                    "description": null,
                                                                    "order": 40,
                                                                    "children": [

                                                                    ]
                                                                },
                                                                {
                                                                    "id": null,
                                                                    "label": "阿德福韦",
                                                                    "value": "阿德福韦",
                                                                    "name": null,
                                                                    "description": null,
                                                                    "order": 50,
                                                                    "children": [

                                                                    ]
                                                                },
                                                                {
                                                                    "id": null,
                                                                    "label": "替比夫定",
                                                                    "value": "替比夫定",
                                                                    "name": null,
                                                                    "description": null,
                                                                    "order": 60,
                                                                    "children": [

                                                                    ]
                                                                },
                                                                {
                                                                    "id": null,
                                                                    "label": "长效干扰素",
                                                                    "value": "长效干扰素",
                                                                    "name": null,
                                                                    "description": null,
                                                                    "order": 70,
                                                                    "children": [

                                                                    ]
                                                                },
                                                                {
                                                                    "id": null,
                                                                    "label": "短效干扰素",
                                                                    "value": "短效干扰素",
                                                                    "name": null,
                                                                    "description": null,
                                                                    "order": 80,
                                                                    "children": [

                                                                    ]
                                                                }
                                                            ]
                                                        },
                                                        "extendable": false,
                                                        "children": [
                                                            {
                                                                "id": null,
                                                                "name": "调查问卷_a_调查问卷_a_20_a_替诺福韦",
                                                                "bizName": null,
                                                                "label": "替诺福韦",
                                                                "type": "虚拟菜单",
                                                                "parent": "调查问卷_a_调查问卷_a_20",
                                                                "group": null,
                                                                "order": 0,
                                                                "description": null,
                                                                "filterTag": null,
                                                                "exportTag": null,
                                                                "formulaName": null,
                                                                "patiProperty": null,
                                                                "score": null,
                                                                "hasNecessary": false,
                                                                "hasNotNull": false,
                                                                "syncLabelId": null,
                                                                "syncLabelType": null,
                                                                "resultModel": null,
                                                                "syncIsShow": null,
                                                                "syncChildrenHadData": 0,
                                                                "mark": null,
                                                                "selectUnit": null,
                                                                "defaultValue": null,
                                                                "selectUnitArr": null,
                                                                "eventId": null,
                                                                "healthDataTag": null,
                                                                "statusFlag": null,
                                                                "isFetch": null,
                                                                "enclosure": 0,
                                                                "fileMaterials": null,
                                                                "crfTemplateCode": null,
                                                                "resultId": null,
                                                                "value": "替诺福韦",
                                                                "index": null,
                                                                "children": [
                                                                    {
                                                                        "id": null,
                                                                        "name": "调查问卷_a_调查问卷_a_20_a_替诺福韦_a_124",
                                                                        "bizName": "调查问卷_a_调查问卷_a_124",
                                                                        "label": "替诺福韦使用时长",
                                                                        "type": "单选",
                                                                        "parent": "调查问卷_a_调查问卷_a_20_a_替诺福韦",
                                                                        "group": null,
                                                                        "order": 14,
                                                                        "description": null,
                                                                        "filterTag": null,
                                                                        "exportTag": "1",
                                                                        "formulaName": null,
                                                                        "patiProperty": null,
                                                                        "score": null,
                                                                        "hasNecessary": false,
                                                                        "hasNotNull": false,
                                                                        "syncLabelId": null,
                                                                        "syncLabelType": null,
                                                                        "resultModel": null,
                                                                        "syncIsShow": 0,
                                                                        "syncChildrenHadData": 0,
                                                                        "mark": null,
                                                                        "selectUnit": null,
                                                                        "defaultValue": null,
                                                                        "selectUnitArr": null,
                                                                        "eventId": "null",
                                                                        "healthDataTag": "null",
                                                                        "statusFlag": null,
                                                                        "isFetch": null,
                                                                        "enclosure": -1,
                                                                        "fileMaterials": null,
                                                                        "crfTemplateCode": "替诺福韦使用时长11",
                                                                        "resultId": null,
                                                                        "unit": null,
                                                                        "width": null,
                                                                        "notNull": false,
                                                                        "value": null,
                                                                        "changed": false,
                                                                        "dimension": {
                                                                            "id": null,
                                                                            "label": "124",
                                                                            "name": "124",
                                                                            "options": [
                                                                                {
                                                                                    "id": null,
                                                                                    "label": "小于3个月",
                                                                                    "value": "小于3个月",
                                                                                    "name": null,
                                                                                    "description": null,
                                                                                    "order": 10,
                                                                                    "children": [

                                                                                    ]
                                                                                },
                                                                                {
                                                                                    "id": null,
                                                                                    "label": "3-6个月",
                                                                                    "value": "3-6个月",
                                                                                    "name": null,
                                                                                    "description": null,
                                                                                    "order": 20,
                                                                                    "children": [

                                                                                    ]
                                                                                },
                                                                                {
                                                                                    "id": null,
                                                                                    "label": "6-12个月",
                                                                                    "value": "6-12个月",
                                                                                    "name": null,
                                                                                    "description": null,
                                                                                    "order": 30,
                                                                                    "children": [

                                                                                    ]
                                                                                },
                                                                                {
                                                                                    "id": null,
                                                                                    "label": "1-2年",
                                                                                    "value": "1-2年",
                                                                                    "name": null,
                                                                                    "description": null,
                                                                                    "order": 40,
                                                                                    "children": [

                                                                                    ]
                                                                                },
                                                                                {
                                                                                    "id": null,
                                                                                    "label": "2年以上",
                                                                                    "value": "2年以上",
                                                                                    "name": null,
                                                                                    "description": null,
                                                                                    "order": 50,
                                                                                    "children": [

                                                                                    ]
                                                                                }
                                                                            ]
                                                                        },
                                                                        "extendable": false,
                                                                        "children": [

                                                                        ]
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                "id": null,
                                                                "name": "调查问卷_a_调查问卷_a_20_a_丙酚替诺福韦",
                                                                "bizName": null,
                                                                "label": "丙酚替诺福韦",
                                                                "type": "虚拟菜单",
                                                                "parent": "调查问卷_a_调查问卷_a_20",
                                                                "group": null,
                                                                "order": 0,
                                                                "description": null,
                                                                "filterTag": null,
                                                                "exportTag": null,
                                                                "formulaName": null,
                                                                "patiProperty": null,
                                                                "score": null,
                                                                "hasNecessary": false,
                                                                "hasNotNull": false,
                                                                "syncLabelId": null,
                                                                "syncLabelType": null,
                                                                "resultModel": null,
                                                                "syncIsShow": null,
                                                                "syncChildrenHadData": 0,
                                                                "mark": null,
                                                                "selectUnit": null,
                                                                "defaultValue": null,
                                                                "selectUnitArr": null,
                                                                "eventId": null,
                                                                "healthDataTag": null,
                                                                "statusFlag": null,
                                                                "isFetch": null,
                                                                "enclosure": 0,
                                                                "fileMaterials": null,
                                                                "crfTemplateCode": null,
                                                                "resultId": null,
                                                                "value": "丙酚替诺福韦",
                                                                "index": null,
                                                                "children": [
                                                                    {
                                                                        "id": null,
                                                                        "name": "调查问卷_a_调查问卷_a_20_a_丙酚替诺福韦_a_125",
                                                                        "bizName": "调查问卷_a_调查问卷_a_125",
                                                                        "label": "丙酚替诺福韦使用时长",
                                                                        "type": "单选",
                                                                        "parent": "调查问卷_a_调查问卷_a_20_a_丙酚替诺福韦",
                                                                        "group": null,
                                                                        "order": 15,
                                                                        "description": null,
                                                                        "filterTag": null,
                                                                        "exportTag": "1",
                                                                        "formulaName": null,
                                                                        "patiProperty": null,
                                                                        "score": null,
                                                                        "hasNecessary": false,
                                                                        "hasNotNull": false,
                                                                        "syncLabelId": null,
                                                                        "syncLabelType": null,
                                                                        "resultModel": null,
                                                                        "syncIsShow": 0,
                                                                        "syncChildrenHadData": 0,
                                                                        "mark": null,
                                                                        "selectUnit": null,
                                                                        "defaultValue": null,
                                                                        "selectUnitArr": null,
                                                                        "eventId": "null",
                                                                        "healthDataTag": "null",
                                                                        "statusFlag": null,
                                                                        "isFetch": null,
                                                                        "enclosure": -1,
                                                                        "fileMaterials": null,
                                                                        "crfTemplateCode": "丙酚替诺福韦使用时长12",
                                                                        "resultId": null,
                                                                        "unit": null,
                                                                        "width": null,
                                                                        "notNull": false,
                                                                        "value": null,
                                                                        "changed": false,
                                                                        "dimension": {
                                                                            "id": null,
                                                                            "label": "125",
                                                                            "name": "125",
                                                                            "options": [
                                                                                {
                                                                                    "id": null,
                                                                                    "label": "小于3个月",
                                                                                    "value": "小于3个月",
                                                                                    "name": null,
                                                                                    "description": null,
                                                                                    "order": 10,
                                                                                    "children": [

                                                                                    ]
                                                                                },
                                                                                {
                                                                                    "id": null,
                                                                                    "label": "3-6个月",
                                                                                    "value": "3-6个月",
                                                                                    "name": null,
                                                                                    "description": null,
                                                                                    "order": 20,
                                                                                    "children": [

                                                                                    ]
                                                                                },
                                                                                {
                                                                                    "id": null,
                                                                                    "label": "6-12个月",
                                                                                    "value": "6-12个月",
                                                                                    "name": null,
                                                                                    "description": null,
                                                                                    "order": 30,
                                                                                    "children": [

                                                                                    ]
                                                                                },
                                                                                {
                                                                                    "id": null,
                                                                                    "label": "1-2年",
                                                                                    "value": "1-2年",
                                                                                    "name": null,
                                                                                    "description": null,
                                                                                    "order": 40,
                                                                                    "children": [

                                                                                    ]
                                                                                },
                                                                                {
                                                                                    "id": null,
                                                                                    "label": "2年以上",
                                                                                    "value": "2年以上",
                                                                                    "name": null,
                                                                                    "description": null,
                                                                                    "order": 50,
                                                                                    "children": [

                                                                                    ]
                                                                                }
                                                                            ]
                                                                        },
                                                                        "extendable": false,
                                                                        "children": [

                                                                        ]
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                "id": null,
                                                                "name": "调查问卷_a_调查问卷_a_20_a_拉米夫定",
                                                                "bizName": null,
                                                                "label": "拉米夫定",
                                                                "type": "虚拟菜单",
                                                                "parent": "调查问卷_a_调查问卷_a_20",
                                                                "group": null,
                                                                "order": 0,
                                                                "description": null,
                                                                "filterTag": null,
                                                                "exportTag": null,
                                                                "formulaName": null,
                                                                "patiProperty": null,
                                                                "score": null,
                                                                "hasNecessary": false,
                                                                "hasNotNull": false,
                                                                "syncLabelId": null,
                                                                "syncLabelType": null,
                                                                "resultModel": null,
                                                                "syncIsShow": null,
                                                                "syncChildrenHadData": 0,
                                                                "mark": null,
                                                                "selectUnit": null,
                                                                "defaultValue": null,
                                                                "selectUnitArr": null,
                                                                "eventId": null,
                                                                "healthDataTag": null,
                                                                "statusFlag": null,
                                                                "isFetch": null,
                                                                "enclosure": 0,
                                                                "fileMaterials": null,
                                                                "crfTemplateCode": null,
                                                                "resultId": null,
                                                                "value": "拉米夫定",
                                                                "index": null,
                                                                "children": [
                                                                    {
                                                                        "id": null,
                                                                        "name": "调查问卷_a_调查问卷_a_20_a_拉米夫定_a_126",
                                                                        "bizName": "调查问卷_a_调查问卷_a_126",
                                                                        "label": "拉米夫定使用时长",
                                                                        "type": "单选",
                                                                        "parent": "调查问卷_a_调查问卷_a_20_a_拉米夫定",
                                                                        "group": null,
                                                                        "order": 16,
                                                                        "description": null,
                                                                        "filterTag": null,
                                                                        "exportTag": "1",
                                                                        "formulaName": null,
                                                                        "patiProperty": null,
                                                                        "score": null,
                                                                        "hasNecessary": false,
                                                                        "hasNotNull": false,
                                                                        "syncLabelId": null,
                                                                        "syncLabelType": null,
                                                                        "resultModel": null,
                                                                        "syncIsShow": 0,
                                                                        "syncChildrenHadData": 0,
                                                                        "mark": null,
                                                                        "selectUnit": null,
                                                                        "defaultValue": null,
                                                                        "selectUnitArr": null,
                                                                        "eventId": "null",
                                                                        "healthDataTag": "null",
                                                                        "statusFlag": null,
                                                                        "isFetch": null,
                                                                        "enclosure": -1,
                                                                        "fileMaterials": null,
                                                                        "crfTemplateCode": "拉米夫定使用时长13",
                                                                        "resultId": null,
                                                                        "unit": null,
                                                                        "width": null,
                                                                        "notNull": false,
                                                                        "value": null,
                                                                        "changed": false,
                                                                        "dimension": {
                                                                            "id": null,
                                                                            "label": "126",
                                                                            "name": "126",
                                                                            "options": [
                                                                                {
                                                                                    "id": null,
                                                                                    "label": "小于3个月",
                                                                                    "value": "小于3个月",
                                                                                    "name": null,
                                                                                    "description": null,
                                                                                    "order": 10,
                                                                                    "children": [

                                                                                    ]
                                                                                },
                                                                                {
                                                                                    "id": null,
                                                                                    "label": "3-6个月",
                                                                                    "value": "3-6个月",
                                                                                    "name": null,
                                                                                    "description": null,
                                                                                    "order": 20,
                                                                                    "children": [

                                                                                    ]
                                                                                },
                                                                                {
                                                                                    "id": null,
                                                                                    "label": "6-12个月",
                                                                                    "value": "6-12个月",
                                                                                    "name": null,
                                                                                    "description": null,
                                                                                    "order": 30,
                                                                                    "children": [

                                                                                    ]
                                                                                },
                                                                                {
                                                                                    "id": null,
                                                                                    "label": "1-2年",
                                                                                    "value": "1-2年",
                                                                                    "name": null,
                                                                                    "description": null,
                                                                                    "order": 40,
                                                                                    "children": [

                                                                                    ]
                                                                                },
                                                                                {
                                                                                    "id": null,
                                                                                    "label": "2年以上",
                                                                                    "value": "2年以上",
                                                                                    "name": null,
                                                                                    "description": null,
                                                                                    "order": 50,
                                                                                    "children": [

                                                                                    ]
                                                                                }
                                                                            ]
                                                                        },
                                                                        "extendable": false,
                                                                        "children": [

                                                                        ]
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                "id": null,
                                                                "name": "调查问卷_a_调查问卷_a_20_a_短效干扰素",
                                                                "bizName": null,
                                                                "label": "短效干扰素",
                                                                "type": "虚拟菜单",
                                                                "parent": "调查问卷_a_调查问卷_a_20",
                                                                "group": null,
                                                                "order": 0,
                                                                "description": null,
                                                                "filterTag": null,
                                                                "exportTag": null,
                                                                "formulaName": null,
                                                                "patiProperty": null,
                                                                "score": null,
                                                                "hasNecessary": false,
                                                                "hasNotNull": false,
                                                                "syncLabelId": null,
                                                                "syncLabelType": null,
                                                                "resultModel": null,
                                                                "syncIsShow": null,
                                                                "syncChildrenHadData": 0,
                                                                "mark": null,
                                                                "selectUnit": null,
                                                                "defaultValue": null,
                                                                "selectUnitArr": null,
                                                                "eventId": null,
                                                                "healthDataTag": null,
                                                                "statusFlag": null,
                                                                "isFetch": null,
                                                                "enclosure": 0,
                                                                "fileMaterials": null,
                                                                "crfTemplateCode": null,
                                                                "resultId": null,
                                                                "value": "短效干扰素",
                                                                "index": null,
                                                                "children": [
                                                                    {
                                                                        "id": null,
                                                                        "name": "调查问卷_a_调查问卷_a_20_a_短效干扰素_a_1046",
                                                                        "bizName": "调查问卷_a_调查问卷_a_1046",
                                                                        "label": "短效干扰素使用时长",
                                                                        "type": "单选",
                                                                        "parent": "调查问卷_a_调查问卷_a_20_a_短效干扰素",
                                                                        "group": null,
                                                                        "order": 24,
                                                                        "description": null,
                                                                        "filterTag": null,
                                                                        "exportTag": "1",
                                                                        "formulaName": null,
                                                                        "patiProperty": null,
                                                                        "score": null,
                                                                        "hasNecessary": false,
                                                                        "hasNotNull": false,
                                                                        "syncLabelId": null,
                                                                        "syncLabelType": null,
                                                                        "resultModel": null,
                                                                        "syncIsShow": 0,
                                                                        "syncChildrenHadData": 0,
                                                                        "mark": null,
                                                                        "selectUnit": null,
                                                                        "defaultValue": null,
                                                                        "selectUnitArr": null,
                                                                        "eventId": "null",
                                                                        "healthDataTag": "null",
                                                                        "statusFlag": null,
                                                                        "isFetch": null,
                                                                        "enclosure": -1,
                                                                        "fileMaterials": null,
                                                                        "crfTemplateCode": "短效干扰素使用时长85",
                                                                        "resultId": null,
                                                                        "unit": null,
                                                                        "width": null,
                                                                        "notNull": false,
                                                                        "value": null,
                                                                        "changed": false,
                                                                        "dimension": {
                                                                            "id": null,
                                                                            "label": "1046",
                                                                            "name": "1046",
                                                                            "options": [
                                                                                {
                                                                                    "id": null,
                                                                                    "label": "小于3个月",
                                                                                    "value": "小于3个月",
                                                                                    "name": null,
                                                                                    "description": null,
                                                                                    "order": 10,
                                                                                    "children": [

                                                                                    ]
                                                                                },
                                                                                {
                                                                                    "id": null,
                                                                                    "label": "3-6个月",
                                                                                    "value": "3-6个月",
                                                                                    "name": null,
                                                                                    "description": null,
                                                                                    "order": 20,
                                                                                    "children": [

                                                                                    ]
                                                                                },
                                                                                {
                                                                                    "id": null,
                                                                                    "label": "6-12个月",
                                                                                    "value": "6-12个月",
                                                                                    "name": null,
                                                                                    "description": null,
                                                                                    "order": 30,
                                                                                    "children": [

                                                                                    ]
                                                                                },
                                                                                {
                                                                                    "id": null,
                                                                                    "label": "1-2年，2年以上",
                                                                                    "value": "1-2年，2年以上",
                                                                                    "name": null,
                                                                                    "description": null,
                                                                                    "order": 40,
                                                                                    "children": [

                                                                                    ]
                                                                                }
                                                                            ]
                                                                        },
                                                                        "extendable": false,
                                                                        "children": [

                                                                        ]
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                "id": null,
                                                                "name": "调查问卷_a_调查问卷_a_20_a_替比夫定",
                                                                "bizName": null,
                                                                "label": "替比夫定",
                                                                "type": "虚拟菜单",
                                                                "parent": "调查问卷_a_调查问卷_a_20",
                                                                "group": null,
                                                                "order": 0,
                                                                "description": null,
                                                                "filterTag": null,
                                                                "exportTag": null,
                                                                "formulaName": null,
                                                                "patiProperty": null,
                                                                "score": null,
                                                                "hasNecessary": false,
                                                                "hasNotNull": false,
                                                                "syncLabelId": null,
                                                                "syncLabelType": null,
                                                                "resultModel": null,
                                                                "syncIsShow": null,
                                                                "syncChildrenHadData": 0,
                                                                "mark": null,
                                                                "selectUnit": null,
                                                                "defaultValue": null,
                                                                "selectUnitArr": null,
                                                                "eventId": null,
                                                                "healthDataTag": null,
                                                                "statusFlag": null,
                                                                "isFetch": null,
                                                                "enclosure": 0,
                                                                "fileMaterials": null,
                                                                "crfTemplateCode": null,
                                                                "resultId": null,
                                                                "value": "替比夫定",
                                                                "index": null,
                                                                "children": [
                                                                    {
                                                                        "id": null,
                                                                        "name": "调查问卷_a_调查问卷_a_20_a_替比夫定_a_1044",
                                                                        "bizName": "调查问卷_a_调查问卷_a_1044",
                                                                        "label": "替比夫定使用时长",
                                                                        "type": "单选",
                                                                        "parent": "调查问卷_a_调查问卷_a_20_a_替比夫定",
                                                                        "group": null,
                                                                        "order": 22,
                                                                        "description": null,
                                                                        "filterTag": null,
                                                                        "exportTag": "1",
                                                                        "formulaName": null,
                                                                        "patiProperty": null,
                                                                        "score": null,
                                                                        "hasNecessary": false,
                                                                        "hasNotNull": false,
                                                                        "syncLabelId": null,
                                                                        "syncLabelType": null,
                                                                        "resultModel": null,
                                                                        "syncIsShow": 0,
                                                                        "syncChildrenHadData": 0,
                                                                        "mark": null,
                                                                        "selectUnit": null,
                                                                        "defaultValue": null,
                                                                        "selectUnitArr": null,
                                                                        "eventId": "null",
                                                                        "healthDataTag": "null",
                                                                        "statusFlag": null,
                                                                        "isFetch": null,
                                                                        "enclosure": -1,
                                                                        "fileMaterials": null,
                                                                        "crfTemplateCode": "替比夫定使用时长83",
                                                                        "resultId": null,
                                                                        "unit": null,
                                                                        "width": null,
                                                                        "notNull": false,
                                                                        "value": null,
                                                                        "changed": false,
                                                                        "dimension": {
                                                                            "id": null,
                                                                            "label": "1044",
                                                                            "name": "1044",
                                                                            "options": [
                                                                                {
                                                                                    "id": null,
                                                                                    "label": "小于3个月",
                                                                                    "value": "小于3个月",
                                                                                    "name": null,
                                                                                    "description": null,
                                                                                    "order": 10,
                                                                                    "children": [

                                                                                    ]
                                                                                },
                                                                                {
                                                                                    "id": null,
                                                                                    "label": "3-6个月",
                                                                                    "value": "3-6个月",
                                                                                    "name": null,
                                                                                    "description": null,
                                                                                    "order": 20,
                                                                                    "children": [

                                                                                    ]
                                                                                },
                                                                                {
                                                                                    "id": null,
                                                                                    "label": "6-12个月",
                                                                                    "value": "6-12个月",
                                                                                    "name": null,
                                                                                    "description": null,
                                                                                    "order": 30,
                                                                                    "children": [

                                                                                    ]
                                                                                },
                                                                                {
                                                                                    "id": null,
                                                                                    "label": "1-2年，2年以上",
                                                                                    "value": "1-2年，2年以上",
                                                                                    "name": null,
                                                                                    "description": null,
                                                                                    "order": 40,
                                                                                    "children": [

                                                                                    ]
                                                                                }
                                                                            ]
                                                                        },
                                                                        "extendable": false,
                                                                        "children": [

                                                                        ]
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                "id": null,
                                                                "name": "调查问卷_a_调查问卷_a_20_a_长效干扰素",
                                                                "bizName": null,
                                                                "label": "长效干扰素",
                                                                "type": "虚拟菜单",
                                                                "parent": "调查问卷_a_调查问卷_a_20",
                                                                "group": null,
                                                                "order": 0,
                                                                "description": null,
                                                                "filterTag": null,
                                                                "exportTag": null,
                                                                "formulaName": null,
                                                                "patiProperty": null,
                                                                "score": null,
                                                                "hasNecessary": false,
                                                                "hasNotNull": false,
                                                                "syncLabelId": null,
                                                                "syncLabelType": null,
                                                                "resultModel": null,
                                                                "syncIsShow": null,
                                                                "syncChildrenHadData": 0,
                                                                "mark": null,
                                                                "selectUnit": null,
                                                                "defaultValue": null,
                                                                "selectUnitArr": null,
                                                                "eventId": null,
                                                                "healthDataTag": null,
                                                                "statusFlag": null,
                                                                "isFetch": null,
                                                                "enclosure": 0,
                                                                "fileMaterials": null,
                                                                "crfTemplateCode": null,
                                                                "resultId": null,
                                                                "value": "长效干扰素",
                                                                "index": null,
                                                                "children": [
                                                                    {
                                                                        "id": null,
                                                                        "name": "调查问卷_a_调查问卷_a_20_a_长效干扰素_a_1045",
                                                                        "bizName": "调查问卷_a_调查问卷_a_1045",
                                                                        "label": "长效干扰素使用时长",
                                                                        "type": "单选",
                                                                        "parent": "调查问卷_a_调查问卷_a_20_a_长效干扰素",
                                                                        "group": null,
                                                                        "order": 23,
                                                                        "description": null,
                                                                        "filterTag": null,
                                                                        "exportTag": "1",
                                                                        "formulaName": null,
                                                                        "patiProperty": null,
                                                                        "score": null,
                                                                        "hasNecessary": false,
                                                                        "hasNotNull": false,
                                                                        "syncLabelId": null,
                                                                        "syncLabelType": null,
                                                                        "resultModel": null,
                                                                        "syncIsShow": 0,
                                                                        "syncChildrenHadData": 0,
                                                                        "mark": null,
                                                                        "selectUnit": null,
                                                                        "defaultValue": null,
                                                                        "selectUnitArr": null,
                                                                        "eventId": "null",
                                                                        "healthDataTag": "null",
                                                                        "statusFlag": null,
                                                                        "isFetch": null,
                                                                        "enclosure": -1,
                                                                        "fileMaterials": null,
                                                                        "crfTemplateCode": "长效干扰素使用时长84",
                                                                        "resultId": null,
                                                                        "unit": null,
                                                                        "width": null,
                                                                        "notNull": false,
                                                                        "value": null,
                                                                        "changed": false,
                                                                        "dimension": {
                                                                            "id": null,
                                                                            "label": "1045",
                                                                            "name": "1045",
                                                                            "options": [
                                                                                {
                                                                                    "id": null,
                                                                                    "label": "小于3个月",
                                                                                    "value": "小于3个月",
                                                                                    "name": null,
                                                                                    "description": null,
                                                                                    "order": 10,
                                                                                    "children": [

                                                                                    ]
                                                                                },
                                                                                {
                                                                                    "id": null,
                                                                                    "label": "3-6个月",
                                                                                    "value": "3-6个月",
                                                                                    "name": null,
                                                                                    "description": null,
                                                                                    "order": 20,
                                                                                    "children": [

                                                                                    ]
                                                                                },
                                                                                {
                                                                                    "id": null,
                                                                                    "label": "6-12个月",
                                                                                    "value": "6-12个月",
                                                                                    "name": null,
                                                                                    "description": null,
                                                                                    "order": 30,
                                                                                    "children": [

                                                                                    ]
                                                                                },
                                                                                {
                                                                                    "id": null,
                                                                                    "label": "1-2年，2年以上",
                                                                                    "value": "1-2年，2年以上",
                                                                                    "name": null,
                                                                                    "description": null,
                                                                                    "order": 40,
                                                                                    "children": [

                                                                                    ]
                                                                                }
                                                                            ]
                                                                        },
                                                                        "extendable": false,
                                                                        "children": [

                                                                        ]
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                "id": null,
                                                                "name": "调查问卷_a_调查问卷_a_20_a_阿德福韦",
                                                                "bizName": null,
                                                                "label": "阿德福韦",
                                                                "type": "虚拟菜单",
                                                                "parent": "调查问卷_a_调查问卷_a_20",
                                                                "group": null,
                                                                "order": 0,
                                                                "description": null,
                                                                "filterTag": null,
                                                                "exportTag": null,
                                                                "formulaName": null,
                                                                "patiProperty": null,
                                                                "score": null,
                                                                "hasNecessary": false,
                                                                "hasNotNull": false,
                                                                "syncLabelId": null,
                                                                "syncLabelType": null,
                                                                "resultModel": null,
                                                                "syncIsShow": null,
                                                                "syncChildrenHadData": 0,
                                                                "mark": null,
                                                                "selectUnit": null,
                                                                "defaultValue": null,
                                                                "selectUnitArr": null,
                                                                "eventId": null,
                                                                "healthDataTag": null,
                                                                "statusFlag": null,
                                                                "isFetch": null,
                                                                "enclosure": 0,
                                                                "fileMaterials": null,
                                                                "crfTemplateCode": null,
                                                                "resultId": null,
                                                                "value": "阿德福韦",
                                                                "index": null,
                                                                "children": [
                                                                    {
                                                                        "id": null,
                                                                        "name": "调查问卷_a_调查问卷_a_20_a_阿德福韦_a_127",
                                                                        "bizName": "调查问卷_a_调查问卷_a_127",
                                                                        "label": "阿德福韦使用时长",
                                                                        "type": "单选",
                                                                        "parent": "调查问卷_a_调查问卷_a_20_a_阿德福韦",
                                                                        "group": null,
                                                                        "order": 17,
                                                                        "description": null,
                                                                        "filterTag": null,
                                                                        "exportTag": "1",
                                                                        "formulaName": null,
                                                                        "patiProperty": null,
                                                                        "score": null,
                                                                        "hasNecessary": false,
                                                                        "hasNotNull": false,
                                                                        "syncLabelId": null,
                                                                        "syncLabelType": null,
                                                                        "resultModel": null,
                                                                        "syncIsShow": 0,
                                                                        "syncChildrenHadData": 0,
                                                                        "mark": null,
                                                                        "selectUnit": null,
                                                                        "defaultValue": null,
                                                                        "selectUnitArr": null,
                                                                        "eventId": "null",
                                                                        "healthDataTag": "null",
                                                                        "statusFlag": null,
                                                                        "isFetch": null,
                                                                        "enclosure": -1,
                                                                        "fileMaterials": null,
                                                                        "crfTemplateCode": "阿德福韦使用时长14",
                                                                        "resultId": null,
                                                                        "unit": null,
                                                                        "width": null,
                                                                        "notNull": false,
                                                                        "value": null,
                                                                        "changed": false,
                                                                        "dimension": {
                                                                            "id": null,
                                                                            "label": "127",
                                                                            "name": "127",
                                                                            "options": [
                                                                                {
                                                                                    "id": null,
                                                                                    "label": "小于3个月",
                                                                                    "value": "小于3个月",
                                                                                    "name": null,
                                                                                    "description": null,
                                                                                    "order": 10,
                                                                                    "children": [

                                                                                    ]
                                                                                },
                                                                                {
                                                                                    "id": null,
                                                                                    "label": "3-6个月",
                                                                                    "value": "3-6个月",
                                                                                    "name": null,
                                                                                    "description": null,
                                                                                    "order": 20,
                                                                                    "children": [

                                                                                    ]
                                                                                },
                                                                                {
                                                                                    "id": null,
                                                                                    "label": "6-12个月",
                                                                                    "value": "6-12个月",
                                                                                    "name": null,
                                                                                    "description": null,
                                                                                    "order": 30,
                                                                                    "children": [

                                                                                    ]
                                                                                },
                                                                                {
                                                                                    "id": null,
                                                                                    "label": "1-2年，2年以上",
                                                                                    "value": "1-2年，2年以上",
                                                                                    "name": null,
                                                                                    "description": null,
                                                                                    "order": 40,
                                                                                    "children": [

                                                                                    ]
                                                                                }
                                                                            ]
                                                                        },
                                                                        "extendable": false,
                                                                        "children": [

                                                                        ]
                                                                    }
                                                                ]
                                                            },
                                                            {
                                                                "id": null,
                                                                "name": "调查问卷_a_调查问卷_a_20_a_恩替卡韦",
                                                                "bizName": null,
                                                                "label": "恩替卡韦",
                                                                "type": "虚拟菜单",
                                                                "parent": "调查问卷_a_调查问卷_a_20",
                                                                "group": null,
                                                                "order": 0,
                                                                "description": null,
                                                                "filterTag": null,
                                                                "exportTag": null,
                                                                "formulaName": null,
                                                                "patiProperty": null,
                                                                "score": null,
                                                                "hasNecessary": false,
                                                                "hasNotNull": false,
                                                                "syncLabelId": null,
                                                                "syncLabelType": null,
                                                                "resultModel": null,
                                                                "syncIsShow": null,
                                                                "syncChildrenHadData": 0,
                                                                "mark": null,
                                                                "selectUnit": null,
                                                                "defaultValue": null,
                                                                "selectUnitArr": null,
                                                                "eventId": null,
                                                                "healthDataTag": null,
                                                                "statusFlag": null,
                                                                "isFetch": null,
                                                                "enclosure": 0,
                                                                "fileMaterials": null,
                                                                "crfTemplateCode": null,
                                                                "resultId": null,
                                                                "value": "恩替卡韦",
                                                                "index": null,
                                                                "children": [
                                                                    {
                                                                        "id": null,
                                                                        "name": "调查问卷_a_调查问卷_a_20_a_恩替卡韦_a_22",
                                                                        "bizName": "调查问卷_a_调查问卷_a_22",
                                                                        "label": "恩替卡韦使用时长",
                                                                        "type": "单选",
                                                                        "parent": "调查问卷_a_调查问卷_a_20_a_恩替卡韦",
                                                                        "group": null,
                                                                        "order": 2,
                                                                        "description": null,
                                                                        "filterTag": null,
                                                                        "exportTag": "1",
                                                                        "formulaName": null,
                                                                        "patiProperty": null,
                                                                        "score": null,
                                                                        "hasNecessary": false,
                                                                        "hasNotNull": false,
                                                                        "syncLabelId": null,
                                                                        "syncLabelType": null,
                                                                        "resultModel": null,
                                                                        "syncIsShow": 0,
                                                                        "syncChildrenHadData": 0,
                                                                        "mark": null,
                                                                        "selectUnit": null,
                                                                        "defaultValue": null,
                                                                        "selectUnitArr": null,
                                                                        "eventId": "null",
                                                                        "healthDataTag": "null",
                                                                        "statusFlag": null,
                                                                        "isFetch": null,
                                                                        "enclosure": -1,
                                                                        "fileMaterials": null,
                                                                        "crfTemplateCode": "恩替卡韦使用时长3",
                                                                        "resultId": null,
                                                                        "unit": null,
                                                                        "width": null,
                                                                        "notNull": false,
                                                                        "value": null,
                                                                        "changed": false,
                                                                        "dimension": {
                                                                            "id": null,
                                                                            "label": "22",
                                                                            "name": "22",
                                                                            "options": [
                                                                                {
                                                                                    "id": null,
                                                                                    "label": "小于3个月",
                                                                                    "value": "小于3个月",
                                                                                    "name": null,
                                                                                    "description": null,
                                                                                    "order": 10,
                                                                                    "children": [

                                                                                    ]
                                                                                },
                                                                                {
                                                                                    "id": null,
                                                                                    "label": "3-6个月",
                                                                                    "value": "3-6个月",
                                                                                    "name": null,
                                                                                    "description": null,
                                                                                    "order": 20,
                                                                                    "children": [

                                                                                    ]
                                                                                },
                                                                                {
                                                                                    "id": null,
                                                                                    "label": "6-12个月",
                                                                                    "value": "6-12个月",
                                                                                    "name": null,
                                                                                    "description": null,
                                                                                    "order": 30,
                                                                                    "children": [

                                                                                    ]
                                                                                },
                                                                                {
                                                                                    "id": null,
                                                                                    "label": "1-2年",
                                                                                    "value": "1-2年",
                                                                                    "name": null,
                                                                                    "description": null,
                                                                                    "order": 40,
                                                                                    "children": [

                                                                                    ]
                                                                                },
                                                                                {
                                                                                    "id": null,
                                                                                    "label": "2年以上",
                                                                                    "value": "2年以上",
                                                                                    "name": null,
                                                                                    "description": null,
                                                                                    "order": 50,
                                                                                    "children": [

                                                                                    ]
                                                                                }
                                                                            ]
                                                                        },
                                                                        "extendable": false,
                                                                        "children": [

                                                                        ]
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "id": 194172,
                                        "name": "调查问卷_a_调查问卷_a_24",
                                        "bizName": "调查问卷_a_调查问卷_a_24",
                                        "label": "肝病家族史",
                                        "type": "多选",
                                        "parent": "调查问卷_a_调查问卷",
                                        "group": null,
                                        "order": 3,
                                        "description": null,
                                        "filterTag": null,
                                        "exportTag": "1",
                                        "formulaName": null,
                                        "patiProperty": null,
                                        "score": null,
                                        "hasNecessary": false,
                                        "hasNotNull": false,
                                        "syncLabelId": null,
                                        "syncLabelType": null,
                                        "resultModel": null,
                                        "syncIsShow": 0,
                                        "syncChildrenHadData": 0,
                                        "mark": null,
                                        "selectUnit": null,
                                        "defaultValue": null,
                                        "selectUnitArr": null,
                                        "eventId": "null",
                                        "healthDataTag": "null",
                                        "statusFlag": null,
                                        "isFetch": null,
                                        "enclosure": -1,
                                        "fileMaterials": null,
                                        "crfTemplateCode": "肝病家族史",
                                        "resultId": null,
                                        "unit": null,
                                        "width": null,
                                        "notNull": true,
                                        "value": "无",
                                        "changed": false,
                                        "dimension": {
                                            "id": null,
                                            "label": "24",
                                            "name": "24",
                                            "options": [
                                                {
                                                    "id": null,
                                                    "label": "无",
                                                    "value": "无",
                                                    "name": null,
                                                    "description": null,
                                                    "order": 10,
                                                    "children": [

                                                    ]
                                                },
                                                {
                                                    "id": null,
                                                    "label": "乙肝",
                                                    "value": "乙肝",
                                                    "name": null,
                                                    "description": null,
                                                    "order": 20,
                                                    "children": [

                                                    ]
                                                },
                                                {
                                                    "id": null,
                                                    "label": "丙肝",
                                                    "value": "丙肝",
                                                    "name": null,
                                                    "description": null,
                                                    "order": 30,
                                                    "children": [

                                                    ]
                                                },
                                                {
                                                    "id": null,
                                                    "label": "自免肝",
                                                    "value": "自免肝",
                                                    "name": null,
                                                    "description": null,
                                                    "order": 40,
                                                    "children": [

                                                    ]
                                                },
                                                {
                                                    "id": null,
                                                    "label": "肝癌",
                                                    "value": "肝癌",
                                                    "name": null,
                                                    "description": null,
                                                    "order": 50,
                                                    "children": [

                                                    ]
                                                }
                                            ]
                                        },
                                        "extendable": false,
                                        "children": [

                                        ]
                                    },
                                    {
                                        "id": null,
                                        "name": "调查问卷_a_调查问卷_a_25",
                                        "bizName": "调查问卷_a_调查问卷_a_25",
                                        "label": "饮酒史",
                                        "type": "单选",
                                        "parent": "调查问卷_a_调查问卷",
                                        "group": null,
                                        "order": 4,
                                        "description": null,
                                        "filterTag": null,
                                        "exportTag": "1",
                                        "formulaName": null,
                                        "patiProperty": null,
                                        "score": null,
                                        "hasNecessary": false,
                                        "hasNotNull": false,
                                        "syncLabelId": null,
                                        "syncLabelType": null,
                                        "resultModel": null,
                                        "syncIsShow": 0,
                                        "syncChildrenHadData": 0,
                                        "mark": null,
                                        "selectUnit": null,
                                        "defaultValue": null,
                                        "selectUnitArr": null,
                                        "eventId": "null",
                                        "healthDataTag": "null",
                                        "statusFlag": null,
                                        "isFetch": null,
                                        "enclosure": -1,
                                        "fileMaterials": null,
                                        "crfTemplateCode": "饮酒史",
                                        "resultId": null,
                                        "unit": null,
                                        "width": null,
                                        "notNull": true,
                                        "value": null,
                                        "changed": false,
                                        "dimension": {
                                            "id": null,
                                            "label": "25",
                                            "name": "25",
                                            "options": [
                                                {
                                                    "id": null,
                                                    "label": "有",
                                                    "value": "有",
                                                    "name": null,
                                                    "description": null,
                                                    "order": 10,
                                                    "children": [

                                                    ]
                                                },
                                                {
                                                    "id": null,
                                                    "label": "无",
                                                    "value": "无",
                                                    "name": null,
                                                    "description": null,
                                                    "order": 20,
                                                    "children": [

                                                    ]
                                                }
                                            ]
                                        },
                                        "extendable": false,
                                        "children": [
                                            {
                                                "id": null,
                                                "name": "调查问卷_a_调查问卷_a_25_a_有",
                                                "bizName": null,
                                                "label": "有",
                                                "type": "虚拟菜单",
                                                "parent": "调查问卷_a_调查问卷_a_25",
                                                "group": null,
                                                "order": 0,
                                                "description": null,
                                                "filterTag": null,
                                                "exportTag": null,
                                                "formulaName": null,
                                                "patiProperty": null,
                                                "score": null,
                                                "hasNecessary": false,
                                                "hasNotNull": false,
                                                "syncLabelId": null,
                                                "syncLabelType": null,
                                                "resultModel": null,
                                                "syncIsShow": null,
                                                "syncChildrenHadData": 0,
                                                "mark": null,
                                                "selectUnit": null,
                                                "defaultValue": null,
                                                "selectUnitArr": null,
                                                "eventId": null,
                                                "healthDataTag": null,
                                                "statusFlag": null,
                                                "isFetch": null,
                                                "enclosure": 0,
                                                "fileMaterials": null,
                                                "crfTemplateCode": null,
                                                "resultId": null,
                                                "value": "有",
                                                "index": null,
                                                "children": [
                                                    {
                                                        "id": null,
                                                        "name": "调查问卷_a_调查问卷_a_25_a_有_a_26",
                                                        "bizName": "调查问卷_a_调查问卷_a_26",
                                                        "label": "已饮酒年数",
                                                        "type": "单选",
                                                        "parent": "调查问卷_a_调查问卷_a_25_a_有",
                                                        "group": null,
                                                        "order": 5,
                                                        "description": null,
                                                        "filterTag": null,
                                                        "exportTag": "1",
                                                        "formulaName": null,
                                                        "patiProperty": null,
                                                        "score": null,
                                                        "hasNecessary": false,
                                                        "hasNotNull": false,
                                                        "syncLabelId": null,
                                                        "syncLabelType": null,
                                                        "resultModel": null,
                                                        "syncIsShow": 0,
                                                        "syncChildrenHadData": 0,
                                                        "mark": null,
                                                        "selectUnit": null,
                                                        "defaultValue": null,
                                                        "selectUnitArr": null,
                                                        "eventId": "null",
                                                        "healthDataTag": "null",
                                                        "statusFlag": null,
                                                        "isFetch": null,
                                                        "enclosure": -1,
                                                        "fileMaterials": null,
                                                        "crfTemplateCode": "已饮酒年数4",
                                                        "resultId": null,
                                                        "unit": null,
                                                        "width": null,
                                                        "notNull": true,
                                                        "value": null,
                                                        "changed": false,
                                                        "dimension": {
                                                            "id": null,
                                                            "label": "26",
                                                            "name": "26",
                                                            "options": [
                                                                {
                                                                    "id": null,
                                                                    "label": "小于5年",
                                                                    "value": "小于5年",
                                                                    "name": null,
                                                                    "description": null,
                                                                    "order": 10,
                                                                    "children": [

                                                                    ]
                                                                },
                                                                {
                                                                    "id": null,
                                                                    "label": "5-10年",
                                                                    "value": "5-10年",
                                                                    "name": null,
                                                                    "description": null,
                                                                    "order": 20,
                                                                    "children": [

                                                                    ]
                                                                },
                                                                {
                                                                    "id": null,
                                                                    "label": "10-20年",
                                                                    "value": "10-20年",
                                                                    "name": null,
                                                                    "description": null,
                                                                    "order": 30,
                                                                    "children": [

                                                                    ]
                                                                },
                                                                {
                                                                    "id": null,
                                                                    "label": "20年以上",
                                                                    "value": "20年以上",
                                                                    "name": null,
                                                                    "description": null,
                                                                    "order": 40,
                                                                    "children": [

                                                                    ]
                                                                }
                                                            ]
                                                        },
                                                        "extendable": false,
                                                        "children": [

                                                        ]
                                                    },
                                                    {
                                                        "id": null,
                                                        "name": "调查问卷_a_调查问卷_a_25_a_有_a_27",
                                                        "bizName": "调查问卷_a_调查问卷_a_27",
                                                        "label": "饮酒频次",
                                                        "type": "单选",
                                                        "parent": "调查问卷_a_调查问卷_a_25_a_有",
                                                        "group": null,
                                                        "order": 6,
                                                        "description": null,
                                                        "filterTag": null,
                                                        "exportTag": "1",
                                                        "formulaName": null,
                                                        "patiProperty": null,
                                                        "score": null,
                                                        "hasNecessary": false,
                                                        "hasNotNull": false,
                                                        "syncLabelId": null,
                                                        "syncLabelType": null,
                                                        "resultModel": null,
                                                        "syncIsShow": 0,
                                                        "syncChildrenHadData": 0,
                                                        "mark": null,
                                                        "selectUnit": null,
                                                        "defaultValue": null,
                                                        "selectUnitArr": null,
                                                        "eventId": "null",
                                                        "healthDataTag": "null",
                                                        "statusFlag": null,
                                                        "isFetch": null,
                                                        "enclosure": -1,
                                                        "fileMaterials": null,
                                                        "crfTemplateCode": "饮酒频次5",
                                                        "resultId": null,
                                                        "unit": null,
                                                        "width": null,
                                                        "notNull": true,
                                                        "value": null,
                                                        "changed": false,
                                                        "dimension": {
                                                            "id": null,
                                                            "label": "27",
                                                            "name": "27",
                                                            "options": [
                                                                {
                                                                    "id": null,
                                                                    "label": "每周一次或以下",
                                                                    "value": "每周一次或以下",
                                                                    "name": null,
                                                                    "description": null,
                                                                    "order": 10,
                                                                    "children": [

                                                                    ]
                                                                },
                                                                {
                                                                    "id": null,
                                                                    "label": "每周两次",
                                                                    "value": "每周两次",
                                                                    "name": null,
                                                                    "description": null,
                                                                    "order": 20,
                                                                    "children": [

                                                                    ]
                                                                },
                                                                {
                                                                    "id": null,
                                                                    "label": "每周三次",
                                                                    "value": "每周三次",
                                                                    "name": null,
                                                                    "description": null,
                                                                    "order": 30,
                                                                    "children": [

                                                                    ]
                                                                },
                                                                {
                                                                    "id": null,
                                                                    "label": "每周四次或以上",
                                                                    "value": "每周四次或以上",
                                                                    "name": null,
                                                                    "description": null,
                                                                    "order": 40,
                                                                    "children": [

                                                                    ]
                                                                }
                                                            ]
                                                        },
                                                        "extendable": false,
                                                        "children": [

                                                        ]
                                                    },
                                                    {
                                                        "id": null,
                                                        "name": "调查问卷_a_调查问卷_a_25_a_有_a_28",
                                                        "bizName": "调查问卷_a_调查问卷_a_28",
                                                        "label": "是否已戒除饮酒",
                                                        "type": "单选",
                                                        "parent": "调查问卷_a_调查问卷_a_25_a_有",
                                                        "group": null,
                                                        "order": 7,
                                                        "description": null,
                                                        "filterTag": null,
                                                        "exportTag": "1",
                                                        "formulaName": null,
                                                        "patiProperty": null,
                                                        "score": null,
                                                        "hasNecessary": false,
                                                        "hasNotNull": false,
                                                        "syncLabelId": null,
                                                        "syncLabelType": null,
                                                        "resultModel": null,
                                                        "syncIsShow": 0,
                                                        "syncChildrenHadData": 0,
                                                        "mark": null,
                                                        "selectUnit": null,
                                                        "defaultValue": null,
                                                        "selectUnitArr": null,
                                                        "eventId": "null",
                                                        "healthDataTag": "null",
                                                        "statusFlag": null,
                                                        "isFetch": null,
                                                        "enclosure": -1,
                                                        "fileMaterials": null,
                                                        "crfTemplateCode": "是否已戒除饮酒6",
                                                        "resultId": null,
                                                        "unit": null,
                                                        "width": null,
                                                        "notNull": true,
                                                        "value": null,
                                                        "changed": false,
                                                        "dimension": {
                                                            "id": null,
                                                            "label": "28",
                                                            "name": "28",
                                                            "options": [
                                                                {
                                                                    "id": null,
                                                                    "label": "是",
                                                                    "value": "是",
                                                                    "name": null,
                                                                    "description": null,
                                                                    "order": 10,
                                                                    "children": [

                                                                    ]
                                                                },
                                                                {
                                                                    "id": null,
                                                                    "label": "否",
                                                                    "value": "否",
                                                                    "name": null,
                                                                    "description": null,
                                                                    "order": 20,
                                                                    "children": [

                                                                    ]
                                                                }
                                                            ]
                                                        },
                                                        "extendable": false,
                                                        "children": [
                                                            {
                                                                "id": null,
                                                                "name": "调查问卷_a_调查问卷_a_28_a_是",
                                                                "bizName": null,
                                                                "label": "是",
                                                                "type": "虚拟菜单",
                                                                "parent": "调查问卷_a_调查问卷_a_28",
                                                                "group": null,
                                                                "order": 0,
                                                                "description": null,
                                                                "filterTag": null,
                                                                "exportTag": null,
                                                                "formulaName": null,
                                                                "patiProperty": null,
                                                                "score": null,
                                                                "hasNecessary": false,
                                                                "hasNotNull": false,
                                                                "syncLabelId": null,
                                                                "syncLabelType": null,
                                                                "resultModel": null,
                                                                "syncIsShow": null,
                                                                "syncChildrenHadData": 0,
                                                                "mark": null,
                                                                "selectUnit": null,
                                                                "defaultValue": null,
                                                                "selectUnitArr": null,
                                                                "eventId": null,
                                                                "healthDataTag": null,
                                                                "statusFlag": null,
                                                                "isFetch": null,
                                                                "enclosure": 0,
                                                                "fileMaterials": null,
                                                                "crfTemplateCode": null,
                                                                "resultId": null,
                                                                "value": "是",
                                                                "index": null,
                                                                "children": [
                                                                    {
                                                                        "id": null,
                                                                        "name": "调查问卷_a_调查问卷_a_28_a_是_a_29",
                                                                        "bizName": "调查问卷_a_调查问卷_a_29",
                                                                        "label": "已戒除时间",
                                                                        "type": "单选",
                                                                        "parent": "调查问卷_a_调查问卷_a_28_a_是",
                                                                        "group": null,
                                                                        "order": 8,
                                                                        "description": null,
                                                                        "filterTag": null,
                                                                        "exportTag": "1",
                                                                        "formulaName": null,
                                                                        "patiProperty": null,
                                                                        "score": null,
                                                                        "hasNecessary": false,
                                                                        "hasNotNull": false,
                                                                        "syncLabelId": null,
                                                                        "syncLabelType": null,
                                                                        "resultModel": null,
                                                                        "syncIsShow": 0,
                                                                        "syncChildrenHadData": 0,
                                                                        "mark": null,
                                                                        "selectUnit": null,
                                                                        "defaultValue": null,
                                                                        "selectUnitArr": null,
                                                                        "eventId": "null",
                                                                        "healthDataTag": "null",
                                                                        "statusFlag": null,
                                                                        "isFetch": null,
                                                                        "enclosure": -1,
                                                                        "fileMaterials": null,
                                                                        "crfTemplateCode": "已戒除时间7",
                                                                        "resultId": null,
                                                                        "unit": null,
                                                                        "width": null,
                                                                        "notNull": true,
                                                                        "value": null,
                                                                        "changed": false,
                                                                        "dimension": {
                                                                            "id": null,
                                                                            "label": "29",
                                                                            "name": "29",
                                                                            "options": [
                                                                                {
                                                                                    "id": null,
                                                                                    "label": "1月以内",
                                                                                    "value": "1月以内",
                                                                                    "name": null,
                                                                                    "description": null,
                                                                                    "order": 10,
                                                                                    "children": [

                                                                                    ]
                                                                                },
                                                                                {
                                                                                    "id": null,
                                                                                    "label": "1年以内",
                                                                                    "value": "1年以内",
                                                                                    "name": null,
                                                                                    "description": null,
                                                                                    "order": 20,
                                                                                    "children": [

                                                                                    ]
                                                                                },
                                                                                {
                                                                                    "id": null,
                                                                                    "label": "1-5年",
                                                                                    "value": "1-5年",
                                                                                    "name": null,
                                                                                    "description": null,
                                                                                    "order": 30,
                                                                                    "children": [

                                                                                    ]
                                                                                },
                                                                                {
                                                                                    "id": null,
                                                                                    "label": "5年以上",
                                                                                    "value": "5年以上",
                                                                                    "name": null,
                                                                                    "description": null,
                                                                                    "order": 40,
                                                                                    "children": [

                                                                                    ]
                                                                                }
                                                                            ]
                                                                        },
                                                                        "extendable": false,
                                                                        "children": [

                                                                        ]
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "id": 194173,
                                        "name": "调查问卷_a_调查问卷_a_30",
                                        "bizName": "调查问卷_a_调查问卷_a_30",
                                        "label": "是否为母婴传播",
                                        "type": "单选",
                                        "parent": "调查问卷_a_调查问卷",
                                        "group": null,
                                        "order": 9,
                                        "description": null,
                                        "filterTag": null,
                                        "exportTag": "1",
                                        "formulaName": null,
                                        "patiProperty": null,
                                        "score": null,
                                        "hasNecessary": false,
                                        "hasNotNull": false,
                                        "syncLabelId": null,
                                        "syncLabelType": null,
                                        "resultModel": null,
                                        "syncIsShow": 0,
                                        "syncChildrenHadData": 0,
                                        "mark": null,
                                        "selectUnit": null,
                                        "defaultValue": null,
                                        "selectUnitArr": null,
                                        "eventId": "null",
                                        "healthDataTag": "null",
                                        "statusFlag": null,
                                        "isFetch": null,
                                        "enclosure": -1,
                                        "fileMaterials": null,
                                        "crfTemplateCode": "是否为母婴传播",
                                        "resultId": null,
                                        "unit": null,
                                        "width": null,
                                        "notNull": true,
                                        "value": "是",
                                        "changed": false,
                                        "dimension": {
                                            "id": null,
                                            "label": "30",
                                            "name": "30",
                                            "options": [
                                                {
                                                    "id": null,
                                                    "label": "是",
                                                    "value": "是",
                                                    "name": null,
                                                    "description": null,
                                                    "order": 10,
                                                    "children": [

                                                    ]
                                                },
                                                {
                                                    "id": null,
                                                    "label": "否",
                                                    "value": "否",
                                                    "name": null,
                                                    "description": null,
                                                    "order": 20,
                                                    "children": [

                                                    ]
                                                },
                                                {
                                                    "id": null,
                                                    "label": "不详",
                                                    "value": "不详",
                                                    "name": null,
                                                    "description": null,
                                                    "order": 30,
                                                    "children": [

                                                    ]
                                                }
                                            ]
                                        },
                                        "extendable": false,
                                        "children": [

                                        ]
                                    },
                                    {
                                        "id": 194174,
                                        "name": "调查问卷_a_调查问卷_a_31",
                                        "bizName": "调查问卷_a_调查问卷_a_31",
                                        "label": "乙肝表面抗原阳性的时间",
                                        "type": "单选",
                                        "parent": "调查问卷_a_调查问卷",
                                        "group": null,
                                        "order": 10,
                                        "description": null,
                                        "filterTag": null,
                                        "exportTag": "1",
                                        "formulaName": null,
                                        "patiProperty": null,
                                        "score": null,
                                        "hasNecessary": false,
                                        "hasNotNull": false,
                                        "syncLabelId": null,
                                        "syncLabelType": null,
                                        "resultModel": null,
                                        "syncIsShow": 0,
                                        "syncChildrenHadData": 0,
                                        "mark": null,
                                        "selectUnit": null,
                                        "defaultValue": null,
                                        "selectUnitArr": null,
                                        "eventId": "null",
                                        "healthDataTag": "null",
                                        "statusFlag": null,
                                        "isFetch": null,
                                        "enclosure": -1,
                                        "fileMaterials": null,
                                        "crfTemplateCode": "乙肝表面抗原阳性的时间",
                                        "resultId": null,
                                        "unit": null,
                                        "width": null,
                                        "notNull": true,
                                        "value": "小于5年",
                                        "changed": false,
                                        "dimension": {
                                            "id": null,
                                            "label": "31",
                                            "name": "31",
                                            "options": [
                                                {
                                                    "id": null,
                                                    "label": "小于5年",
                                                    "value": "小于5年",
                                                    "name": null,
                                                    "description": null,
                                                    "order": 10,
                                                    "children": [

                                                    ]
                                                },
                                                {
                                                    "id": null,
                                                    "label": "5-10年",
                                                    "value": "5-10年",
                                                    "name": null,
                                                    "description": null,
                                                    "order": 20,
                                                    "children": [

                                                    ]
                                                },
                                                {
                                                    "id": null,
                                                    "label": "10-20年",
                                                    "value": "10-20年",
                                                    "name": null,
                                                    "description": null,
                                                    "order": 30,
                                                    "children": [

                                                    ]
                                                },
                                                {
                                                    "id": null,
                                                    "label": "20年以上",
                                                    "value": "20年以上",
                                                    "name": null,
                                                    "description": null,
                                                    "order": 40,
                                                    "children": [

                                                    ]
                                                },
                                                {
                                                    "id": null,
                                                    "label": "不详",
                                                    "value": "不详",
                                                    "name": null,
                                                    "description": null,
                                                    "order": 50,
                                                    "children": [

                                                    ]
                                                }
                                            ]
                                        },
                                        "extendable": false,
                                        "children": [

                                        ]
                                    },
                                    {
                                        "id": 194175,
                                        "name": "调查问卷_a_调查问卷_a_32",
                                        "bizName": "调查问卷_a_调查问卷_a_32",
                                        "label": "除肝炎外重要病史",
                                        "type": "多选",
                                        "parent": "调查问卷_a_调查问卷",
                                        "group": null,
                                        "order": 11,
                                        "description": null,
                                        "filterTag": null,
                                        "exportTag": "1",
                                        "formulaName": null,
                                        "patiProperty": null,
                                        "score": null,
                                        "hasNecessary": false,
                                        "hasNotNull": false,
                                        "syncLabelId": null,
                                        "syncLabelType": null,
                                        "resultModel": null,
                                        "syncIsShow": 0,
                                        "syncChildrenHadData": 0,
                                        "mark": null,
                                        "selectUnit": null,
                                        "defaultValue": null,
                                        "selectUnitArr": null,
                                        "eventId": "null",
                                        "healthDataTag": "null",
                                        "statusFlag": null,
                                        "isFetch": null,
                                        "enclosure": -1,
                                        "fileMaterials": null,
                                        "crfTemplateCode": "除肝炎外重要病史",
                                        "resultId": null,
                                        "unit": null,
                                        "width": null,
                                        "notNull": true,
                                        "value": "无",
                                        "changed": false,
                                        "dimension": {
                                            "id": null,
                                            "label": "32",
                                            "name": "32",
                                            "options": [
                                                {
                                                    "id": null,
                                                    "label": "无",
                                                    "value": "无",
                                                    "name": null,
                                                    "description": null,
                                                    "order": 10,
                                                    "children": [

                                                    ]
                                                },
                                                {
                                                    "id": null,
                                                    "label": "糖尿病",
                                                    "value": "糖尿病",
                                                    "name": null,
                                                    "description": null,
                                                    "order": 20,
                                                    "children": [

                                                    ]
                                                },
                                                {
                                                    "id": null,
                                                    "label": "高血压",
                                                    "value": "高血压",
                                                    "name": null,
                                                    "description": null,
                                                    "order": 30,
                                                    "children": [

                                                    ]
                                                },
                                                {
                                                    "id": null,
                                                    "label": "心脏疾病",
                                                    "value": "心脏疾病",
                                                    "name": null,
                                                    "description": null,
                                                    "order": 40,
                                                    "children": [

                                                    ]
                                                },
                                                {
                                                    "id": null,
                                                    "label": "脑血管疾病",
                                                    "value": "脑血管疾病",
                                                    "name": null,
                                                    "description": null,
                                                    "order": 50,
                                                    "children": [

                                                    ]
                                                },
                                                {
                                                    "id": null,
                                                    "label": "慢性阻塞性肺病",
                                                    "value": "慢性阻塞性肺病",
                                                    "name": null,
                                                    "description": null,
                                                    "order": 60,
                                                    "children": [

                                                    ]
                                                },
                                                {
                                                    "id": null,
                                                    "label": "肾功能不全",
                                                    "value": "肾功能不全",
                                                    "name": null,
                                                    "description": null,
                                                    "order": 70,
                                                    "children": [

                                                    ]
                                                },
                                                {
                                                    "id": null,
                                                    "label": "其他",
                                                    "value": "其他",
                                                    "name": null,
                                                    "description": null,
                                                    "order": 80,
                                                    "children": [

                                                    ]
                                                }
                                            ]
                                        },
                                        "extendable": false,
                                        "children": [
                                            {
                                                "id": null,
                                                "name": "调查问卷_a_调查问卷_a_32_a_其他",
                                                "bizName": null,
                                                "label": "其他",
                                                "type": "虚拟菜单",
                                                "parent": "调查问卷_a_调查问卷_a_32",
                                                "group": null,
                                                "order": 0,
                                                "description": null,
                                                "filterTag": null,
                                                "exportTag": null,
                                                "formulaName": null,
                                                "patiProperty": null,
                                                "score": null,
                                                "hasNecessary": false,
                                                "hasNotNull": false,
                                                "syncLabelId": null,
                                                "syncLabelType": null,
                                                "resultModel": null,
                                                "syncIsShow": null,
                                                "syncChildrenHadData": 0,
                                                "mark": null,
                                                "selectUnit": null,
                                                "defaultValue": null,
                                                "selectUnitArr": null,
                                                "eventId": null,
                                                "healthDataTag": null,
                                                "statusFlag": null,
                                                "isFetch": null,
                                                "enclosure": 0,
                                                "fileMaterials": null,
                                                "crfTemplateCode": null,
                                                "resultId": null,
                                                "value": "其他",
                                                "index": null,
                                                "children": [
                                                    {
                                                        "id": null,
                                                        "name": "调查问卷_a_调查问卷_a_32_a_其他_a_33",
                                                        "bizName": "调查问卷_a_调查问卷_a_33",
                                                        "label": "其他",
                                                        "type": "小文本输入",
                                                        "parent": "调查问卷_a_调查问卷_a_32_a_其他",
                                                        "group": null,
                                                        "order": 12,
                                                        "description": null,
                                                        "filterTag": null,
                                                        "exportTag": "1",
                                                        "formulaName": null,
                                                        "patiProperty": null,
                                                        "score": null,
                                                        "hasNecessary": false,
                                                        "hasNotNull": false,
                                                        "syncLabelId": null,
                                                        "syncLabelType": null,
                                                        "resultModel": null,
                                                        "syncIsShow": 0,
                                                        "syncChildrenHadData": 0,
                                                        "mark": null,
                                                        "selectUnit": null,
                                                        "defaultValue": null,
                                                        "selectUnitArr": null,
                                                        "eventId": "null",
                                                        "healthDataTag": "null",
                                                        "statusFlag": null,
                                                        "isFetch": null,
                                                        "enclosure": -1,
                                                        "fileMaterials": null,
                                                        "crfTemplateCode": "其他8",
                                                        "resultId": null,
                                                        "unit": null,
                                                        "width": null,
                                                        "notNull": false,
                                                        "value": null,
                                                        "changed": false,
                                                        "minTextLength": null,
                                                        "maxTextLength": null,
                                                        "length": 10,
                                                        "children": [

                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    },
                                    {
                                        "id": 194176,
                                        "name": "调查问卷_a_调查问卷_a_34",
                                        "bizName": "调查问卷_a_调查问卷_a_34",
                                        "label": "最近一次就诊或检查时间？",
                                        "type": "时间-年月日",
                                        "parent": "调查问卷_a_调查问卷",
                                        "min":"2020-10-15",
                                        "max":"2020-10-22",
                                        "group": null,
                                        "order": 13,
                                        "description": null,
                                        "filterTag": null,
                                        "exportTag": "1",
                                        "formulaName": null,
                                        "patiProperty": null,
                                        "score": null,
                                        "hasNecessary": false,
                                        "hasNotNull": false,
                                        "syncLabelId": null,
                                        "syncLabelType": null,
                                        "resultModel": null,
                                        "syncIsShow": 0,
                                        "syncChildrenHadData": 0,
                                        "mark": null,
                                        "selectUnit": null,
                                        "defaultValue": null,
                                        "selectUnitArr": null,
                                        "eventId": "null",
                                        "healthDataTag": "null",
                                        "statusFlag": null,
                                        "isFetch": null,
                                        "enclosure": -1,
                                        "fileMaterials": null,
                                        "crfTemplateCode": "最近一次就诊或检查时间？",
                                        "resultId": null,
                                        "unit": null,
                                        "width": null,
                                        "notNull": true,
                                        "value": "2020-09-17",
                                        "changed": false,
                                        "format": "yyyy-mm-dd",
                                        "dimension": null,
                                        "children": [

                                        ]
                                    },
                                    {
                                        "id": null,
                                        "name": "调查问卷_a_调查问卷_a_128",
                                        "bizName": "调查问卷_a_调查问卷_a_128",
                                        "label": "您是否近期有怀孕计划或已经怀孕",
                                        "type": "单选",
                                        "parent": "调查问卷_a_调查问卷",
                                        "group": null,
                                        "order": 18,
                                        "description": "“为了您和家人的健康，若承保期间有妊娠计划，请到专科医师处就诊咨询。若已发生妊娠，请第一时间致电随访中心。”",
                                        "filterTag": null,
                                        "exportTag": "1",
                                        "formulaName": null,
                                        "patiProperty": null,
                                        "score": null,
                                        "hasNecessary": false,
                                        "hasNotNull": false,
                                        "syncLabelId": null,
                                        "syncLabelType": null,
                                        "resultModel": null,
                                        "syncIsShow": 0,
                                        "syncChildrenHadData": 0,
                                        "mark": null,
                                        "selectUnit": null,
                                        "defaultValue": null,
                                        "selectUnitArr": null,
                                        "eventId": "1",
                                        "healthDataTag": "null",
                                        "statusFlag": null,
                                        "isFetch": null,
                                        "enclosure": -1,
                                        "fileMaterials": null,
                                        "crfTemplateCode": "您是否近期有怀孕计划或已经怀孕",
                                        "resultId": null,
                                        "unit": null,
                                        "width": null,
                                        "notNull": false,
                                        "value": null,
                                        "changed": false,
                                        "dimension": {
                                            "id": null,
                                            "label": "128",
                                            "name": "128",
                                            "options": [
                                                {
                                                    "id": null,
                                                    "label": "无",
                                                    "value": "无",
                                                    "name": null,
                                                    "description": null,
                                                    "order": 10,
                                                    "children": [

                                                    ]
                                                },
                                                {
                                                    "id": null,
                                                    "label": "计划怀孕",
                                                    "value": "计划怀孕",
                                                    "name": null,
                                                    "description": null,
                                                    "order": 20,
                                                    "children": [

                                                    ]
                                                },
                                                {
                                                    "id": null,
                                                    "label": "已经怀孕",
                                                    "value": "已经怀孕",
                                                    "name": null,
                                                    "description": null,
                                                    "order": 30,
                                                    "children": [

                                                    ]
                                                }
                                            ]
                                        },
                                        "extendable": false,
                                        "children": [

                                        ]
                                    },
                                    {
                                        "id": null,
                                        "name": "调查问卷_a_调查问卷_a_130",
                                        "bizName": "调查问卷_a_调查问卷_a_130",
                                        "label": "就诊医院",
                                        "type": "小文本输入",
                                        "parent": "调查问卷_a_调查问卷",
                                        "group": null,
                                        "order": 19,
                                        "description": null,
                                        "filterTag": null,
                                        "exportTag": "1",
                                        "formulaName": null,
                                        "patiProperty": null,
                                        "score": null,
                                        "hasNecessary": false,
                                        "hasNotNull": false,
                                        "syncLabelId": null,
                                        "syncLabelType": null,
                                        "resultModel": null,
                                        "syncIsShow": 0,
                                        "syncChildrenHadData": 0,
                                        "mark": null,
                                        "selectUnit": null,
                                        "defaultValue": null,
                                        "selectUnitArr": null,
                                        "eventId": "null",
                                        "healthDataTag": "null",
                                        "statusFlag": null,
                                        "isFetch": null,
                                        "enclosure": -1,
                                        "fileMaterials": null,
                                        "crfTemplateCode": "就诊医院",
                                        "resultId": null,
                                        "unit": null,
                                        "width": null,
                                        "notNull": false,
                                        "value": null,
                                        "changed": false,
                                        "minTextLength": null,
                                        "maxTextLength": null,
                                        "length": 10,
                                        "children": [

                                        ]
                                    },
                                    {
                                        "id": null,
                                        "name": "调查问卷_a_调查问卷_a_131",
                                        "bizName": "调查问卷_a_调查问卷_a_131",
                                        "label": "主管医生姓名",
                                        "type": "小文本输入",
                                        "parent": "调查问卷_a_调查问卷",
                                        "group": null,
                                        "order": 20,
                                        "description": null,
                                        "filterTag": null,
                                        "exportTag": "1",
                                        "formulaName": null,
                                        "patiProperty": null,
                                        "score": null,
                                        "hasNecessary": false,
                                        "hasNotNull": false,
                                        "syncLabelId": null,
                                        "syncLabelType": null,
                                        "resultModel": null,
                                        "syncIsShow": 0,
                                        "syncChildrenHadData": 0,
                                        "mark": null,
                                        "selectUnit": null,
                                        "defaultValue": null,
                                        "selectUnitArr": null,
                                        "eventId": "null",
                                        "healthDataTag": "null",
                                        "statusFlag": null,
                                        "isFetch": null,
                                        "enclosure": -1,
                                        "fileMaterials": null,
                                        "crfTemplateCode": "主管医生姓名",
                                        "resultId": null,
                                        "unit": null,
                                        "width": null,
                                        "notNull": false,
                                        "value": null,
                                        "changed": false,
                                        "minTextLength": null,
                                        "maxTextLength": null,
                                        "length": 10,
                                        "children": [

                                        ]
                                    },
                                    {
                                        "id": null,
                                        "name": "调查问卷_a_调查问卷_a_132",
                                        "bizName": "调查问卷_a_调查问卷_a_132",
                                        "label": "血清丙氨酸氨基转移酶测定",
                                        "type": "数值输入-单值",
                                        "parent": "调查问卷_a_调查问卷",
                                        "group": null,
                                        "order": 21,
                                        "description": null,
                                        "filterTag": null,
                                        "exportTag": "1",
                                        "formulaName": null,
                                        "patiProperty": null,
                                        "score": null,
                                        "hasNecessary": false,
                                        "hasNotNull": false,
                                        "syncLabelId": null,
                                        "syncLabelType": null,
                                        "resultModel": null,
                                        "syncIsShow": 0,
                                        "syncChildrenHadData": 0,
                                        "mark": null,
                                        "selectUnit": null,
                                        "defaultValue": null,
                                        "selectUnitArr": null,
                                        "eventId": "null",
                                        "healthDataTag": "null",
                                        "statusFlag": null,
                                        "isFetch": null,
                                        "enclosure": -1,
                                        "fileMaterials": null,
                                        "crfTemplateCode": "血清丙氨酸氨基转移酶测定",
                                        "resultId": null,
                                        "unit": "U/L",
                                        "width": null,
                                        "notNull": false,
                                        "value": null,
                                        "changed": false,
                                        "min": null,
                                        "max": null,
                                        "range": false,
                                        "children": [

                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "count": 0,
                "timestamp": "-1",
                "crfTemplateId": 2,
                "interviewId": 1009851
            }
        ],
        "status": "OK",
        "description": "数据请求成功"
    }

    res.json(result);
})

//获取戒烟表单
router.get('/smoke',function (req, res, next) {
    var result ={};
    res.json(result);
})

//获取基本信息表单
router.get('/basic',function (req, res, next) {
    var result ={};
    res.json(result);
})


//纪录每个人在系统里的浏览记录
router.get('/pageInfo', function (req, res, next) {
    var sql =
        "insert into " + "`page-info`" + `(user_id,page,page_name,stay_time) values ("${req.query.userId}","${req.query.page}","${req.query.pageName}","${req.query.stayTime}")`;
    db.query(sql, function (err, rows, field) {
        if (err) {
            console.log(err);
        }
        const data = mockjs.mock({
            "data": {
                "data": "ok"
            },
            "status": 200
        });
        res.json(data);
    });
});

router.get('/pageView', function (req, res, next) {
    var sql = "select page,page_name,round(sum(stay_time),2) sum,count(*) count from `page-info` group by page,page_name order by count(*)";
    db.query(sql, function (err, rows, field) {
        if (err) {
            console.log(err);
        }
        const data = mockjs.mock({
            "data": rows,
            status: 200
        });
        res.json(data);
    })
})


//注销接口,更改session状态
router.get('/logout', function (req, res, next) {
    var sql = "update user set ts ='0' where personId='123'";
    db.query(sql, function (err, rows, field) {
        if (err) {
            console.log(err);
        }
        var result = "logout";

        const data = mockjs.mock({
            "data": {
                message: result
            },
            "status": 200
        });

        res.json(data)
    })
})

//私密接口
router.get('/', function (req, res, next) {

    if (req.body.name) {
        res.send("hello world");
    } else {

    }
});

router.post('/me', function (req, res, next) {
    console.log(req.query);

    var password = md5(req.query.password).toString();
    console.log(password);

    const data = mockjs.mock({
        "data": {
            password: password
        },
        "status": 200
    })
    res.json(data);

});

router.get('/select', function (req, res, next) {
    var sql = "select * from user";

    db.query(sql, function (err, rows, field) {
        if (err) {
            return;
        }
        const data = mockjs.mock({
            "data": {
                message: rows
            },
            "status": 200
        })
        res.json(data)
    })
});

router.get('/basic/info/:patientId', function (req, res, next) {
    patientId = req.query.patientId

    var data = mockjs.mock({
        "data": {
            "name": "quinn",
            "sex": "男",
            "age": 18,
            "patientId": "10001",
            "phone": "18888888888",
            "address": "北京海淀",
            "idType": "身份证",
            "idNumber": "110402199309272232"
        },
        "status": "ok",
        "description": "数据请求成功"
    });

    res.json(data)
});

router.get('/prescription/search', function (req, res, next) {
    keyword = req.query.filter_LIKE_searchValue

    var data = mockjs.mock({
        "data": [
            {
                "id": 1,
                "name": "quinn",
                "sex": "男",
                "age": 18,
                "patientId": "10001",
                "phone": "18888888888",
                "address": "北京海淀",
            },
            {
                "id": 2,
                "name": "sunny",
                "sex": "女",
                "age": 20,
                "patientId": "10001",
                "phone": "18888888888",
                "address": "河北石家庄",
            }
        ],
        "status": "ok",
        "description": "数据请求成功"
    });

    res.json(data)
});

/**
 * 获取慢病数据
 * @type {Router|router}
 */
router.get('/disease/list', function (req, res, next) {
    var data = mockjs.mock({
        "data": {
            "id": 59,
            "name": null,
            "label": "时间轴_历次就诊信息",
            "type": null,
            "limits": null,
            "result": [
                {
                    "pati_id": "0020404703",
                    "xl_patient_id": "501_0020404703",
                    "xl_medical_id": "501_2_1",
                    "medical_date": "2017-06-29 15:34:00",
                    "medical_type_id": "3",
                    "title": "住院_呼吸科",
                    "note": "睡眠呼吸暂停低通气综合征"
                },
                {
                    "pati_id": "0020404703",
                    "xl_patient_id": "501_0020404703",
                    "xl_medical_id": "501_1_1",
                    "medical_date": "2017-06-29 00:00:00",
                    "medical_type_id": "2",
                    "title": "门诊_呼吸科",
                    "note": "睡眠呼吸暂停综合征"
                },
                {
                    "pati_id": "0020404703",
                    "xl_patient_id": "501_0020402312",
                    "xl_medical_id": "501_2_3",
                    "medical_date": "2019-06-19 00:00:00",
                    "medical_type_id": "4",
                    "title": "慢病_呼吸科",
                    "note": "睡眠测试综合征"
                }
            ],
            "status": "ok"
        },
        "status": "ok",
        "description": "数据请求成功"
    });

    res.json(data)
});

router.get('/disease/list', function () {
    var data = mockjs.mock({
        "data": {
            "info": "info"
        },
        "status": "ok",
        "description": "数据请求成功"
    })
    res.json(data);
})

/**
 * 慢病测试-获取数据
 * @type {Router|router}
 */
router.get('/disease-src', function (req, res, next) {
    var data = mockjs.mock({
        "data": {
            "info": "info"
        },
        "status": "ok",
        "description": "数据请求成功"
    })
    res.json(data);
})

/**
 * 图表数据
 */
router.get('/disease-charts', function (req, res, next) {
    var data = mockjs.mock({
        "data": [
            {
                "time": "2020-02-02 00:00:00",
                "healthData": [
                    {
                        "name": "收缩压",
                        "value": 140,
                        "unit":'mmol'
                    },
                    {
                        "name": "舒张压",
                        "value": 80,
                        "unit":'mmol'
                    }
                ]
            },
            {
                "time": "2020-02-03 00:00:00",
                "healthData": [
                    {
                        "name": "收缩压",
                        "value": 140,
                        "unit":'mmol'
                    },
                    {
                        "name": "舒张压",
                        "value": 80,
                        "unit":'mmol'
                    }
                ]
            }
        ],
        "status": "200",
        "description": "数据请求成功"
    })
    res.json(data);
})

router.get('/scheme-list', function (req, res, next) {
    var data = mockjs.mock({
        "data": [
            {
                "schemeName": "高血压健康管理方案",
                "estimateTime": "2020-02-15 10:59:26",
                "estimateEvidence": "评估依据",
                "estimateResult": "1级高血压低危",
                "schemes": {
                    "drug": [
                        {
                            "schemeTemplate": {
                                "name": "用药方案",
                                "schemeMaterials": [
                                    {
                                        "materialName": "马来酸依那普利",
                                        "dateName": "日",
                                        "dateValue": "1",
                                        "timeValue": "1",
                                        "timeName": "次",
                                        "operationName": "口服",
                                        "dosageValue": "1",
                                        "dosageName": "g",
                                        "medicationTime": [
                                            "08:00",
                                            "10:00"
                                        ]
                                    }
                                ]
                            }
                        }
                    ],
                    "interview": [
                        {
                            "schemeTemplate": {
                                "name": "每日上报",
                                "dateName": "日",
                                "dateValue": "1",
                                "timeValue": "1",
                                "timeName": "次",
                                "schemeMaterials": [
                                    {
                                        "materialName": "血压",
                                        "crfTemplateInfoNames": [
                                            "收缩压",
                                            "舒张压"
                                        ]
                                    }
                                ]
                            }
                        },
                        {
                            "schemeTemplate": {
                                "name": "月度随访",
                                "dateName": "月",
                                "dateValue": "3",
                                "timeValue": "1",
                                "timeName": "次",
                                "schemeMaterials": [
                                    {
                                        "materialName": "血常规",
                                        "crfTemplateInfoNames": [
                                            "白细胞计数（WBC）",
                                            "红细胞计数（RBC）"
                                        ]
                                    }
                                ]
                            }
                        }
                    ],
                    "sport": [
                        {
                            "schemeTemplate": {
                                "name": "运动方案",
                                "schemeMaterials": [
                                    {
                                        "materialName": "运动方案",
                                        "sportWay": "游泳、打球、登山、慢跑",
                                        "sportTimeAdmission": "餐后",
                                        "sportTimeValue": "1",
                                        "sportTimeUnit": "小时",
                                        "sportDurationValue": "40～60",
                                        "sportDurationUnit": "分钟",
                                        "dateName": "日",
                                        "dateValue": "1",
                                        "timeValue": "1",
                                        "timeName": "次"
                                    }
                                ]
                            }
                        }
                    ],
                    "diet": [
                        {
                            "schemeTemplate": {
                                "name": "饮食建议",
                                "schemeMaterials": [
                                    {
                                        "bmr": "BMR = 66 + ( 13.7 x 体重kg ) + ( 5 x 身高cm ) - ( 6.8 x 年龄years )",
                                        "dietRules": [
                                            "控制体重",
                                            "戒烟",
                                            "限制饮酒"
                                        ],
                                        "dietChoices": [
                                            {
                                                "value": {
                                                    "suitable_food": "米饭、粥",
                                                    "unsuitable_food": "番薯、干豆类"
                                                },
                                                "lable": "碳水化合物"
                                            },
                                            {
                                                "value": {
                                                    "suitable_food": "脂肪少的食品",
                                                    "unsuitable_food": "脂肪多的食品"
                                                },
                                                "lable": "蛋白质"
                                            }
                                        ],
                                        "dietPlan": [
                                            {
                                                "scheme": {
                                                    "breakfast": "早餐",
                                                    "breakfast_plus": "早餐加餐",
                                                    "lunch": "午餐",
                                                    "lunch_plus": "午餐加餐",
                                                    "dinner": "晚餐",
                                                    "dinner_plus": "晚餐加餐"
                                                }
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        ],
        "status": "200",
        "description": "数据请求成功"
    })
    res.json(data);
})

router.get('/disease-info', function (req, res, next) {
    var data = mockjs.mock({
        "data": [{
            "diseaseId": 2,
            "xlPatientId": "123123",
            "nurseGroupName": "高血压管理组",
            "schemeGroupName": "1级高血压低危",
            "responsibleDoctor": "张医生",
            "healthDataTypes": [{"id": 1, "name": "血压"}, {"id": 2, "name": "血脂"}]
        }, {
            "diseaseId": 3,
            "xlPatientId": "123123",
            "nurseGroupName": "糖尿病管理组",
            "schemeGroupName": "1级糖尿病",
            "responsibleDoctor": "张医生",
            "healthDataTypes": [{"id": 2, "name": "血脂"}]
        }], "status": "200", "description": "数据请求成功"
    })
    res.json(data);
})

/**
 *
 * @type {Router|router}
 */

module.exports = router
