/**
 * API 接口路由全部在这里定义
 */

const express = require('express')
const mockjs = require('mockjs')
var db=require('./bean/sql-basic')

var router = express.Router()

router.get('/select', function(req, res, next) {
    var sql="select * from user";
    var result=""

    db.query(sql,function (err,rows,field) {
        if (err){
            console.log(err);
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

router.get('/detailed/info/:patientId/template/:templateId', function(req, res, next) {
    patientId = req.query.patientId

    var data = mockjs.mock({
        "data": [
            {
                "moduleId": "1",
                "type": "hasTree",
                "name": "主诉",
                "no": "complaint",
                "data": [
                    {
                        "kid": "1",
                        "label": "symptom",
                        "name": "症状",
                        "type": "lable",
                        "remark": "这里是备注呀",
                        "hasSearch": "true",
                        "notHasAttribute": "true",
                        "childs": [
                            {
                                "kid": "1000",
                                "label": null,
                                "name": "胸痛",
                                "origin": "模板预设值",
                                "type": "entity",
                                "relate": null,
                                "childs": [
                                    {
                                        "kid": "1000_1",
                                        "label": null,
                                        "name": "发病时长",
                                        "type": "smallText",
                                        "value": "12",
                                        "valueUnit": "1000_1_1",
                                        "unit": [
                                            {
                                                "kid": "1000_1_1",
                                                "label": null,
                                                "name": null,
                                                "type": "value",
                                                "unit": "天"
                                            },
                                            {
                                                "kid": "1000_1_2",
                                                "label": null,
                                                "name": null,
                                                "type": "value",
                                                "unit": "年"
                                            }
                                        ]
                                    },
                                    {
                                        "kid": "1000_2",
                                        "label": null,
                                        "name": "诱发因素",
                                        "type": "checkbox",
                                        "value": [
                                            "1000_2_1",
                                            "1000_2_2"
                                        ],
                                        "options": [
                                            {
                                                "kid": "1000_2_1",
                                                "label": null,
                                                "name": "劳累",
                                                "type": "value",
                                                "unit": null
                                            },
                                            {
                                                "kid": "1000_2_2",
                                                "label": null,
                                                "name": "休克",
                                                "type": "value",
                                                "unit": null
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
                "moduleId": "2",
                "name": "现病史",
                "notHasAttribute": "false",
                "type": "hasTree",
                "no": "presentIllness",
                "data": [
                    {
                        "kid": "1",
                        "label": "symptom",
                        "name": "症状",
                        "type": "lable",
                        "remark": "这里是备注呀",
                        "hasSearch": "true",
                        "notHasAttribute": "true",
                        "childs": [
                            {
                                "kid": "1000",
                                "label": null,
                                "name": "胸痛",
                                "origin": "模板预设值",
                                "type": "entity",
                                "relate": null,
                                "childs": [
                                    {
                                        "kid": "1000_1",
                                        "label": null,
                                        "name": "发病时长",
                                        "type": "smallText",
                                        "value": "12",
                                        "valueUnit": "1000_1_1",
                                        "unit": [
                                            {
                                                "kid": "1000_1_1",
                                                "label": null,
                                                "name": null,
                                                "type": "value",
                                                "unit": "天"
                                            },
                                            {
                                                "kid": "1000_1_2",
                                                "label": null,
                                                "name": null,
                                                "type": "value",
                                                "unit": "年"
                                            }
                                        ]
                                    },
                                    {
                                        "kid": "1000_2",
                                        "label": null,
                                        "name": "诱发因素",
                                        "type": "checkbox",
                                        "value": [
                                            "1000_2_1",
                                            "1000_2_2"
                                        ],
                                        "options": [
                                            {
                                                "kid": "1000_2_1",
                                                "label": null,
                                                "name": "劳累",
                                                "type": "value",
                                                "unit": null
                                            },
                                            {
                                                "kid": "1000_2_2",
                                                "label": null,
                                                "name": "休克",
                                                "type": "value",
                                                "unit": null
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
                "moduleId": "3",
                "name": "既往史",
                "notHasAttribute": "false",
                "type": "noTree",
                "no": "presentIllness",
                "data":  [
                    {
                        "kid": "2",
                        "label": null,
                        "name": "吸烟饮酒",
                        "remark": "这里是吸烟饮酒的备注呀",
                        "type": "label",
                        "hasSearch": "false",
                        "notHasAttribute": "false",
                        "childs": [
                            {
                                "type": "smallText",
                                "label": null,
                                "kid": "200",
                                "name": "烟龄",
                                "value": "12",
                                "unitValue": "200_1",
                                "unit": [
                                    {
                                        "kid": "200_1",
                                        "label": null,
                                        "name": null,
                                        "type": "value",
                                        "unit": "年"
                                    },
                                    {
                                        "kid": "200_2",
                                        "label": null,
                                        "name": null,
                                        "type": "value",
                                        "unit": "月"
                                    }
                                ]
                            },
                            {
                                "type": "smallText",
                                "label": null,
                                "kid": "201",
                                "name": "吸烟量",
                                "value": null,
                                "unitValue": "201_1",
                                "unit": [
                                    {
                                        "kid": "201_1",
                                        "label": null,
                                        "name": null,
                                        "value": null,
                                        "context": null,
                                        "rn": "",
                                        "origin": "",
                                        "type": "value",
                                        "unit": "支/天"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "kid": "3",
                        "name": "既往疾病",
                        "label": null,
                        "remark": "这里是既往疾病的备注呀",
                        "type": "label",
                        "hasSearch": "true",
                        "notHasAttribute": "false",
                        "childs": [
                            {
                                "type": "checkbox",
                                "kid": "300",
                                "label": null,
                                "name": "既往疾病",
                                "value": [
                                    "300_1"
                                ],
                                "options": [
                                    {
                                        "kid": "300_1",
                                        "label": null,
                                        "name": "高血压",
                                        "type": "value",
                                        "unit": null
                                    },
                                    {
                                        "kid": "300_2",
                                        "label": null,
                                        "name": "糖尿病",
                                        "type": "value",
                                        "unit": null
                                    },
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "moduleId": "4",
                "notHasAttribute": "false",
                "name": "过敏史",
                "type": "noTree",
                "no": "presentIllness",
                "data": [
                    {
                        "kid": "2",
                        "label": null,
                        "name": "过敏data",
                        "remark": "这里是过敏data的备注呀",
                        "type": "label",
                        "hasSearch": "false",
                        "notHasAttribute": "false",
                        "childs": [
                            {
                                "type": "smallText",
                                "label": null,
                                "kid": "200",
                                "name": "过敏child",
                                "value": "12",
                                "unitValue": "200_1",
                                "unit": [
                                    {
                                        "kid": "200_1",
                                        "label": null,
                                        "name": null,
                                        "type": "value",
                                        "unit": "年"
                                    },
                                    {
                                        "kid": "200_2",
                                        "label": null,
                                        "name": null,
                                        "type": "value",
                                        "unit": "月"
                                    }
                                ]
                            },
                            {
                                "type": "smallText",
                                "label": null,
                                "kid": "201",
                                "name": "过敏child2",
                                "value": null,
                                "unitValue": "201_1",
                                "unit": [
                                    {
                                        "kid": "201_1",
                                        "label": null,
                                        "name": null,
                                        "value": null,
                                        "context": null,
                                        "rn": "",
                                        "origin": "",
                                        "type": "value",
                                        "unit": "支/天"
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        "kid": "3",
                        "name": "过敏data2",
                        "label": null,
                        "remark": "这里是过敏data2的备注呀",
                        "type": "label",
                        "hasSearch": "true",
                        "notHasAttribute": "false",
                        "childs": [
                            {
                                "type": "checkbox",
                                "kid": "300",
                                "label": null,
                                "name": "过敏child",
                                "value": [
                                    "300_1"
                                ],
                                "options": [
                                    {
                                        "kid": "300_1",
                                        "label": null,
                                        "name": "过敏opt",
                                        "type": "value",
                                        "unit": null
                                    },
                                    {
                                        "kid": "300_2",
                                        "label": null,
                                        "name": "过敏opt2",
                                        "type": "value",
                                        "unit": null
                                    },
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "moduleId": "5",
                "name": "体格检查",
                "notHasAttribute": "true",
                "type": "hasTree",
                "no": "presentIllness",
                "data": null
            },
            {
                "moduleId": "6",
                "name": "检验结果",
                "notHasAttribute": "true",
                "type": "hasTree",
                "no": "presentIllness",
                "data": null
            },
            {
                "moduleId": "7",
                "notHasAttribute": "true",
                "name": "检查结果",
                "type": "hasTree",
                "no": "presentIllness",
                "data":[
                    {
                        "kid": "1",
                        "label": "symptom",
                        "name": "症状",
                        "type": "lable",
                        "remark": "这里是备注呀",
                        "hasSearch": "true",
                        "notHasAttribute": "true",
                        "childs": [
                            {
                                "kid": "1000",
                                "label": null,
                                "name": "胸痛",
                                "origin": "模板预设值",
                                "type": "entity",
                                "relate": null,
                                "childs": [
                                    {
                                        "kid": "1000_1",
                                        "label": null,
                                        "name": "发病时长",
                                        "type": "smallText",
                                        "value": "12",
                                        "valueUnit": "1000_1_1",
                                        "unit": [
                                            {
                                                "kid": "1000_1_1",
                                                "label": null,
                                                "name": null,
                                                "type": "value",
                                                "unit": "天"
                                            },
                                            {
                                                "kid": "1000_1_2",
                                                "label": null,
                                                "name": null,
                                                "type": "value",
                                                "unit": "年"
                                            }
                                        ]
                                    },
                                    {
                                        "kid": "1000_2",
                                        "label": null,
                                        "name": "诱发因素",
                                        "type": "checkbox",
                                        "value": [
                                            "1000_2_1",
                                            "1000_2_2"
                                        ],
                                        "options": [
                                            {
                                                "kid": "1000_2_1",
                                                "label": null,
                                                "name": "劳累",
                                                "type": "value",
                                                "unit": null
                                            },
                                            {
                                                "kid": "1000_2_2",
                                                "label": null,
                                                "name": "休克",
                                                "type": "value",
                                                "unit": null
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
                "moduleId": "8",
                "notHasAttribute": "true",
                "name": "诊断结果",
                "type": "hasTree",
                "no": "presentIllness",
                "data": [
                    {
                        "kid": "1",
                        "label": "symptom",
                        "name": "症状",
                        "type": "lable",
                        "remark": "这里是备注呀",
                        "hasSearch": "true",
                        "notHasAttribute": "true",
                        "childs": [
                            {
                                "kid": "1000",
                                "label": null,
                                "name": "胸痛",
                                "origin": "模板预设值",
                                "type": "entity",
                                "relate": null,
                                "childs": [
                                    {
                                        "kid": "1000_1",
                                        "label": null,
                                        "name": "发病时长",
                                        "type": "smallText",
                                        "value": "12",
                                        "valueUnit": "1000_1_1",
                                        "unit": [
                                            {
                                                "kid": "1000_1_1",
                                                "label": null,
                                                "name": null,
                                                "type": "value",
                                                "unit": "天"
                                            },
                                            {
                                                "kid": "1000_1_2",
                                                "label": null,
                                                "name": null,
                                                "type": "value",
                                                "unit": "年"
                                            }
                                        ]
                                    },
                                    {
                                        "kid": "1000_2",
                                        "label": null,
                                        "name": "诱发因素",
                                        "type": "checkbox",
                                        "value": [
                                            "1000_2_1",
                                            "1000_2_2"
                                        ],
                                        "options": [
                                            {
                                                "kid": "1000_2_1",
                                                "label": null,
                                                "name": "劳累",
                                                "type": "value",
                                                "unit": null
                                            },
                                            {
                                                "kid": "1000_2_2",
                                                "label": null,
                                                "name": "休克",
                                                "type": "value",
                                                "unit": null
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        "status": "ok",
        "description": "数据请求成功"
    })

    res.json(data)
});

router.get('/view/module/:moduleId', function(req, res, next) {
    moduleId = req.query.moduleId

    var data = mockjs.mock({
        "data": [
            {
                "kid": "1",
                "label": null,
                "name": "症状",
                "type": "label",
                "hasSearch": "true",
                "notHasAttribute": "false",
                "remark": "",
                "childs": [
                    {
                        "type": "tree",
                        "kid": "100",
                        "label": null,
                        "name": "常见症状",
                        "childs": [
                            {
                                "type": "tree",
                                "kid": "100_1",
                                "label": null,
                                "name": "乏力",
                                "childs": null
                            },
                            {
                                "type": "tree",
                                "kid": "100_2",
                                "label": null,
                                "name": "头晕",
                                "childs": null
                            }
                        ]
                    },
                    {
                        "type": "tree",
                        "kid": "101",
                        "label": null,
                        "name": "胸部",
                        "childs": [
                            {
                                "type": "tree",
                                "kid": "101_1",
                                "label": null,
                                "name": "胸闷",
                                "childs": null
                            },
                            {
                                "type": "tree",
                                "kid": "101_2",
                                "label": null,
                                "name": "胸痛",
                                "childs": null
                            }
                        ]
                    }
                ]
            }
        ],
        "status": "ok",
        "description": "数据请求成功"
    });

    res.json(data)
});


router.get('/view1/module/:moduleId', function(req, res, next) {
    moduleId = req.query.moduleId

    var data = mockjs.mock({
        "data": [
            {
                "kid": "1",
                "label": "symptom",
                "name": "症状",
                "type": "lable",
                "remark": "这里是备注呀",
                "hasSearch": "true",
                "notHasAttribute": "true",
                "childs": [
                    {
                        "kid": "1000",
                        "label": null,
                        "name": "胸痛",
                        "origin": "模板预设值",
                        "type": "entity",
                        "relate": null,
                        "childs": [
                            {
                                "kid": "1000_1",
                                "label": null,
                                "name": "发病时长",
                                "type": "smallText",
                                "value": "12",
                                "valueUnit": "1000_1_1",
                                "unit": [
                                    {
                                        "kid": "1000_1_1",
                                        "label": null,
                                        "name": null,
                                        "type": "value",
                                        "unit": "天"
                                    },
                                    {
                                        "kid": "1000_1_2",
                                        "label": null,
                                        "name": null,
                                        "type": "value",
                                        "unit": "年"
                                    }
                                ]
                            },
                            {
                                "kid": "1000_2",
                                "label": null,
                                "name": "诱发因素",
                                "type": "checkbox",
                                "value": [
                                    "1000_2_1",
                                    "1000_2_2"
                                ],
                                "options": [
                                    {
                                        "kid": "1000_2_1",
                                        "label": null,
                                        "name": "劳累",
                                        "type": "value",
                                        "unit": null
                                    },
                                    {
                                        "kid": "1000_2_2",
                                        "label": null,
                                        "name": "休克",
                                        "type": "value",
                                        "unit": null
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ],
        "status": "ok",
        "description": "数据请求成功"
    });

    res.json(data)
});



module.exports =  router