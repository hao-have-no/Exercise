const titleCfg = {
    header: ['上月门诊人次', '上月住院人次', "上月体检人次", "市机构数量"]
}
// 顶部统计部分
getData(1).then(res => {
    createTopDom(res)
})

// 慢病排行
getData(7).then(res => {
    let chronicDom = '';
    res.forEach((item, index) => {
        chronicDom += `
            <li class="display-flex text-align-center vertical-margin-sm">
                <div class="flex-1 diseaseIndex">${index + 1}</div>
                <div class="flex-7 diseaseName text-overflow-ellipsis">${item.illn_name}</div>
                <div class="progress flex-10">
                    <div class="text-align-center" style="width: ${item.ratio}"></div>
                    <span>${item.ratio}<span>
                </div>
                <div class="flex-3 diseaseNum margin-right-sm">${item.con ? item.con.toLocaleString() : 0}</div>
            </li>
        `;
    })
    $(".chronic").html(chronicDom);
})

updateTime();
setInterval(() => {
    updateTime()
}, 1000);
let windowReloadTimer = null;
//窗口改变刷新页面
$(window).on('resize', () => {
    if(windowReloadTimer) {
        clearTimeout(windowReloadTimer);
    }
    windowReloadTimer = setTimeout(() => {
        window.location.reload();
    }, 500);
})
/**
 * 更新 页面header 部分日期
 */
function updateTime() {
    let timestamp = Date.parse(new Date());
    let now = timetrans(timestamp);
    $('header div.time').html(now);
}
/**
 * 时间戳转 日期
 * @param {*} timestamp 时间戳
 */
function timetrans(timestamp){
    const weeks = ['日', '一', '二', '三', '四', '五', '六']
    const date = new Date(timestamp);//如果date为13位不需要乘1000
    const Y = `${date.getFullYear()}年`;
    const M = `${(date.getMonth()+1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth()+1)}月`;
    const D = `${(date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate())}日 `;
    const h = `${(date.getHours() < 10 ? '0' + date.getHours() : date.getHours())}:`;
    const m = `${(date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes())}:`;
    const s = `${(date.getSeconds() <10 ? '0' + date.getSeconds() : date.getSeconds())}`;
    const w = `星期${weeks[date.getDay()]} `;
    return Y+M+D+w+h+m+s;
}

/**
 * 根据ID 获取相应数据
 * @param {*} type 数据ID
 */
function getData(type) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: `data/big-screen-${type}`,
            type:'get',
            contentType: false, // 关关关！必须得 false
            processData: false,
            success: res => {
                resolve(res.data.result)
            }
        })
    })
    
}
/**
 * 生成 顶部统计部分 dom 节点并插入页面
 * @param {*} data 数据
 */
function createTopDom(data) {
    data = data[0]
    let dom = '';
    Object.keys(data).forEach(item => {
        let title = '';
        let type  = '';
        switch(item) {
            case 'mz':
                title = titleCfg.header[0];
                type = '总人次'
                break;
            case 'zy':
                title = titleCfg.header[1];
                type = '总人次'
                break;
            case 'tj':
                title = titleCfg.header[2];
                type = '总人次'
                break;
            case 'jg':
                title = titleCfg.header[3];
                type = '家'
                break;
        }
        if(item != 'cj') {
            dom += `
                <li class="text-align-center flex-1 position-relative bg padding-title">
                    <p class="font-weight-bold number-animate" data-num="${data[item]}">0</p>
                    <p>${type}</p>
                    <div class="bg-title">${title}</div>
                </li>
           `
        }
    })
    $('.statistics-num ul').html(dom);
    eachNumDom()
    setInterval(() => {
        eachNumDom()
    }, 1*60*1000);
}
// 数字滚动动画
function numAnimate(dom) {
    let num = $(dom).data('num');
    let speed = Math.ceil(num / 30);
    let number = 0;
    let timer = setInterval(() => {
        number += speed
        if(number >= num) {
            number = num;
            clearInterval(timer)
        }
        $(dom).html(number.toLocaleString())
    }, 50);
}
// 遍历需要滚动的数字
function eachNumDom() {
    $('.number-animate').each((index, numDom) => {
        numAnimate(numDom)
    }) 
}
