# 如何通过 Node 搭建一个 chat-gpt 服务

- 1. 创建 node 服务
- 2. 引入 axios，
- 3. socks-proxxy-agent(配置代理，利用代理服务器来在客户端和服务器之间转发流量，保证服务速度)
- 4. 对接 OPEN-AI(chat-gpt 服务)
- 5. HTML 建立 eventSourceEvent-SSE 单方面长链接接收客户端消息

### 服务端代码

```
// 从http中导入createServer方法，目的是创建一个web服务
import { createServer } from "http";
// 导入axios
import axios from "axios";
// 导入dotenv
import "dotenv/config";
// 导入socks-proxy-agent
import { SocksProxyAgent } from "socks-proxy-agent";
// 导入stream
import { Stream } from "stream";
// 导入fs
import { createReadStream } from "fs";
const socksProxy = process.env.SOCKS_PROXY;
// 检查 socksProxy 是否为 undefined
if (socksProxy === undefined) {
  throw new Error("SOCKS_PROXY environment variable is not defined");
}
// 创建axios的一个api实例
const api = axios.create({
  baseURL: "https://api.openai.com/v1", //这里写的就是ChatGPT的接口地址
  timeout: 5000, // 可以不写
  headers: {
    "Content-Type": "application/json", // 这个可以不写，重要的是下面的Authorization
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // 这里是咱们自己的token
  },
  //   因为我们请求的是https，所以需要设置代理
  httpsAgent: new SocksProxyAgent(socksProxy),
});

createServer(async (req, res) => {
  // console.log(req.url);// 来看一下req的url，看他请求的是什么
  // 因为如果地址后面有参数的话，会被忽略掉，所以我们需要将url转化为一个URL对象
  const url = new URL(req.url!, "file:///");
  //entries()是返回了键值对的一个数组；Object.fromEntries()是将键值对数组转化为一个对象
  const query = Object.fromEntries(url.searchParams.entries());
  console.log(query);

  // return res.end(url.pathname),// 这里输出url的pathname，也就是请求的接口地址，他就会是一个纯路径

  // 做个判断，看看请求的是什么接口,这个url中会包含接口的很多信息
  switch (url.pathname) {
    // 让数据以流的形式返回给客户端
    case "/":
      createReadStream("./index.html").pipe(res);
      break;
    // 如果请求的是/chat接口的话，执行的就是之前写的ChatGPT接口那一部分的内容了
    case "/chat":
        // 一定要加，要不然浏览器控制台会报错
        res.setHeader("Content-Type", "text/event-stream");
        if(!query.prompt){
            res.statusCode = 400;
            return res.end(JSON.stringify({
                message: "请输入提问内容"
            }))
        }
      // 这里是ChatGPT的接口根地址,返回的数据是JSON格式。post默认的是任何格式，但是这里是stream格式
      const { data } = await api.post<Stream>(
        "chat/completions",
        {
          // 这里是ChatGPT的JSON数据
          model: "gpt-3.5-turbo",
          // 但是一定要确保prompt是字符串格式且存在，所以在上面加一个判断
          messages: [{ role: "user", content: query.prompt}],
            // max_tokens: 100, // 测试的时候加一个max_tokens，目的是控制ChatGPT的输出长度，可以减少请求的时间
          temperature: 0.7,
          stream: true,
        },
        {
          // 设置返回的数据类型为stream。stream是node.js中专门用来处理流数据的。他可以不断的将数据流输出到res响应的对象中，所以它可以实现流式的传输数据
          responseType: "stream",
        }
      );
      data.pipe(res); // 可以直接流向res响应的对象
      break;
    default:
        // 如果请求的接口地址不在上面定义的接口地址中，就返回一个空的字符串
      res.end('')
  }

  //res.end无法直接返回JSON格式，需要利用JSON.stringify()转成字符串。但是因为ChatGPT的返回是stream格式，所以需要用pipe方法将stream转成字符串，这里就把JSON给注销了
  //   res.end(JSON.stringify(data));
}).listen(9002); // 这个9001是监听的端口号

console.log("http://localhost:9002");

`
```

### env

```
OPENAI_API_KEY = 你自己的key
SOCKS_PROXY = socks5://127.0.0.1:7890
```

### html 页面部分-主要建立 strean 流数据接收

```
// 定义一个url，根地址是当前页面的地址
const url = new URL('/chat',location.href)
// 将prompt添加到url中,直接可以拼接参数，不需要手写。设置一个参数，键名为prompt，值为上面传进来的prompt
url.searchParams.set('prompt',prompt)
// url定义好之后就直接给es就行了，发起请求就是在这一步。new了一个EventSource就是发起
const es = new EventSource(url)

// 在连接之前清空之前的记录
out.innerHTML = ''


// es就可以监听到服务器的推送了。得到一个e是message响应的事件。onmessage是服务端响应的过程中，每一次响应都会触发onmessage事件；直到输出[DONE]，然后return es.close()，把这个页面的监听关掉。
// 注意：这里的e是message事件，不是message响应的事件。
es.onmessage = (e) => {
    // e.data就是服务器返回的数据
    // console.log(e.data);
    if(e.data ==='[DONE]'){
        // 当服务器推送[DONE]时，关闭es。这就意味着服务器EventSource已经推送完毕了。
        return es.close();
    }
    // 定义一个data变量，将服务器返回的数据转换为JSON格式
    const data = JSON.parse(e.data);
    // 获取content。从浏览器的控制台中可以看到服务器返回的数据，里面的内容就在choices下面的delta中的content里。如果content为空，则给一个空的字符串
    const {content = ''} = data.choices[0].delta;
    // 然后在收到任何一个content之后把他加进去
    out.innerHTML += content;
    console.log(content);
}
```
