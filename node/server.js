
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
// 引入接口路由模块
const apiRouter = require('./api-route')
//引入对话中间件－分发session
const session=require('express-session')

const app = express();//声明服务器实例

app.set('trust proxy', 1)
app.use(session({
    secret: 'keyboard cat',//与cookieParser中的一致
    resave: true,
    saveUninitialized:true
}))



app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use('/record', apiRouter)


// 启动前端数据接口代理服务
app.listen({
    host: 'localhost',
    port: 12138,
}, function() {
    console.log("前端数据接口代理服务启动成功!\n访问地址: http://" + this.address().address + ':' + this.address().port)
})
