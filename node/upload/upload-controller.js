const path = require('path')
//文件操作相关工具库
const fse = require("fs-extra");
const fs = require('fs');
const multiparty = require("multiparty")
const { resolvePost, pipeStream,extractExt,getUploadedList,mergeFiles } = require('./utils')
const uploadHost = `http://192.168.1.13:8085/files/`;



class Controller {
    constructor(uploadDir) {
        this.UPLOAD_DIR = uploadDir
    }
    async mergeFileChunk(filePath, fileHash, size){
        // cpmspe/pg)
        const chunkDir = path.resolve(this.UPLOAD_DIR, fileHash)
        let chunkPaths = await fse.readdir(chunkDir)
        // 根据切片下标进行排序
        // 否则直接读取目录的获得的顺序可能会错乱
        chunkPaths
            .sort((a, b) => a.split("-")[1] - b.split("-")[1])
        chunkPaths = chunkPaths.map(cp=>path.resolve(chunkDir, cp)) // 转成文件路径
        await mergeFiles(chunkPaths,filePath,size)
    }


    async handleVerify(req, res) {
        console.log('data',req.body);
        const data = req.body;
        const { filename, hash } = data;
        //文件后缀
        const ext = extractExt(filename)
        //文件路径地址
        const filePath = path.resolve(this.UPLOAD_DIR, `${hash}${ext}`)

        // 文件是否存在
        let uploaded = false
        let uploadedList = []
        if (fse.existsSync(filePath)) {
            uploaded = true
        }else{
            // 文件没有完全上传完毕，但是可能存在部分切片上传完毕了
            uploadedList = await getUploadedList(path.resolve(this.UPLOAD_DIR, hash))
        }
        console.log(uploaded,uploadedList);
        res.end(
            JSON.stringify({
                uploaded,
                uploadedList // 过滤诡异的隐藏文件
            })
        )

    }


    async handleMerge(req, res) {

        const data = req.body;
        const {fileHash, filename, size } = data
        const ext = extractExt(filename)
        //文件路径
        let filePath = path.resolve(this.UPLOAD_DIR, `${fileHash}${ext}`)
        await this.mergeFileChunk(filePath, fileHash, size);
        fs.chmod(filePath,'0775',function(err){
            if (err){
                console.log(err);
            }
        });
        filePath=filePath.replace('/opt/Exercise/node/static/uploads/',uploadHost);
        res.end(
            JSON.stringify({
                code: 0,
                fileName:filename,
                filePath:filePath,
                message: "file merged success"
            })
        )


    }


    async handleUpload(req, res) {
        //获取到媒体类型的数据
        const multipart = new multiparty.Form();
        multipart.parse(req, async (err, field, file) => {
            if (err) {
                console.log(err)
                return
            }
            //文件片断的信息
            const [chunk] = file.chunk;
            const [hash] = field.hash;
            const [filename] = field.filename;
            const [fileHash] = field.fileHash;
            //把一个路径或路径片段的序列解析为一个绝对路径
            //生成文件地址
            const filePath = path.resolve(
                this.UPLOAD_DIR,
                `${fileHash}${extractExt(filename)}`
            );
            //生成文件片段地址
            const chunkDir = path.resolve(this.UPLOAD_DIR, fileHash);
            console.log(chunkDir);

            // 文件存在直接返回，判断当前路径下是否存在文件
            if (fse.existsSync(filePath)) {
                res.end("file exist");
                return
            }

            //如果没有的话，递归生成目录
            if (!fse.existsSync(chunkDir)) {
                await fse.mkdirs(chunkDir)
            }

            //将文件移入文件夹 move(oldUrl:源路径,tarUrl：目录路径)
            await fse.move(chunk.path, `${chunkDir}/${hash}`);
            console.log('chunk',chunk.path);
            res.end("received file chunk")
        })
    }
}


module.exports = Controller;
