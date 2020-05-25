const http = require("http");
const koaStatic = require("koa-static");
const path = require("path");
const koaBody = require("koa-body");
const fs = require("fs");
const Koa = require("koa2");
const cors = require("koa2-cors");
const Router = require("koa-router");

const app  = new Koa();
const router = new Router();
//允许跨域

app.use(cors({
    credentials: true, //是否允许发送Cookie
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //设置服务器支持的所有头信息字段
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] //设置获取其他自定义字段
}));


const port = process.env.PORT|| '8310';

app.use(koaBody({
    formidable:{
        //设置文件的默认暴露目录，不设置保存在临时文件夹下ｏｓ
        uploadDir:path.resolve(__dirname,'static/uploads')
    },
    multipart:true//可以多文件上传
}));

//开启静态文件访问
app.use(koaStatic(
    path.resolve(__dirname,'static')

));

//普通的文件上传
router.post('/upload',async (ctx)=>{
   ctx.body = "访问成功";
    var files = ctx.request.files?ctx.request.files.formFile:[];//获取文件对象
    var result = [];

    if (!Array.isArray(files)){
        files=[files];
    }
    console.log('文件',JSON.stringify(files));
    if (files&&files.length > 0){
        // console.log('files',files);
        files&&files.forEach(item=>{
            var path = item.path.replace(/\\/g, '/');//全局替换\为/
            var fname = item.name;//原文件内容
            var nextPath = path+fname;

            //对文件进行重新命名
            if (item.size>0 && path){　　
                //得到扩展名
                var extArr = fname.split(',');
                // console.log('extArr',extArr);
                var ext = extArr[extArr.length-1];
                // console.log('ext',ext);
                nextPath = `${path}.${ext}`;
                // console.log('nextPath',nextPath);
                fs.renameSync(path,nextPath); //重命名文件
                fs.chmod(nextPath,'0775',function(err){
                    if (err){
                        console.log(err);
                    }
                });

                // console.log('地址',`${uploadHost}${nextPath.slice(nextPath.lastIndexOf('/')+1)}`);
                result.push(`${uploadHost}${nextPath.slice(nextPath.lastIndexOf('/')+1)}`);
            }

            //以json形式输出上传文件的地址
            // console.log('最宗结果',JSON.stringify(result));
            // console.log(ctx.response);
            ctx.body = {
                    success: true,
                    msg: "上传成功",
                    fileUrl:result
                };
        });
    }else{
        ctx.body = "没有文件，请检查是否选择文件";
    }
});

//大文件上传－切片
router.post('/uploadBigFile',async (ctx)=>{
     var body = ctx.request.body;
     var files = ctx.request.files?ctx.request.files.formFile:[];
     var result = [];
     var fileToken = body.token||'';　//文件标识
     var fileIndex = body.index || null; //文件下标

    console.log(fileToken,fileIndex);

    // if ((!files||files.length === 0)&&body.type !== 'merge'){
    //     ctx.body = "没有文件，请检查是否选择文件";
    //     return
    // }


    if (files&&!Array.isArray(files)){
        files = [files];
    }

    files&&files.forEach(item=> {
        var path = item.path.replace(/\\/g, '/');
        var nextPath = path.slice(0, path.lastIndexOf('/') + 1) + fileIndex + '-' + fileToken;
        if (item.size > 0 && path) {
            //重命名文件,并赋予权限
            fs.renameSync(path, nextPath);
            fs.chmod(nextPath,'0775',function(err){
                if (err){
                    console.log(err);
                }
            });
            result.push(uploadHost + nextPath.slice(nextPath.lastIndexOf('/') + 1));
        }
    });
    ctx.body = `{ "fileUrl":${JSON.stringify(result)}}`;

    if (body.type === 'merge'){
        console.log('merge');
        //合并文件
        var fileName = body.fileName;
        //确认文件碎片数量和存储位置
        chunkCount =　body.chunkCount,
            folder = path.resolve(__dirname,'static/uploads')+'/';

        //创建可写流
        var writeStream = fs.createWriteStream(`${folder}${fileName}`);

        var cindex = 1;

        //开始合并文件
        function mergeFile(){
            var fname = `${folder}${cindex}-${fileToken}`; //存储文件碎片的命名
            console.log('file',fname);
            var readStream = fs.createReadStream(fname);
            readStream.pipe(writeStream,{end:false}); //链式读写流
            readStream.on('end',()=>{
                console.log('结束');
                fs.unlink(fname,(error)=>{//合并完成删除当前文件
                    if (error){
                        console.log(error);
                    }
                });

                if (cindex<chunkCount){
                    cindex +=1;
                    mergeFile();
                }
            })
        }
        mergeFile();
        ctx.body =  {
            success: true,
            msg: "上传成功",
            fileUrl:`${uploadHost}${body.fileName}`
        };
    }

});



//启动服务器
app.use(router.routes());
const server = http.createServer(app.callback());
server.listen(port,()=>{
    console.log(`文件服务器已启动,地址:${JSON.stringify(port)}`);
});
