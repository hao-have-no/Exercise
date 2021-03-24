### 上传文件知识点串讲

## 前置：如果通过二进制的标识来分别图片类型
> png:图片头以89 50 4E 0B 0A 1A 0A开头
> const ret = await(this.blobToStrng(file.slice(0,8)))
> const png= ret = '89 50 4E 0B 0A 1A 0A'

> jpg: 图片头:FF D8  图片尾：FF D9
> const start = await this.blobToString(file.slice(0,2))
> const tail = await this.bolbToString(file.slice(-2,len))
> const jpg= start === 'FF D8' && tail === 'FF D9'

> gif: 图片头:47 49 46 38 39 61  或者 47 49 46 38 37 61

> BMP: 文件头标识: 42 4D


## 实时获取图片的上传状态，上传进度，取消，报错等状态，浏览器存在兼容问题
### XMLHttpRequest
> var xhr = new XMLHttpRequest();
> 常用的几种状态
> xhr.onreadystatechange请求到达服务器后的响应函数
+ 通过判断xhr.readyState == 4  !会有问题absord后会更新状态 通过xhr.uploaded（自定义属性）判断上传状态
> xhr.onprogress = updateProgress;　监听上传进度
> xhr.upload.onprogress = updateProgress;
> event.lengthComputable　是否可计算传输的长度
> 通过event.loaded/event.total 可判断目前上传进度

### 拖拽上传/粘贴上传
> box.addEventListener("drop",(e)=>{
> e.dataTransfer.files; //获取拖拽中的文件对象

### 大文件上传/切片上传/断点续传
> 文件都是二进制流的形式，可以根据制定的大小将文件分割为不同大小的文件片段
  + 基本单位为Blob,可以进行文件的切割
> 碎片清理，碎片备份，碎片存储在不同的机器上
  + hash比较
> 每个文件都生成唯一的hash标识(hash抽样，全量hash　上传比较文件)
+ spark-md5 能够快速的生成文件的md5标识
+ 取头部，中间每部分文件开头和结尾两个字符，末尾，文件生成文件片段
+ 借助new FileReader().readAsArrayBuffer() 读取文件
+ 触发 new FileReader().onload方法，spark.append(e.target.result)生成文件的md5标识
 
> 请求并发控制，限定每个时刻的请求数量；错误重试
+ 原因:promise.all同时发起这些请求，会造成http链接的负载
+ 并发数控制:
  1. 通过设置最多请求数count,循环发送时，记录状态，发送成功后删除空间，将下一个请求带入；
  2. try,catch来进行错误的预防
> 上传效率:借助ffiber架构
  1. 通过requestIndleCallback利用浏览器空余渲染时间进行计算
  2. web-worker开启多线程

> 文件片段大小不一:tcp慢启动原则，动态计算每段文件大小
+ 慢启动
  1. 动态切割文件
  2. 通过比较时间，完成速率的计算
  3. 按照比率切割下一次发送的文件碎片大小
> 请求分为两部分 发送文件与最后的合并文件请求
> websocket推送
