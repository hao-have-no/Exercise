const WebSocket=require('ws');
const redis = require('redis');
const clientRedis = redis.createClient(); // 创建redis客户端
const ws = new WebSocket.Server({ port: 9999 }); // 创建ws服务
let clients=[];//保存不同的用户

//ws进行监听
ws.on('connection',socket=>{
   clients.push(socket);//把socket实例添加到数组

   //通过redis客户端的Lrange
   clientRedis.lrange('barrage',0,-1,(err,data)=>{
       data=data.map(item=>JSON.parse(item));

       socket.send(JSON.stringify({
           type:'init',
           data
       }));
   });

   //监听客户端发来的信息
    socket.on('message',data=>{
        //将消息添加到数据库的最后
        clientRedis.rpush('barrage',data);
        clients.forEach(sk=>{
            sk.send(JSON.stringify({
                type:'add',
                data:JSON.parse(data)
            }));
        });
    });

    //当有socket实例断开与ws服务端的链接
    //重新更新一下clients数据,去掉断开的用户
    socket.on('close',()=>{
        clients=clients.filter(client=>client !== socket);
    });

});
