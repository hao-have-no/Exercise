// 服务端点对点通信
let Ws = require("ws").Server;
let wss = new Ws({
    port:8181
})
// 服务端1.保存所有连接的用户信息；2.保存所有连接的socket；（出重）
let socketObj = {};  //保存所有连接过来的socket
let users = [] //保存所有提交过来的用户；
wss.on("connection",ws=>{
    console.log("有连接过来...");
    let openid;
    ws.on("message",res=>{
        console.log(res);
        openid = JSON.parse(res).openid;
        // 一个用户只保存一个socket；
        socketObj[openid] = ws;
        // 保存用户信息；
        let result = users.filter(item=>item.openid==openid);
        if(result.length===0){
            users.push(JSON.parse(res)) ;
        }else{
            // 更新当前提交过来的用户信息（tapTime）;
            for(let i=0;i<users.length;i++){
                if(users[i].openid==openid){
                    users[i] = JSON.parse(res);
                }
            }
        }
        // 把收集到的用户信息 发送到客户端；
        for(let i in socketObj){
            socketObj[i].send(JSON.stringify(users));
        }
        // ws.send(JSON.stringify( {name:"李四"} ));

    })
    // socket断开连接 1. 清除当前socket； 2. 清除users里记录的用户；
    ws.on("close",()=>{
        // 1. 清除当前socket;
        delete socketObj[openid];
        // 2. 清除users里记录的用户；openid;
        let newUsers = users.filter(item=>item.openid!==openid);
        for(let i in socketObj){
            socketObj[i].send(JSON.stringify(newUsers));
        }
    })
})
