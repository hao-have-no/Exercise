const Koa = require('koa')
const fs = require('fs')
const path = require('path')
const mimes = {
  css: 'text/css',
  less: 'text/css',
  gif: 'image/gif',
  html: 'text/html',
  ico: 'image/x-icon',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  js: 'text/javascript',
  json: 'application/json',
  pdf: 'application/pdf',
  png: 'image/png',
  svg: 'image/svg+xml',
  swf: 'application/x-shockwave-flash',
  tiff: 'image/tiff',
  txt: 'text/plain',
  wav: 'audio/x-wav',
  wma: 'audio/x-ms-wma',
  wmv: 'video/x-ms-wmv',
  xml: 'text/xml',
}

// 获取文件的类型
function parseMime(url) {
  // path.extname获取路径中文件的后缀名
  let extName = path.extname(url)
  extName = extName ? extName.slice(1) : 'unknown'
  return mimes[extName]
}

// 将文件转成传输所需格式
const parseStatic = (dir) => {
  return new Promise((resolve) => {
    resolve(fs.readFileSync(dir), 'binary')
  })
}

// 协商缓存-获取文件信息
const getFileStat = (path) => {
  return new Promise((resolve) => {
    fs.stat(path, (_, stat) => {
      resolve(stat)
    })
  })
}


const app = new Koa()

app.use(async (ctx) => {
  const url = ctx.request.url
  if (url === '/') {
    // 访问根路径返回index.html
    ctx.set('Content-Type', 'text/html')
    ctx.body = await parseStatic('./index.html')
  } else {
    const filePath = path.resolve(__dirname, `.${url}`)
    // 设置类型
    ctx.set('Content-Type', parseMime(url))
     // 设置 Expires 响应头
    //  const time = new Date(Date.now() + 30000).toUTCString()
    //  ctx.set('Expires', time)

     // 设置 Cache-Control 响应头
    //  ctx.set('Cache-Control', 'max-age=30')
    
    // 设置协商缓存
    const ifModifiedSince = ctx.request.header['if-modified-since']
    const fileStat = await getFileStat(filePath)
    console.log(new Date(fileStat.mtime).getTime())
    ctx.set('Cache-Control', 'no-cache')
    ctx.set('Content-Type', parseMime(url))

    // 比对时间，mtime为文件最后修改时间
    if (ifModifiedSince === fileStat.mtime.toGMTString()) {
      ctx.status = 304
    } else {
      ctx.set('Last-Modified', fileStat.mtime.toGMTString())
      ctx.body = await parseStatic(filePath)
    }

    // 非协商缓存的正常返回配置，设置传输
    // ctx.body = await parseStatic(filePath)
  }
})

app.listen(9898, () => {
  console.log('start at port 9898')
})