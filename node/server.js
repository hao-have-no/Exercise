
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



//允许跨域

app.use(cors({
    credentials: true, //是否允许发送Cookie
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //设置服务器支持的所有头信息字段
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] //设置获取其他自定义字段
}));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/record', apiRouter);

app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1');
    // res.header("Content-Type", "application/json;charset=utf-8");
    next();
});


// 启动前端数据接口代理服务
app.listen({
    host: '192.168.1.13',
    port: 12138,
}, function() {
    console.log("前端数据接口代理服务启动成功!\n访问地址: http://" + this.address().address + ':' + this.address().port)
})
