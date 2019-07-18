// 全部 住院 门诊
let all = null;
let hospitalization = null;
let outpatient = null;
getData(6).then(res => {
    getDiseaseRankingData(res);
    new Swiper('#statistics-center-swiper-right', {
        autoplay: {
            delay: 4000
        },
        effect : 'slide',
        fadeEffect: {
            crossFade: true,
        },
        on: {
            slideChangeTransitionStart: function(){
                $('#all-li ul li').removeClass('active')
                $(`#all-li ul li:eq(${this.activeIndex})`).addClass('active')
            }
        },
    })
})
/**
 * 疾病排行 获取数据
 * @param {*} data 数据
 * @param {*} type 0：全部 1：住院 2：门诊
 */
function getDiseaseRankingData(data) {
    let allDom = '<ul class="swiper-slide">';
    let hospitalizationDom = allDom;
    let outpatientDom = allDom;
    let allNum = 1;
    let hospitalizationNum = 1;
    let outpatientNum = 1;
    let num = 1;
    data.forEach(item => {
        switch(item.type) {
            case 0:
                num = allNum;
                break;
            case 1:
                num = outpatientNum;
                break;
            case 2:
                num = hospitalizationNum;
                break;
        }
        let dom = `
            <li class="display-flex text-align-center vertical-margin-sm">
                <div class="flex-1 diseaseIndex">${num}</div>
                <div class="flex-7 diseaseName text-overflow-ellipsis">${item.zhuzhendmc || '未知疾病'}</div>
                <div class="progress flex-10">
                    <div class="text-align-center" style="width: ${item.ratio}"></div>
                    <span>${item.ratio}<span>
                </div>
                <div class="flex-3 diseaseNum margin-right-sm">${item.mz ? item.mz.toLocaleString() : 0}</div>
            </li>
        `;
        switch(item.type) {
            case 0:
                allNum += 1
                allDom += dom;
                break;
            case 2:
                hospitalizationNum += 1
                hospitalizationDom += dom;
                break;
            case 1:
                outpatientNum += 1
                outpatientDom += dom;
                break;
        }
    })
    allDom += '</ul>';
    hospitalizationDom += '</ul>';
    outpatientDom += '</ul>';
    $("#diseaseRanking").html(allDom + hospitalizationDom + outpatientDom);
}