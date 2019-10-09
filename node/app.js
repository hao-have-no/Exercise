const Koa=require("koa");
const Router=require("koa-router");
const bodyParser=require("koa-bodyparser");
const md5=require("crypto-js/md5");
const jwt=require("jsonwebtoken");
const Sequelize=require("sequelize");//mysql的封装
const User=require("./bean/user.js");
const config=require("./config");

const app=new Koa();
const router=new Router();

app.use(bodyParser);

/**
 * 建立用户
 */
 router.post("/user",async (ctx,next)=>{
    const {username="",passsword="",isAdmin}=ctx.request.body||{};
    if (username ===""||passsword === ""){
        ctx.status =401;
        return (ctx.body={
            success:false,
            code:10000,
            msg:"用户名或者密码不能为空"
        })
    }
     var app = this.app;
    //先对密码md5
     const md5Password=md5(String(password)).toString();
     // 生成随机salt
     const salt = String(Math.random()).substring(2, 10);
     // 生成新的md5
     const saltMD5PassWord = md5(`${md5Password}:${salt}`).toString();
     try{
         //类似用户查找
         const searchUser=await User.findByName(username);
         if (!searchUser){
             const result=await User.addUser({username,saltMD5PassWord,salt,isAdmin});
             ctx.body={
                 success:true,
                 msg:'创建成功'
             }
         }else{
             ctx.body = {
                 success: false,
                 msg: "已存在同名用户"
             };
         }
     }catch (error) {
         ctx.body = {
             success: false,
             msg: "serve is mistakes"
         };
     }
 });

/**
 * 用户登录
 */
router.post("/login",async (ctx, next)=>{
    const { username = "", password = "" } = ctx.request.body || {};
    if (username === "" || password === "") {
        ctx.status = 401;
        return (ctx.body = {
            success: false,
            code: 10000,
            msg: "用户名或者密码不能为空"
        });
    }
    // 一般客户端对密码需要md5加密传输过来, 这里我就自己加密处理,假设客户端不加密。
    // 类似用户查找,保存的操作一般我们都会封装到一个实体里面,本demo只是演示为主, 生产环境不要这么写
    try {
        // username在注册时候就不会允许重复
        const searchUser = await User.findByName(username);
        if (!searchUser) {
            ctx.body = {
                success: false,
                msg: "用户不存在"
            };
        } else {
            // 需要去数据库验证用户密码
            const md5PassWord = md5(String(password)).toString();
            const saltMD5PassWord = md5(
                `${md5PassWord}:${searchUser.salt}`
            ).toString();
            if (saltMD5PassWord === searchUser.password) {
                // Payload: 负载, 不建议存储一些敏感信息
                const payload = {
                    id: searchUser.name
                };
                const token = jwt.sign(payload, config.active, {
                    expiresIn: "2h"
                });
                ctx.body = {
                    success: true,
                    data: {
                        token
                    }
                };
            } else {
                ctx.body = {
                    success: false,
                    msg: "密码错误"
                };
            }
        }
    } catch (error) {
        ctx.body = {
            success: false,
            msg: "serve is mistakes"
        };
    }
});

/**
 * @description 获取用户信息
 */
router.get(
    "/user",
    async (ctx, next) => {
        // 这里应该抽成一个auth中间件
        const token = ctx.request.query.token || ctx.request.headers["token"];
        if (token) {
            jwt.verify(token, config.active, async function(err, decoded) {
                if (err) {
                    return (ctx.body = {
                        success: false,
                        msg: "Failed to authenticate token."
                    });
                } else {
                    ctx.decoded = decoded;
                    await next();
                }
            });
        } else {
            ctx.status = 401;
            ctx.body = {
                success: false,
                msg: "need token"
            };
        }
    },
    async (ctx, next) => {
        try {
            const id= ctx.decoded;
            console.log("code",id);
            // ctx.body = {
            //     success: true,
            //     data: { name, age, isAdmin }
            // };
        } catch (error) {
            ctx.body = {
                success: false,
                msg: "server is mistakes"
            };
        }
    }
);
app.use(router.routes()).use(router.allowedMethods());
app.on("error", (err, ctx) => {
    console.error("server error", err, ctx);
});
app.listen(3000, () => {
    console.log("Server listening on port 3000");
});
