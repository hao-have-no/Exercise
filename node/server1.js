const cheerio = require("cheerio");
const superagent = require("superagent");
const fs = require("fs");
const nodeSchedule = require("node-schedule");
const weiboUrl = "https://s.weibo.com";
const hotSearchURL = weiboUrl + "/top/summary?cate=realtimehot";


/**
 * 获取热搜列表数据
 */

function getHotSearchList(){
    return new Promise((resolve,reject)=>{
        superagent.get(hotSearchURL,(err,res)=>{
            if (err) reject("request error");
            const $ = cheerio.load(res.text);
            let hotList=[];
            $("#pl_top_realtimehot table tbody tr").each(function (index) {
                console.log(index);
               if (index !== 0){

                   const $td = $(this).children().eq(1);
                   const link = weiboUrl+$td.find("a").attr("href");
                   const text = $td.find("a").text();
                   const hotValue = $td.find("span").text();
                   const icon　= $td.find("img").attr('src')?`https:${$td.find("img").attr('src')}`:"";
                   hotList.push({
                       index,link,text,hotValue,icon
                   })
               }
            });
            hotList.length?resolve(hotList):reject("error");
        })
    })
}


/**
 * 每分钟第30秒定时执行爬取任务
 */
nodeSchedule.scheduleJob("10 * * * * *", async function () {
    try {
        const hotList = await getHotSearchList();
        console.log('集合',hotList);
        await fs.writeFileSync(
            `${__dirname}/hotSearch.json`,
            JSON.stringify(hotList),
            "utf-8"
        );
        console.log("写入成功", Date.now());
    } catch (error) {
        console.error(error);
    }
});
